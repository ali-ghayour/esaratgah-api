import { faker } from "@faker-js/faker";
import User from "../../models/User";

// Function to create dummy users
const createDummyUsers = async (count: number) => {
  const users = [];
  let user;
  let createdUser;
  for (let i = 0; i < count; i++) {
    user = {
      name: faker.person.firstName(),
      family : faker.person.lastName(),
      username: faker.person.fullName(),
      phone_number: faker.phone.number(),
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
