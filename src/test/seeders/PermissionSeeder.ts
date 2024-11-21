import Permission from "../../models/Permission";

// Function to create dummy users
const createPermissions = async () => {
  const permissions = ["backOfficeLogin", "createUser", "readUser"];

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
