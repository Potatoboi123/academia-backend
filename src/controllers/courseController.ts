// src/interfaces/controllers/AuthController.ts
import { NextFunction, Request, Response } from "express";
//errors
import { AppError } from "../errors/app-error";
import { BadRequestError } from "../errors/bad-request-error";
import { StatusCode } from "../enums/statusCode.enum";

import sanitizeHtml from 'sanitize-html'
import { ICourseService } from "../services/interfaces/ICourseService";

export class CourseController {
  constructor(private courseService: ICourseService) {}

  async createCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.verifiedUser!;
      const courseData=req.body as {category:string,imageThumbnail:string,description:string,price:number,subtitle:string,title:string,promotionalVideo:string};

      if(!courseData.category||!courseData.imageThumbnail||!courseData.description||!courseData.price||!courseData.subtitle||!courseData.title||!courseData.promotionalVideo){
        throw new BadRequestError("Must include all fields")
      }
      const sanitizedDescription = sanitizeHtml(courseData.description, {
        allowedTags: ['b', 'i', 'em', 'strong', 'p', 'h1', 'h2', 'ul', 'li', 'ol', 'a'],
        allowedAttributes: {
          a: ['href', 'target', 'rel'],
        },
      });
      courseData.description=sanitizedDescription;
      const data = await this.courseService.createCourse(courseData,user.id);
      res.status(StatusCode.OK).send({message:'success'});
    } catch (error) {
      next(error);
    }
  }

  async addSection(req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>{
    try {
      const {section ,courseId}=req.body as {section:{title:string,description:string},courseId:string}
      const userId=req.verifiedUser?.id
      if (!section || !courseId || !section.title || !section.description) {
        throw new BadRequestError("Missing required fields: title, description, or courseId");
      }

      const newSection=await this.courseService.addSection(section ,courseId,userId!);
      res.status(StatusCode.OK).send(newSection);

    } catch (error) {
      next(error);
    }
  }

  async getCurrriculum(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = req.params;
      if (!courseId) {
        throw new BadRequestError("Provide the id");
      }
      const curriculum = await this.courseService.getCurriculum(courseId);
      res.status(StatusCode.OK).send(curriculum);
    } catch (error) {
      next(error);
    }
  }

  async getCurrriculumOfInstructor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = req.params;
      const userId=req.verifiedUser?.id!;
      if (!courseId) {
        throw new BadRequestError("Provide the id");
      }
      const curriculum = await this.courseService.getCurriculumOfInstructor(courseId,userId);
      res.status(StatusCode.OK).send(curriculum);
    } catch (error) {
      next(error);
    }
  }

  async addLecture(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId=req.verifiedUser?.id!;
      const { courseId,sectionId,lectureData } = req.body as {courseId:string,sectionId:string,lectureData:{title:string,videoUrl:string,duration:number}};
      if (!courseId || !sectionId || !lectureData.title|| !lectureData.videoUrl|| !lectureData.duration) {
        throw new BadRequestError("Give valid data");
      }
      const curriculum = await this.courseService.addLecture(userId,courseId,sectionId,lectureData);
      res.status(StatusCode.OK).send(curriculum);
    } catch (error) {
      next(error);
    }
  }

  // async getLecture(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   try {
  //     const { courseId,sectionId,lectureData } = req.body;
  //     if (!courseId || !sectionId || !lectureData) {
  //       throw new BadRequestError("Give valid data");
  //     }
  //     const curriculum = await this.courseService.addLecture(courseId,sectionId,lectureData);
  //     res.status(StatusCode.OK).send(curriculum);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async addProcessedLecture(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId,courseId,sectionId,lectureId,key } = req.body;
      //do something here
      if(!userId||!courseId||!sectionId||!lectureId||!key){
        throw new BadRequestError("Must inclue every details");
      }
      const curriculum = await this.courseService.addLectureAfterProcessing(userId,courseId,sectionId,lectureId,key);
      res.status(StatusCode.OK).send({message:"Lecture Updated Successfully"})
    } catch (error) {
      next(error);
    }
  }

  async generateLecturePreviewLectureUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId,lectureId } = req.params;
      const {id,role}=req.verifiedUser!
      
      if(!courseId||!lectureId){
        throw new BadRequestError("Must inclue every details");
      }

      const {signedCookies,url} = await this.courseService.generateLecturePreviewLectureUrl(courseId,lectureId,id,role);
      
      res.cookie("CloudFront-Policy", signedCookies["CloudFront-Policy"], {
        httpOnly: true,
        secure: true,
      });
      res.cookie("CloudFront-Signature", signedCookies["CloudFront-Signature"], {
        httpOnly: true,
        secure: true,
      });
      res.cookie("CloudFront-Key-Pair-Id", signedCookies["CloudFront-Key-Pair-Id"], {
        httpOnly: true,
        secure: true,
      });
      res.status(StatusCode.OK).send({url})
    } catch (error) {
      next(error);
    }
  }

  async getCourseOfInstructor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {instructorId}=req.params
      const {status}=req.query
      //do something here
      if(!instructorId||!status||typeof status!=='string'){
        throw new BadRequestError("Must inclue every details");
      }
      const courses = await this.courseService.getCourseOfInstructor(instructorId,status);
      res.status(StatusCode.OK).send(courses)
    } catch (error) {
      next(error);
    }
  }

  async submitCourseForReview(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {id}=req.verifiedUser!
      const {courseId}=req.params

      if(!courseId||!id){
        throw new BadRequestError("Must inclue every details");
      }
      const courses = await this.courseService.submitCourseForReview(id,courseId);
      res.status(StatusCode.OK).send(courses)
    } catch (error) {
      next(error);
    }
  }

}
