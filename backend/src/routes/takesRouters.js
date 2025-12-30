import express from "express";
import {
  deleteTasks,
  getAllTasks,
  createTask,
  updateTask,
} from "../controllers/tasksControllers.js";

const router = express.Router();

router.get("/", getAllTasks);

router.post("/", createTask);

router.put("/:id", updateTask);

router.delete("/:id", deleteTasks);

export default router;
