// src/interfaces/routes/userRoutes.ts
import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { UserRepository } from "../repositories/userRepository";
import { CategoryRepository } from "../repositories/categoryRepository";
import { AdminService } from "../services/adminService";
import { verifyToken } from "../middleware/verify-token";
import { verifyUser } from "../middleware/verify-user";
import { CourseRepository } from "../repositories/courseRepository";

const router = Router();

// Dependency injection Begin
//repositories
const userRepository = new UserRepository();
const categoryRepository = new CategoryRepository();
const courseRepository = new CourseRepository();
//services
const adminService = new AdminService(
  userRepository,
  categoryRepository,
  courseRepository
);
//controller
const adminController = new AdminController(adminService);
// Dependency injection End

//User Routes

// fetch instructors or students
router.get(
  "/get-users",
  verifyToken,
  verifyUser("admin"),
  adminController.getUsers.bind(adminController)
);
// block/unblock user
router.put(
  "/block-user/:userId",
  verifyToken,
  verifyUser("admin"),
  adminController.blockUser.bind(adminController)
);
// fetch requests for instructors
router.get(
  "/instructor-requests",
  verifyToken,
  verifyUser("admin"),
  adminController.getInstructorVerificationRequests.bind(adminController)
);
// approve instructor profile
router.post(
  "/instructor-request/approve",
  verifyToken,
  verifyUser("admin"),
  adminController.getInstructorVerificationRequests.bind(adminController)
);
// reject instructor profile
router.post(
  "/instructor-request/reject",
  verifyToken,
  verifyUser("admin"),
  adminController.rejectVerificationRequest.bind(adminController)
);
// approve instructor profile
router.put(
  "/instructor-request/approve",
  verifyToken,
  verifyUser("admin"),
  adminController.approveVerificationRequest.bind(adminController)
);

//Category Routes
// fetch paginated categories
router.get(
  "/get-categories",
  verifyToken,
  verifyUser("admin"),
  adminController.getCategories.bind(adminController)
);
//create category
router.post(
  "/create-category",
  verifyToken,
  verifyUser("admin"),
  adminController.createCategory.bind(adminController)
);
//edit category
router.post(
  "/edit-category",
  verifyToken,
  verifyUser("admin"),
  adminController.editCategory.bind(adminController)
);
//block category
router.put(
  "/block-category/:categoryId",
  verifyToken,
  verifyUser("admin"),
  adminController.blockCategory.bind(adminController)
);

//course
router.get(
  "/course-review-requests",
  verifyToken,
  verifyUser("admin"),
  adminController.getCourseReviewRequests.bind(adminController)
);
// reject instructor profile
router.put(
  "/course-review-requests/reject",
  verifyToken,
  verifyUser("admin"),
  adminController.rejectCourseReviewRequest.bind(adminController)
);
// approve instructor profile
router.put(
  "/course-review-requests/approve",
  verifyToken,
  verifyUser("admin"),
  adminController.approveCourseReviewRequest.bind(adminController)
);

export default router;
