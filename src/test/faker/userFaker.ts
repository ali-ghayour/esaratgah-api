import { faker } from "@faker-js/faker";
import User from "../../models/User";
import GlobalPermissions from "../../helpers/Permissions";

// create Admin user

export const createAdminUser = async () => {
  try {
    const userPermissions = new GlobalPermissions();
    userPermissions.setAllPermissions(true);
    const user = User.create({
      name: "Ali",
      family: "Ghayour",
      full_name : "Ali Ghayour",
      username: "ali.ghayour",
      phone_number: "09358441163",
      permissions: userPermissions.getPermissions(),
    });
  } catch (error) {
    console.error(error);
  }
};

// Function to create dummy users
const createDummyUsers = async (count: number) => {
  const users = [];
  const permissions = (new GlobalPermissions).getPermissions()
  let user;
  let createdUser;
  for (let i = 0; i < count; i++) {
    const [name, family] = [faker.person.firstName(), faker.person.lastName()]
    const full_name = name + ' ' + family
    user = {
      name,
      family,
      full_name,
      username: faker.person.fullName(),
      phone_number: faker.phone.number({ style: "international" }),
      permissions
    };
    // users.push({
    //   username: faker.person.fullName(),
    //   phone_number: faker.phone.number(),
    //   password: faker.string.fromCharacters("abc"),
    // });
    createdUser = await User.create(user);
    users.push(createdUser);
  }

  // const createdUsers = await User.insertMany(users);
  return users;
};

// Call the function and close the connection

export default createDummyUsers;
