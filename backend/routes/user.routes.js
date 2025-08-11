import { Router } from "express";
import {
  check,
  getUser,
  search,
  userInfo,
  updateUserProfile,
} from "../controller/user.controller.js";
import { checkToken } from "../middleware/auth.middleware.js";
import { verifyToken } from "../controller/auth.controller.js";

const router = Router();

router.get("/", check);
router.get("/search", search);
router.get("/all-users", getUser);

router.get("/user-info/:id", userInfo);
router.put("/user-info/:id", updateUserProfile);

export default router;
