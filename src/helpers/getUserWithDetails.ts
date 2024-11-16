import User, { IUser, IUserPopulated } from "../models/User";

const getUserWithDetails = async (userId: string) => {
  try {
    const user = await User.findById(userId)
      .populate("role")
      .populate("permissions")
      .lean<IUserPopulated>()
      .exec();
    if (!user) throw { message: "User not found" };
    return user;
  } catch (error) {
    console.log(error);
  }
};

export default getUserWithDetails;
