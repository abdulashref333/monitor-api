import { Request, Response, NextFunction } from 'express';
import Logger from './logger';
import { CustomError } from '../errors/custom-error';
// import {ValidatorError} from '@typegoose/typegoose';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(" iam her............");
  // if (err instanceof CustomError) {
  //   return res.status(err.statusCode).send({ status: err.statusCode, errors: err.serializeErrors() });
  // } // For any thrown errors in the application
  // // Logger.error(err);

  // if(err.name)
  console.log(err.name);
  res.status(400).send({
    status: 400,
    message: err.message || 'Something went wrong',
  });
};
