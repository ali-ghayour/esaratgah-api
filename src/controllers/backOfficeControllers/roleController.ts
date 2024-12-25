import { Response, Request, NextFunction } from "express";
import GlobalPermissions from "../../helpers/Permissions";
import { createResponse } from "../../helpers/Query/QueryResponse";
import Role, { IRole } from "../../models/Role";

const roleController = class {
  static getPermissions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const permissions = new GlobalPermissions().getPermissions();
      res.status(201).json(permissions);
    } catch (error) {
      console.log(error);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, slug, permissions } = req.body as IRole;
      const role = await Role.create({ name, slug, permissions });
      res.status(201).json(
        createResponse([role], {
          message: "Role created successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  };

  static get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const role = await Role.find({});
      res.status(201).json(
        createResponse(role, {
          message: "Role get successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  };
};

export default roleController;
