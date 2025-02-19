// src/interfaces/routes/userRoutes.ts
import { Router } from "express";
import { verifyToken } from "../middleware/verify-token";
import { verifyUser } from "../middleware/verify-user";
import { CourseRepository } from "../repositories/courseRepository";
import { CourseController } from "../controllers/courseController";
import { CourseService } from "../services/courseService";
import { FileService } from "../services/fileService";
import { LectureRepository } from "../repositories/lectureRepository";
import { SectionRepository } from "../repositories/sectionRepository";

const router = Router();

// Dependency injection Begin
const courseRepository = new CourseRepository();
const lectureRepository=new LectureRepository()
const sectionRepository=new SectionRepository()

const fileService=new FileService()

const courseService = new CourseService(courseRepository,lectureRepository,sectionRepository,fileService);
const courseController = new CourseController(courseService);
// Dependency injection End

//create course 
router.post('/create-course',verifyToken,verifyUser('instructor'), courseController.createCourse.bind(courseController));
//add section
router.post('/create-section',verifyToken,verifyUser('instructor'), courseController.addSection.bind(courseController));
//fetch the curriculum (lectures and sections)
router.get('/curriculum/:courseId',verifyToken,verifyUser('instructor','student','admin'), courseController.getCurrriculum.bind(courseController));
//fetch the curriculum of Instructor
router.get('/curriculum/instructor/:courseId',verifyToken,verifyUser('instructor','admin'), courseController.getCurrriculumOfInstructor.bind(courseController));
//add lecture
router.post('/add-lecture',verifyToken,verifyUser('instructor'), courseController.addLecture.bind(courseController));

//router.get('/lecture/:id',verifyToken,verifyUser('instructor','student','admin'), courseController.getLecture.bind(courseController));

//add the processed lecture to database
router.post('/processed-lecture', courseController.addProcessedLecture.bind(courseController));
//preview the course
router.get('/preview/get-lecture-url/:courseId/:lectureId',verifyToken,verifyUser('instructor','admin'), courseController.generateLecturePreviewLectureUrl.bind(courseController));
//fetch the courses for instructor
router.get('/get/:instructorId',verifyToken,verifyUser('instructor','admin'), courseController.getCourseOfInstructor.bind(courseController));
//submit coure for review of admin
router.patch('/:courseId/submit-review',verifyToken,verifyUser('instructor'), courseController.submitCourseForReview.bind(courseController));

export default router;
