import User from "../models/User.js";

// CURD - create - update - read - delete
// REST API, GRaph API
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Can't take list user." });
  }
};

// Lấy thông tin user hiện tại (từ token)
export const getMe = async (req, res) => {
  try {
    // req.user đã được set bởi protectedRoute middleware
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error("ERROR when call getMe", error);
    res.status(500).json({ error: "ERROR sever when take user." });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Don't find user by id" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "ERROR sever when take user." });
  }
};

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, userName } = req.body;

    // Kiểm tra bắt buộc
    if (!firstName || !lastName || !userName) {
      return res.status(400).json({ error: "Thiếu trường yêu cầu." });
    }

    const newUser = new User({
      firstName,
      lastName,
      userName,
    });

    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Không thể tạo người dùng." });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, userName } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        userName,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Don't find user." });
    }
    res.status(200).json(updateUser);
  } catch (error) {
    console.log("ERROR when call updateUser", error);
    res.status(500).json({ message: "Can't update user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Missing id of user." });
    }

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Don't find user." });
    }
    res.json({ message: "Delete user successfully.", user: deleted });
  } catch (error) {
    res.status(500).json({ error: "Can't delete user." });
  }
};
