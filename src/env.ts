declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_NAME: string;
      JWT_SECRET: string;
      JWT_ALGORITHM: "HS256";
      JWT_ISSUER: string;
      SCHOOL_URL: string;
      NOTIFICAION_URL: string;
      FORGOT_PASSWORD_URL: string;
      APPLICATION_URL: string;
    }
  }

  namespace Express {
    export interface User {
      id: string;
      name: string;
      email: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
// export default global;
export {};
