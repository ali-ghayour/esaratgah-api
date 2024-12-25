import { Response, Request, NextFunction } from "express";
import GlobalPermissions from "../../helpers/Permissions";
import { createResponse } from "../../helpers/Query/QueryResponse";
import Role, { IRole } from "../../models/Role";
import { CustomError } from "../../helpers/CustomError";

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

  static getRoleById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { _id } = req.params;
      const role = await Role.findById({ _id });
      if (!role) {
        throw new CustomError("Invalid role ID", 400, {
          code: ["Invalid role ID"],
        });
      }
      res.status(200).json(
        createResponse(role, {
          message: "Role retrieved successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;
      const { name, slug, permissions } = req.body as IRole;

      const role = await Role.findById({ _id });
      const pervName = role?.name;
      if (!role) {
        throw new CustomError("Invalid Role Id!", 400, {
          message: ["Invalid Role Id!"],
        });
      }
      role.name = name;
      role.slug = slug;
      role.permissions = permissions;
      role.save();

      res
        .status(201)
        .json(
          createResponse(role, {
            message: `Role ${pervName} updated successfully!`,
          })
        );
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;
      const deleted = await Role.deleteOne({ _id });
      if (!deleted) {
        throw new CustomError("Invalid Role Id", 400, {
          message: ["Invalid role Id"],
        });
      }
      res
        .status(200)
        .json(
          createResponse(deleted, { message: "Role deleted successfully" })
        );
    } catch (error) {
      next(error);
    }
  };
};

export default roleController;
