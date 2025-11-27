import express from "express";
import { loginUser,logoutUser, registerUser, verification } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/register", registerUser)
router.post("/verify", verification)
router.post("/login",loginUser)
router.post("/logout",isAuthenticated,logoutUser)

export default router