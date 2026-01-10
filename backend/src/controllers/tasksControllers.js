import Task from "../models/Task.js";

export const getAllTasks = async (req, res) => {
  const { filter = "today" } = req.query;
  const now = new Date();
  let startDate;

  switch (filter) {
    case "today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week":
      const mondayDate =
        now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
      startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "all":
    default:
      startDate = null;
      break;
  }

  // Lọc tasks theo userId của user đã đăng nhập
  const baseQuery = { userId: req.user._id };
  const query = startDate
    ? { ...baseQuery, createdAt: { $gte: startDate } }
    : baseQuery;

  try {
    // loc
    const result = await Task.aggregate([
      { $match: query },
      {
        $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
          completeCount: [
            { $match: { status: "complete" } },
            { $count: "count" },
          ],
        },
      },
    ]);
    const tasks = result[0].tasks;
    const activeCount = result[0].activeCount[0]?.count || 0;
    const completeCount = result[0].completeCount[0]?.count || 0;
    res.status(200).json({ tasks, activeCount, completeCount });
  } catch (error) {
    console.log("Loi khi goi getAllTasks", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    // Tạo task với userId của user đã đăng nhập
    const task = new Task({
      title,
      userId: req.user._id,
    });

    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.log("Loi khi goi createTask", error);
    res.status(500).json({ message: "Loi he thong" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, status, completedAt } = req.body;
    // Chỉ cho phép update task của chính user đó
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        title,
        status,
        completedAt,
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "nhiem vu ko ton tai" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.log("Loi khi goi updateTask", error);
    res.status(500).json({ message: "Loi he thong" });
  }
};

export const deleteTasks = async (req, res) => {
  try {
    // Chỉ cho phép xóa task của chính user đó
    const deleteTask = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!deleteTask) {
      return res.status(404).json({ message: "Nhiem vu khong ton tai" });
    }
    res.status(200).json(deleteTask);
  } catch (error) {
    console.error("loi khi goi deleteTask", error);
    res.status(500).json({ message: "loi he thong" });
  }
};
