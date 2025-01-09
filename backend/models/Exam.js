import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  title: String,
  teacherId: String,
  description: String,
  passingMarks: Number,
  questions: [
    {
      question: String,
      options: [
        { type: String },
        { type: String },
        { type: String },
        { type: String },
      ],
      correctAnswer: String,
      marks: Number,
    },
  ],
  creationDate: Date,
});

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
