import User from "../model/user.model.js";

export const getAllUsersPublic = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "_id username email companyName bio skills experience projects profilePicture"
    );
    return res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users." });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({
        message: "Profile edited successfully! Thank you for the edit.",
        user,
      });
  } catch (err) {
    res.status(500).json({ message: "Error updating user profile." });
  }
};

export const check = (req, res) => {
  res.send("working");
};

export const search = async (req, res) => {
  const keyword = req.query.search;

  if (!keyword) {
    return res.status(400).json({ message: "Search query is missing" });
  }

  try {
    const users = await User.find({
      username: { $regex: `^${keyword}`, $options: "i" },
    });

    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({ message: "Users found", users });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    let users = await User.find({});
    const length = Object.keys(users).length;
    // console.log(length);
    return res
      .status(200)
      .json({ message: "All users", "Total Users": length, users });
  } catch (err) {
    res.status(404).json({ message: "Error occured while fetching data." });
  }
};

export const userInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(
      id,
      "_id username email companyName bio skills experience projects profilePicture"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User found", user });
  } catch (err) {
    res.status(404).json({ message: "Error occured while fetching data." });
  }
};
