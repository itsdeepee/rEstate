import express from "express";
import { test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router=express.Router();

router.get("/test",test);
router.post("/update/:id",verifyToken,updateUser); //Update user's infromation with authentication middleware


export default router;