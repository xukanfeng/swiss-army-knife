const config = {
  mysql: {
    dialect: 'mysql',
    database: 'playground',
    username: 'root',
    password: '123456',
    host: 'localhost',
    port: 3306,
  },
  mongo: {
    uri: 'mongodb://localhost/playground',
    port: 27017,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false, // Don't build indexes
      poolSize: 10, // Maintain up to 10 socket connections
      // If not connected, return errors immediately rather than waiting for reconnect
      bufferMaxEntries: 0,
    },
  },
  redis: {
    port: 6379,
    host: 'localhost',
    family: 4,
    password: '',
    db: 0,
  }
}

module.exports = config
