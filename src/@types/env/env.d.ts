declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV?: string;
    VERSION?: string;
    ENVIRONMENT?: string;
    PORT?: string;
    HOST?: string;
    DATABASE_URL?: string;
  }
}