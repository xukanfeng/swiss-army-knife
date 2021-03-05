'use strict';

const AWS = require('aws-sdk');
const BbPromise = require('bluebird');
const crypto = require('crypto');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');

class AwsCompileFunctions {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    const servicePath = this.serverless.config.servicePath || '';
    this.packagePath =
      this.serverless.service.package.path || path.join(servicePath || '.', '.serverless');

    this.provider = this.serverless.getProvider('aws');

    this.ensureTargetExecutionPermission = _.memoize(this.ensureTargetExecutionPermission);
    if (
      this.serverless.service.provider.versionFunctions === undefined ||
      this.serverless.service.provider.versionFunctions === null
    ) {
      this.serverless.service.provider.versionFunctions = true;
    }

    this.hooks = {
      'package:compileFunctions': () =>
        BbPromise.bind(this)
          .then(this.downloadPackageArtifacts)
          .then(this.compileFunctions),
    };
  }

  compileRole(newFunction, role) {
    const compiledFunction = newFunction;
    const unsupportedRoleError = new this.serverless.classes.Error(
      `Unsupported role provided: "${JSON.stringify(role)}"`
    );

    switch (typeof role) {
      case 'object':
        if ('Fn::GetAtt' in role) {
          // role is an "Fn::GetAtt" object
          compiledFunction.Properties.Role = role;
          compiledFunction.DependsOn = (compiledFunction.DependsOn || []).concat(
            role['Fn::GetAtt'][0]
          );
        } else if ('Fn::ImportValue' in role) {
          // role is an "Fn::ImportValue" object
          compiledFunction.Properties.Role = role;
        } else {
          throw unsupportedRoleError;
        }
        break;
      case 'string':
        if (role.startsWith('arn:aws')) {
          // role is a statically defined iam arn
          compiledFunction.Properties.Role = role;
        } else if (role === 'IamRoleLambdaExecution') {
          // role is the default role generated by the framework
          compiledFunction.Properties.Role = { 'Fn::GetAtt': [role, 'Arn'] };
          compiledFunction.DependsOn = (compiledFunction.DependsOn || []).concat(
            'IamRoleLambdaExecution'
          );
        } else {
          // role is a Logical Role Name
          compiledFunction.Properties.Role = { 'Fn::GetAtt': [role, 'Arn'] };
          compiledFunction.DependsOn = (compiledFunction.DependsOn || []).concat(role);
        }
        break;
      default:
        throw unsupportedRoleError;
    }
  }

  downloadPackageArtifact(functionName) {
    const { region } = this.options;
    const S3 = new AWS.S3({ region });

    const functionObject = this.serverless.service.getFunction(functionName);
    const artifactFilePath =
      _.get(functionObject, 'package.artifact') ||
      _.get(this, 'serverless.service.package.artifact');

    const regex = new RegExp('s3\\.amazonaws\\.com/(.+)/(.+)');
    const match = artifactFilePath.match(regex);

    if (match) {
      return new BbPromise((resolve, reject) => {
        const tmpDir = this.serverless.utils.getTmpDirPath();
        const filePath = path.join(tmpDir, match[2]);

        const readStream = S3.getObject({
          Bucket: match[1],
          Key: match[2],
        }).createReadStream();

        const writeStream = fs.createWriteStream(filePath);

        readStream.on('error', error => reject(error));
        readStream
          .pipe(writeStream)
          .on('error', reject)
          .on('close', () => {
            if (functionObject.package.artifact) {
              functionObject.package.artifact = filePath;
            } else {
              this.serverless.service.package.artifact = filePath;
            }
            return resolve(filePath);
          });
      });
    }

    return BbPromise.resolve();
  }

  compileFunction(functionName) {
    return BbPromise.try(() => {
      const cfTemplate = this.serverless.service.provider.compiledCloudFormationTemplate;
      const functionResource = this.cfLambdaFunctionTemplate();
      const functionObject = this.serverless.service.getFunction(functionName);
      functionObject.package = functionObject.package || {};

      const serviceArtifactFileName = this.provider.naming.getServiceArtifactName();
      const functionArtifactFileName = this.provider.naming.getFunctionArtifactName(functionName);

      let artifactFilePath =
        functionObject.package.artifact || this.serverless.service.package.artifact;

      if (
        !artifactFilePath ||
        (this.serverless.service.artifact && !functionObject.package.artifact)
      ) {
        let artifactFileName = serviceArtifactFileName;
        if (this.serverless.service.package.individually || functionObject.package.individually) {
          artifactFileName = functionArtifactFileName;
        }

        artifactFilePath = path.join(
          this.serverless.config.servicePath,
          '.serverless',
          artifactFileName
        );
      }

      if (this.serverless.service.package.deploymentBucket) {
        functionResource.Properties.Code.S3Bucket = this.serverless.service.package.deploymentBucket;
      }

      const s3Folder = this.serverless.service.package.artifactDirectoryName;
      const s3FileName = artifactFilePath.split(path.sep).pop();
      functionResource.Properties.Code.S3Key = `${s3Folder}/${s3FileName}`;

      if (!functionObject.handler) {
        const errorMessage = [
          `Missing "handler" property in function "${functionName}".`,
          ' Please make sure you point to the correct lambda handler.',
          ' For example: handler.hello.',
          ' Please check the docs for more info',
        ].join('');
        throw new this.serverless.classes.Error(errorMessage);
      }

      const Handler = functionObject.handler;
      const FunctionName = functionObject.name;
      const MemorySize =
        Number(functionObject.memorySize) ||
        Number(this.serverless.service.provider.memorySize) ||
        1024;
      const Timeout =
        Number(functionObject.timeout) || Number(this.serverless.service.provider.timeout) || 6;
      const Runtime = this.provider.getRuntime(functionObject.runtime);

      functionResource.Properties.Handler = Handler;
      functionResource.Properties.FunctionName = FunctionName;
      functionResource.Properties.MemorySize = MemorySize;
      functionResource.Properties.Timeout = Timeout;
      functionResource.Properties.Runtime = Runtime;

      // publish these properties to the platform
      this.serverless.service.functions[functionName].memory = MemorySize;
      this.serverless.service.functions[functionName].timeout = Timeout;
      this.serverless.service.functions[functionName].runtime = Runtime;

      if (functionObject.description) {
        functionResource.Properties.Description = functionObject.description;
      }

      if (functionObject.condition) {
        functionResource.Condition = functionObject.condition;
      }

      if (functionObject.dependsOn) {
        functionResource.DependsOn = (functionResource.DependsOn || []).concat(
          functionObject.dependsOn
        );
      }

      if (functionObject.tags || this.serverless.service.provider.tags) {
        const tags = Object.assign({}, this.serverless.service.provider.tags, functionObject.tags);
        functionResource.Properties.Tags = [];
        _.forEach(tags, (Value, Key) => {
          functionResource.Properties.Tags.push({ Key, Value });
        });
      }

      if (functionObject.onError) {
        const arn = functionObject.onError;

        if (typeof arn === 'string') {
          const splittedArn = arn.split(':');
          if (splittedArn[0] === 'arn' && (splittedArn[2] === 'sns' || splittedArn[2] === 'sqs')) {
            const dlqType = splittedArn[2];
            const iamRoleLambdaExecution = cfTemplate.Resources.IamRoleLambdaExecution;
            let stmt;

            functionResource.Properties.DeadLetterConfig = {
              TargetArn: arn,
            };

            if (dlqType === 'sns') {
              stmt = {
                Effect: 'Allow',
                Action: ['sns:Publish'],
                Resource: [arn],
              };
            } else if (dlqType === 'sqs') {
              const errorMessage = [
                'onError currently only supports SNS topic arns due to a',
                ' race condition when using SQS queue arns and updating the IAM role.',
                ' Please check the docs for more info.',
              ].join('');
              throw new this.serverless.classes.Error(errorMessage);
            }

            // update the PolicyDocument statements (if default policy is used)
            if (iamRoleLambdaExecution) {
              iamRoleLambdaExecution.Properties.Policies[0].PolicyDocument.Statement.push(stmt);
            }
          } else {
            const errorMessage = 'onError config must be a SNS topic arn or SQS queue arn';
            throw new this.serverless.classes.Error(errorMessage);
          }
        } else if (this.isArnRefGetAttOrImportValue(arn)) {
          functionResource.Properties.DeadLetterConfig = {
            TargetArn: arn,
          };
        } else {
          const errorMessage = [
            'onError config must be provided as an arn string,',
            ' Ref, Fn::GetAtt or Fn::ImportValue',
          ].join('');
          throw new this.serverless.classes.Error(errorMessage);
        }
      }

      let kmsKeyArn;
      const serviceObj = this.serverless.service.serviceObject;
      if ('awsKmsKeyArn' in functionObject) {
        kmsKeyArn = functionObject.awsKmsKeyArn;
      } else if (serviceObj && 'awsKmsKeyArn' in serviceObj) {
        kmsKeyArn = serviceObj.awsKmsKeyArn;
      }

      if (kmsKeyArn) {
        const arn = kmsKeyArn;

        if (typeof arn === 'string') {
          const splittedArn = arn.split(':');
          if (splittedArn[0] === 'arn' && splittedArn[2] === 'kms') {
            const iamRoleLambdaExecution = cfTemplate.Resources.IamRoleLambdaExecution;

            functionResource.Properties.KmsKeyArn = arn;

            const stmt = {
              Effect: 'Allow',
              Action: ['kms:Decrypt'],
              Resource: [arn],
            };

            // update the PolicyDocument statements (if default policy is used)
            if (iamRoleLambdaExecution) {
              iamRoleLambdaExecution.Properties.Policies[0].PolicyDocument.Statement = _.unionWith(
                iamRoleLambdaExecution.Properties.Policies[0].PolicyDocument.Statement,
                [stmt],
                _.isEqual
              );
            }
          } else {
            const errorMessage = 'awsKmsKeyArn config must be a KMS key arn';
            throw new this.serverless.classes.Error(errorMessage);
          }
        } else if (this.isArnRefGetAttOrImportValue(arn)) {
          functionResource.Properties.KmsKeyArn = arn;
        } else {
          const errorMessage = [
            'awsKmsKeyArn config must be provided as an arn string,',
            ' Ref, Fn::GetAtt or Fn::ImportValue',
          ].join('');
          throw new this.serverless.classes.Error(errorMessage);
        }
      }

      const tracing =
        functionObject.tracing ||
        (this.serverless.service.provider.tracing &&
          this.serverless.service.provider.tracing.lambda);

      if (tracing) {
        if (typeof tracing === 'boolean' || typeof tracing === 'string') {
          let mode = tracing;

          if (typeof tracing === 'boolean') {
            mode = 'Active';
          }

          const iamRoleLambdaExecution = cfTemplate.Resources.IamRoleLambdaExecution;

          functionResource.Properties.TracingConfig = {
            Mode: mode,
          };

          const stmt = {
            Effect: 'Allow',
            Action: ['xray:PutTraceSegments', 'xray:PutTelemetryRecords'],
            Resource: ['*'],
          };

          // update the PolicyDocument statements (if default policy is used)
          if (iamRoleLambdaExecution) {
            iamRoleLambdaExecution.Properties.Policies[0].PolicyDocument.Statement = _.unionWith(
              iamRoleLambdaExecution.Properties.Policies[0].PolicyDocument.Statement,
              [stmt],
              _.isEqual
            );
          }
        } else {
          const errorMessage =
            'tracing requires a boolean value or the "mode" provided as a string';
          throw new this.serverless.classes.Error(errorMessage);
        }
      }

      if (functionObject.environment || this.serverless.service.provider.environment) {
        functionResource.Properties.Environment = {};
        functionResource.Properties.Environment.Variables = Object.assign(
          {},
          this.serverless.service.provider.environment,
          functionObject.environment
        );

        let invalidEnvVar = null;
        _.forEach(_.keys(functionResource.Properties.Environment.Variables), key => {
          // taken from the bash man pages
          if (!key.match(/^[A-Za-z_][a-zA-Z0-9_]*$/)) {
            invalidEnvVar = `Invalid characters in environment variable ${key}`;
            return false; // break loop with lodash
          }
          const value = functionResource.Properties.Environment.Variables[key];
          if (_.isObject(value)) {
            const isCFRef =
              _.isObject(value) &&
              !_.some(value, (v, k) => k !== 'Ref' && !_.startsWith(k, 'Fn::'));
            if (!isCFRef) {
              invalidEnvVar = `Environment variable ${key} must contain string`;
              return false;
            }
          }
          return true;
        });

        if (invalidEnvVar) throw new this.serverless.classes.Error(invalidEnvVar);
      }

      if ('role' in functionObject) {
        this.compileRole(functionResource, functionObject.role);
      } else if ('role' in this.serverless.service.provider) {
        this.compileRole(functionResource, this.serverless.service.provider.role);
      } else {
        this.compileRole(functionResource, 'IamRoleLambdaExecution');
      }

      if (!functionObject.vpc) functionObject.vpc = {};
      if (!this.serverless.service.provider.vpc) this.serverless.service.provider.vpc = {};

      functionResource.Properties.VpcConfig = {
        SecurityGroupIds:
          functionObject.vpc.securityGroupIds ||
          this.serverless.service.provider.vpc.securityGroupIds,
        SubnetIds: functionObject.vpc.subnetIds || this.serverless.service.provider.vpc.subnetIds,
      };

      if (
        !functionResource.Properties.VpcConfig.SecurityGroupIds ||
        !functionResource.Properties.VpcConfig.SubnetIds
      ) {
        delete functionResource.Properties.VpcConfig;
      }

      if (functionObject.reservedConcurrency || functionObject.reservedConcurrency === 0) {
        // Try convert reservedConcurrency to integer
        const reservedConcurrency = _.parseInt(functionObject.reservedConcurrency);

        if (_.isInteger(reservedConcurrency)) {
          functionResource.Properties.ReservedConcurrentExecutions = reservedConcurrency;
        } else {
          const errorMessage = [
            'You should use integer as reservedConcurrency value on function: ',
            `${functionResource.Properties.FunctionName}`,
          ].join('');

          throw new this.serverless.classes.Error(errorMessage);
        }
      }

      functionResource.DependsOn = [this.provider.naming.getLogGroupLogicalId(functionName)].concat(
        functionResource.DependsOn || []
      );

      if (functionObject.layers && _.isArray(functionObject.layers)) {
        functionResource.Properties.Layers = functionObject.layers;
      } else if (
        this.serverless.service.provider.layers &&
        _.isArray(this.serverless.service.provider.layers)
      ) {
        functionResource.Properties.Layers = this.serverless.service.provider.layers;
      }

      const functionLogicalId = this.provider.naming.getLambdaLogicalId(functionName);
      const newFunctionObject = {
        [functionLogicalId]: functionResource,
      };

      Object.assign(cfTemplate.Resources, newFunctionObject);

      const shouldVersionFunction =
        functionObject.versionFunction != null
          ? functionObject.versionFunction
          : this.serverless.service.provider.versionFunctions;

      let versionCompilationPromise;
      if (shouldVersionFunction || functionObject.provisionedConcurrency) {
        // Create hashes for the artifact and the logical id of the version resource
        // The one for the version resource must include the function configuration
        // to make sure that a new version is created on configuration changes and
        // not only on source changes.
        const fileHash = crypto.createHash('sha256');
        const versionHash = crypto.createHash('sha256');
        fileHash.setEncoding('base64');
        versionHash.setEncoding('base64');

        // Read the file in chunks and add them to the hash (saves memory and performance)
        versionCompilationPromise = BbPromise.fromCallback(cb => {
          const readStream = fs.createReadStream(artifactFilePath);

          readStream
            .on('data', chunk => {
              fileHash.write(chunk);
              versionHash.write(chunk);
            })
            .on('close', () => {
              cb();
            })
            .on('error', error => {
              cb(error);
            });
        }).then(() => {
          // Include function configuration in version id hash (without the Code part)
          const properties = _.omit(_.get(functionResource, 'Properties', {}), 'Code');
          _.forOwn(properties, value => {
            const hashedValue = _.isObject(value) ? JSON.stringify(value) : _.toString(value);
            versionHash.write(hashedValue);
          });

          // Finalize hashes
          fileHash.end();
          versionHash.end();

          const fileDigest = fileHash.read();
          const versionDigest = versionHash.read();

          const versionResource = this.cfLambdaVersionTemplate();

          versionResource.Properties.CodeSha256 = fileDigest;
          versionResource.Properties.FunctionName = { Ref: functionLogicalId };
          if (functionObject.description) {
            versionResource.Properties.Description = functionObject.description;
          }

          // use the version SHA in the logical resource ID of the version because
          // AWS::Lambda::Version resource will not support updates
          const versionLogicalId = this.provider.naming.getLambdaVersionLogicalId(
            functionName,
            versionDigest
          );
          functionObject.versionLogicalId = versionLogicalId;
          const newVersionObject = {
            [versionLogicalId]: versionResource,
          };

          Object.assign(cfTemplate.Resources, newVersionObject);

          // Add function versions to Outputs section
          const functionVersionOutputLogicalId = this.provider.naming.getLambdaVersionOutputLogicalId(
            functionName
          );
          const newVersionOutput = this.cfOutputLatestVersionTemplate();

          newVersionOutput.Value = { Ref: versionLogicalId };

          Object.assign(cfTemplate.Outputs, {
            [functionVersionOutputLogicalId]: newVersionOutput,
          });

          if (!functionObject.provisionedConcurrency) return;
          if (!shouldVersionFunction) delete versionResource.DeletionPolicy;

          const provisionedConcurrency = _.parseInt(functionObject.provisionedConcurrency);

          if (!_.isInteger(provisionedConcurrency)) {
            throw new this.serverless.classes.Error(
              'You should use integer as provisionedConcurrency value on function: ' +
                `${functionResource.Properties.FunctionName}`
            );
          }
          const aliasLogicalId = this.provider.naming.getLambdaProvisionedConcurrencyAliasLogicalId(
            functionName
          );
          const aliasName = this.provider.naming.getLambdaProvisionedConcurrencyAliasName();

          functionObject.targetAlias = { name: aliasName, logicalId: aliasLogicalId };

          const aliasResource = {
            Type: 'AWS::Lambda::Alias',
            Properties: {
              FunctionName: { Ref: functionLogicalId },
              FunctionVersion: { 'Fn::GetAtt': [versionLogicalId, 'Version'] },
              Name: aliasName,
              ProvisionedConcurrencyConfig: {
                ProvisionedConcurrentExecutions: provisionedConcurrency,
              },
            },
            DependsOn: functionLogicalId,
          };

          cfTemplate.Resources[aliasLogicalId] = aliasResource;
        });
      } else {
        versionCompilationPromise = BbPromise.resolve();
      }

      return versionCompilationPromise.then(() => this.compileFunctionDestinations(functionName));
    });
  }

  compileFunctionDestinations(functionName) {
    const functionObject = this.serverless.service.getFunction(functionName);
    const { destinations } = functionObject;
    if (!destinations) return;

    const cfResources = this.serverless.service.provider.compiledCloudFormationTemplate.Resources;
    const functionLogicalId = this.provider.naming.getLambdaLogicalId(functionName);
    const resource = {
      Type: 'AWS::Lambda::EventInvokeConfig',
      Properties: {
        FunctionName: { Ref: functionLogicalId },
        DestinationConfig: {},
        MaximumEventAgeInSeconds: destinations.maximumEventAge,
        MaximumRetryAttempts: destinations.maximumRetryAttempts,
        Qualifier: functionObject.targetAlias ? functionObject.targetAlias.name : '$LATEST',
      },
    };
    const destinationConfig = resource.Properties.DestinationConfig;

    const hasAccessPoliciesHandledExternally = Boolean(
      functionObject.role || this.serverless.service.provider.role
    );
    if (destinations.onSuccess) {
      if (!hasAccessPoliciesHandledExternally) {
        this.ensureTargetExecutionPermission(destinations.onSuccess);
      }
      destinationConfig.OnSuccess = {
        Destination: destinations.onSuccess.startsWith('arn:')
          ? destinations.onSuccess
          : this.provider.resolveFunctionArn(destinations.onSuccess),
      };
    }
    if (destinations.onFailure) {
      if (!hasAccessPoliciesHandledExternally) {
        this.ensureTargetExecutionPermission(destinations.onFailure);
      }
      destinationConfig.OnFailure = {
        Destination: destinations.onFailure.startsWith('arn:')
          ? destinations.onFailure
          : this.provider.resolveFunctionArn(destinations.onFailure),
      };
    }

    cfResources[this.provider.naming.getLambdaEventConfigLogicalId(functionName)] = resource;
  }

  // Memoized in a construtor
  ensureTargetExecutionPermission(functionAddress) {
    const iamPolicyStatements = this.serverless.service.provider.compiledCloudFormationTemplate
      .Resources.IamRoleLambdaExecution.Properties.Policies[0].PolicyDocument.Statement;

    const action = (() => {
      if (!functionAddress.startsWith('arn:') || functionAddress.includes(':function:')) {
        return 'lambda:InvokeFunction';
      }
      if (functionAddress.includes(':sqs:')) return 'sqs:SendMessage';
      if (functionAddress.includes(':sns:')) return 'sns:Publish';
      if (functionAddress.includes(':event-bus/')) return 'events:PutEvents';
      throw new this.serverless.classes.Error(`Unsupported destination target ${functionAddress}`);
    })();
    iamPolicyStatements.push({
      Effect: 'Allow',
      Action: action,
      // Note: Cannot address function via { 'Fn::GetAtt': [targetLogicalId, 'Arn'] }
      // as same IAM settings are used for target function and that will introduce
      // circular dependency error. Relying on Fn::Sub as a workaround
      Resource: functionAddress.startsWith('arn:')
        ? functionAddress
        : {
            'Fn::Sub': `arn:\${AWS::Partition}:lambda:\${AWS::Region}:\${AWS::AccountId}:function:${
              this.serverless.service.getFunction(functionAddress).name
            }`,
          },
    });
  }

  downloadPackageArtifacts() {
    const allFunctions = this.serverless.service.getAllFunctions();
    return BbPromise.each(allFunctions, functionName => this.downloadPackageArtifact(functionName));
  }

  compileFunctions() {
    const allFunctions = this.serverless.service.getAllFunctions();
    return BbPromise.each(allFunctions, functionName => this.compileFunction(functionName));
  }

  // helper functions
  isArnRefGetAttOrImportValue(arn) {
    return (
      typeof arn === 'object' &&
      _.some(_.keys(arn), k => _.includes(['Ref', 'Fn::GetAtt', 'Fn::ImportValue'], k))
    );
  }

  cfLambdaFunctionTemplate() {
    return {
      Type: 'AWS::Lambda::Function',
      Properties: {
        Code: {
          S3Bucket: {
            Ref: 'ServerlessDeploymentBucket',
          },
          S3Key: 'S3Key',
        },
        FunctionName: 'FunctionName',
        Handler: 'Handler',
        MemorySize: 'MemorySize',
        Role: 'Role',
        Runtime: 'Runtime',
        Timeout: 'Timeout',
      },
    };
  }

  cfLambdaVersionTemplate() {
    return {
      Type: 'AWS::Lambda::Version',
      // Retain old versions even though they will not be in future
      // CloudFormation stacks. On stack delete, these will be removed when
      // their associated function is removed.
      DeletionPolicy: 'Retain',
      Properties: {
        FunctionName: 'FunctionName',
        CodeSha256: 'CodeSha256',
      },
    };
  }

  cfOutputLatestVersionTemplate() {
    return {
      Description: 'Current Lambda function version',
      Value: 'Value',
    };
  }
}

module.exports = AwsCompileFunctions;