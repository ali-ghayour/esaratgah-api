type IPermissionActions = "read" | "write" | "create" | "delete";

interface IPermission {
  [key: string]: boolean; // key: permission action (read, write, etc.), value: boolean
}

const Permission: IPermission = {
  read: false,
  write: false,
  create: false,
  delete: false,
};

type IGlobalPermissions = {
  [key: string]: IPermission; // key: permission group name, value: actions (read, write, etc.)
};

export default class GlobalPermissions {
  private permissions: IGlobalPermissions;

  // Initialize the permissions with all values set to false for each action
  constructor() {
    this.permissions = {
      backofficeAccess: { ...Permission },
      siteSetting: { ...Permission },
      userManagement: { ...Permission },
      roleManagement: { ...Permission },
      diaryManagement: { ...Permission },
      // Add more global permissions here as needed
    };
  }

  // Setter method to update a specific permission
  public setPermission(
    permission: string,
    action: IPermissionActions,
    value: boolean
  ) {
    if (this.permissions[permission] !== undefined) {
      this.permissions[permission][action] = value;
    } else {
      console.error(`Permission ${permission} not found.`);
    }
  }

  // Getter method to check if a permission is granted
  public hasPermission(
    permission: string,
    action: IPermissionActions
  ): boolean {
    return this.permissions[permission]?.[action] || false;
  }

  // Get the current permissions object
  public getPermissions() {
    return this.permissions;
  }

  // Method to set all permissions for each action (read, write, create, delete) in all permission groups
  public setAllPermissions(value: boolean): void {
    // Iterate over each permission group
    Object.keys(this.permissions).forEach((permission) => {
      // Set each action (read, write, create, delete) to the specified value
      Object.keys(this.permissions[permission]).forEach((action) => {
        this.permissions[permission][action as IPermissionActions] = value;
      });
    });
  }
}
