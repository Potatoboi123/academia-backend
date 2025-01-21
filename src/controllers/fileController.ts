// src/interfaces/controllers/AuthController.ts
import { NextFunction, Request, Response } from "express";
//errors
import { AppError } from "../errors/app-error";
import { BadRequestError } from "../errors/bad-request-error";
import { StatusCode } from "../enums/statusCode.enum";
import { FileService } from "../services/fileService";

export class FileController {

  constructor(private fileService:FileService) {}

    async generateGetSignedUrl(req:Request,res:Response,next:NextFunction){
        try {
          const key=req.body
          const data=await this.fileService.generateGetSignedUrl(key);
          res.status(StatusCode.OK).json(data);
        } catch (error) {
          next(error)
        }
    }
    async generatePutSignedUrl(req:Request,res:Response,next:NextFunction){
        try {
          const {key,contentType,isPublic}=req.body;
          const data=await this.fileService.generatePutSignedUrl(key,contentType,isPublic);
          res.status(StatusCode.OK).json(data);
        } catch (error) {
          next(error)
        }
    }

}
