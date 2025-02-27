import { BulkWriteResult } from "mongodb";
import { StatusCode } from "../enums/statusCode.enum";
import { DatabaseError } from "../errors/database-error";
import { LectureModel } from "../models/lectureModel";
import {
  ILectureRepository,
  ILectureResult,
  ILectureResultPopulated,
} from "./interfaces/ILectureRepository";
import mongoose from "mongoose";

export class LectureRepository implements ILectureRepository {
  async create(lectureData: {
    title: string;
    videoUrl: string;
    duration: number;
    order: number;
  }): Promise<ILectureResult> {
    try {
      const newLecture = await LectureModel.create(lectureData);
      return newLecture;
    } catch (error: unknown) {
      console.log(error);
      throw new DatabaseError(
        "An unexpected database error occurred",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
  async findById(lectureId: string): Promise<ILectureResultPopulated | null> {
    try {
      const lecture = await LectureModel.findById(lectureId).populate(
        "courseId"
      );
      if (!lecture) {
        return null;
      }
      return lecture as unknown as ILectureResultPopulated;
    } catch (error: unknown) {
      throw new DatabaseError(
        "An unexpected database error occurred",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateOrderOfLectureInSameSection(
    sectionId: mongoose.ObjectId,
    lectureId: mongoose.ObjectId,
    draggedOrder: number,
    targetOrder: number
  ): Promise<ILectureResult | null> {
    try {
      if(draggedOrder>targetOrder){
      await LectureModel.updateMany(
        {
          sectionId,
          order: { $gte: targetOrder, $lt: draggedOrder },
        },
        { $inc: { order: 1 } }
      );
      }else{
        await LectureModel.updateMany(
          {
            sectionId,
            order: { $gt: draggedOrder, $lte: targetOrder },
          },
          { $inc: { order: -1 } }
        );
      }


      const updatedLecture = await LectureModel.findByIdAndUpdate(lectureId, {
        order: targetOrder,
      });

      return updatedLecture;
    } catch (error: unknown) {
      throw new DatabaseError(
        "An unexpected database error occurred",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateOrderOfLectureInDifferentSection(
    lectureId: mongoose.ObjectId,
    draggedSectionId: mongoose.ObjectId,
    targetSectionId: mongoose.ObjectId,
    draggedLectureOrder: number,
    targetOrder: number
  ): Promise<ILectureResult | null> {
    try {
      await LectureModel.updateMany(
        { draggedSectionId, order: { $gt: draggedLectureOrder } },
        { $inc: { order: -1 } }
      );

      await LectureModel.updateMany(
        { targetSectionId, order: { $gte: targetOrder } },
        { $inc: { order: 1 } }
      );
      const lecture = await LectureModel.findByIdAndUpdate(
        lectureId,
        { sectionId: targetSectionId },
        { new: true }
      );
      return lecture;
    } catch (error: unknown) {
      throw new DatabaseError(
        "An unexpected database error occurred",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getLecturesWithCourseId(courseId: string): Promise<ILectureResult[]> {
    try {
      const lectures = await LectureModel.find({ courseId: courseId }).sort({
        order: 1,
      });
      return lectures;
    } catch (error: unknown) {
      throw new DatabaseError(
        "An unexpected database error occurred",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateLectureWithProcessedKey(
    lectureId: string,
    key: string
  ): Promise<ILectureResult | null> {
    try {
      const updatedLecture = await LectureModel.findByIdAndUpdate(
        lectureId,
        { $set: { videoUrl: key, status: "processed" } },
        { new: true }
      );
      return updatedLecture;
    } catch (error: unknown) {
      throw new DatabaseError(
        "An unexpected database error occurred",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async countDocumentWithSectionId(sectionId: string): Promise<number> {
    try {
      const lectureCount = await LectureModel.countDocuments({
        sectionId: sectionId,
      });
      return lectureCount;
    } catch (error: unknown) {
      throw new DatabaseError(
        "An unexpected database error occurred",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async editLecture(
    lectureId: string,
    lectureData: { title: string; videoUrl: string; duration: number }
  ): Promise<ILectureResult | null> {
    try {
      const lecture = await LectureModel.findByIdAndUpdate(
        lectureId,
        lectureData,
        { new: true }
      );
      return lecture;
    } catch (error: unknown) {
      throw new DatabaseError(
        "An unexpected database error occurred",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
