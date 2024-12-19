import Role from "../../models/Role";

const createRoles = async () => {
  const roles = ["supperAdmin", "author", "user"];

  roles.map(async (role) => {
    await Role.create({ name: role, slug: role });
  });
};

export default createRoles;
