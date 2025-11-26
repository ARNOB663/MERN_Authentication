import express from "express";
import { registerUser, verification } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser)
router.post("/verify", verification)

export default router