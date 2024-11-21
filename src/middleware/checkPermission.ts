import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../helpers/CustomError';
import { IUserPopulated } from '../models/User'; // Adjust according to your models
import { IPermission } from '../models/Permission';
import { havePermission } from '../helpers/havePermission';

export const checkPermission =
  (requiredPermissions: Array<IPermission['name']>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUserPopulated | undefined;

      if (!user) {
        throw new CustomError('Unauthorized', 401, {
          user: ['User is not authenticated'],
        });
      }
      
      if (!havePermission(requiredPermissions, user)) {
        throw new CustomError('Forbidden', 403, {
          permission: ['User does not have the required permissions'],
        });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      next(err); // Pass the error to the error handler
    }
  };
