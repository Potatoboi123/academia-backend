// src/interfaces/routes/userRoutes.ts
import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { UserRepository } from "../repositories/userRepository";
import {AuthService} from "../services/authService"
import { verifyToken } from "../middleware/verify-token";

import {authenticateGoogle,googleController,googleCallback} from "../services/googleService"
import { verifyUser } from "../middleware/verify-user";

const router = Router();

// Dependency injection
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

//Refresh Token-Route to get new access token
router.post("/refresh", authController.refreshToken.bind(authController));

// Otp Routes For SignIn
router.post("/signup", authController.signUp.bind(authController));
router.post("/verify-otp", authController.verifyOtp.bind(authController));
router.post("/resend-otp",authController.resendOtp.bind(authController))

//Login
router.post("/signin", authController.signIn.bind(authController));

//Logout
router.post("/signout", authController.signOut.bind(authController));

//Instructor Creation
router.post("/register-instructor",verifyToken,verifyUser('student'), authController.registerInstructor.bind(authController));

//Google SignIn Route
router.get("/google",authenticateGoogle);
router.get("/google/callback",googleCallback,googleController);

export default router;
