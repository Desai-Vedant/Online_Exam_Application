import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  examId: String,
  studentId: String,
  totalMarks: Number,
  obtainedMarks: Number,
  appearDate: Date,
});

const Result = mongoose.model("Result", resultSchema);

export default Result;
