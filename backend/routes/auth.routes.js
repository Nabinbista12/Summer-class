import { Router } from "express";
import { login, register } from "../controller/auth.controller.js";
import { upload } from "../middleware/imageUploader.middleware.js";

const router = Router();

router.post("/login", login);
// debug logger to inspect incoming register requests (content-type, headers)
router.post(
	"/register",
	upload.single("profilePicture"),
	register
);

export default router;
