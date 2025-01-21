// src/interfaces/routes/userRoutes.ts
import { Router } from "express";
import { UserController } from "../controllers/userController";
import { UserRepository } from "../repositories/userRepository";
import { CategoryRepository } from "../repositories/categoryRepository";
import {UserService} from "../services/userService"
import { verifyToken } from "../middleware/verify-token";
import { verifyUser } from "../middleware/verify-user";

const router = Router();

// Dependency injection Begin
const userRepository = new UserRepository();
const categoryRepository=new CategoryRepository()

const userService = new UserService(userRepository,categoryRepository);
const userController = new UserController(userService);
// Dependency injection End

router.get('/profile',verifyToken,verifyUser('instructor','student'), userController.getProfile.bind(userController));

export default router;
