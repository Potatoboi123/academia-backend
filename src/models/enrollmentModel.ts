import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEnrollmentDocument extends Document {
  studentId:  mongoose.Schema.Types.ObjectId;
  courseId: mongoose.Schema.Types.ObjectId;
  transactionId: mongoose.Schema.Types.ObjectId; // Payment reference
  purchaseDate: Date;
  status: string;
  reviewStatus:boolean;
  progress: {
    completedLectures: string[];
    percentage: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
const EnrollmentSchema: Schema<IEnrollmentDocument> = new mongoose.Schema(
  {
    studentId: {
      type:  mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    }, // Payment reference
    purchaseDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["active", "refunded", "expired"],
      default: "active",
    },
    reviewStatus:{
      type:Boolean,
      default:false
    },
    progress: {
      completedLectures: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Lecture" },
      ], // Track completed lectures
      percentage: { type: Number, default: 0 }, // Course completion percentage
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

export const EnrollmentModel: Model<IEnrollmentDocument> =
  mongoose.model<IEnrollmentDocument>("Enrollment", EnrollmentSchema);
