import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../helpers/CustomError';
import { IUser,IUserPopulated } from '../models/User'; // Adjust according to your models
import { IPermission } from '../models/Permission';

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

      const userPermissions = user.permissions.map((perm) => perm.name);

      const hasPermission = requiredPermissions.some((required) =>
        userPermissions.includes(required)
      );

      if (!hasPermission) {
        throw new CustomError('Forbidden', 403, {
          permission: ['User does not have the required permissions'],
        });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      next(err); // Pass the error to the error handler
    }
  };
