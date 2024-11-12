import { faker } from "@faker-js/faker";
import Diary from "../../models/Diary";

// Function to create dummy users
const createDummyDiary = async (count: number) => {
  const diaries = [];
  let diary;
  let createddiary;
  for (let i = 0; i < count; i++) {
    diary = {
      title: faker.lorem.word({ length: 5 }),
      content: faker.lorem.sentences(3),
      user_id: 1,
    };
    // users.push({
    //   username: faker.person.fullName(),
    //   phone_number: faker.phone.number(),
    //   password: faker.string.fromCharacters("abc"),
    // });
    createddiary = await Diary.create(diary);
    diaries.push(createddiary);
  }

  // const createdUsers = await User.insertMany(users);
  return diaries;
};

// Call the function and close the connection

export default createDummyDiary;
