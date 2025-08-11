import { Router } from "express";
import {
  check,
  getUser,
  search,
  userInfo,
  updateUserProfile,
  getAllUsersPublic,
} from "../controller/user.controller.js";
import { checkToken } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", check);
router.get("/search", search);
router.get("/all-users", getUser);


// Protect profile routes
router.get("/user-info/:id", checkToken, userInfo);
router.put("/user-info/:id", checkToken, updateUserProfile);

// Public API to fetch all users for cards
router.get("/public-users", getAllUsersPublic);

export default router;
