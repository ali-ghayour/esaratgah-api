import Permission from "../../models/Permission";

// Function to create permissions
const createPermissions = async () => {
  const permissions = ["fullAccess","backOfficeLogin", "createUser", "readUser"];

  permissions.map(
    async (permission) =>
      await Permission.create({
        name: permission,
        slug: permission,
        description: `permission for ${permission}`,
      })
  );
};

// Call the function and close the connection

export default createPermissions;
