import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-auhorize-error";
import jwt from "express-jwt";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user === null || req.user === undefined) {
    throw new NotAuthorizedError();
  }
  next();
};

export const auth = jwt({
  secret: process.env.JWT_SECRET!,
  algorithms: [process.env.JWT_ALGORITHM!],
  credentialsRequired: true,
  issuer: process.env.JWT_ISSUER,
});
