// src/interfaces/controllers/AuthController.ts
import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/userService";
//errors
import { AppError } from "../errors/app-error";
import { BadRequestError } from "../errors/bad-request-error";
import { StatusCode } from "../enums/statusCode.enum";

export class UserController {

  constructor(private userService: UserService) {}

  async getProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    
    try {
      const user=req.verifiedUser;
      const data=await this.userService.getProfile(user!)
      res.status(StatusCode.OK).send(data);
    } catch (error) {
      next(error)
    }
  }
}
