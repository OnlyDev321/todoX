import express from "express";
import {
  createUser,
  deleteUser,
  getMe,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);

router.get("/me", getMe); // Phải đặt trước /:id để không bị match nhầm

router.get("/:id", getUserById);

router.post("/", createUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;
