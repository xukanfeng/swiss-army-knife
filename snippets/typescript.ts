{
  type Partial<T> = {
    [P in keyof T]?: T[P];
  };

  type Required<T> = {
    [P in keyof T]-?: T[P];
  };

  type ReadOnly<T> = {
    readonly [P in keyof T]: T[P];
  };

  // 将 K 的类型设置为 T
  type Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  // type AD = Exclude<'a'|'b'|'c'|'d' ,'b'|'c'|'e' > // 'a'|'d'
  type Exclude<T, U> = T extends U ? never : T;

  // Exclude 反操作
  type Extract<T, U> = T extends U ? T : never;

  // Pick 反操作
  type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

  type Parameters<T extends (...args: any) => any> = T extends (
    ...args: infer P
  ) => any
    ? P
    : never;

  type ReturnType<T extends (...args: any) => any> = T extends (
    ...args: any
  ) => infer R
    ? R
    : any;

  type ConstructorParameters<
    T extends new (...args: any) => any
  > = T extends new (...args: infer P) => any ? P : never;

  type InstanceType<T extends new (...args: any) => any> = T extends new (
    ...args: any
  ) => infer R
    ? R
    : any;
}
