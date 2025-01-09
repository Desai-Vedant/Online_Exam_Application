import Exam from "../models/Exam.js";

export const createExam = async (req, res) => {
  // Input - title, description, passingMarks, questions (list of questions, with options, correct answer and marks )
  // Other Data - Current Date as creationDate (get using Date Module),teacherId from req.user.userId

  try {
    const { title, description, passingMarks, questions } = req.body;
    const teacherId = req.user.userId;
    const creationDate = new Date().toISOString().split("T")[0];
    const exam = {
      title,
      teacherId,
      description,
      passingMarks,
      questions,
      creationDate,
    };
    const createdExam = await Exam.create(exam);

    if (!createdExam) {
      return res.status(400).json({ message: "Exam creation failed" });
    }
    return res
      .status(201)
      .json({ message: "Exam created successfully", exam: createdExam });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating exam", error: error.message });
  }
};

export const deleteExam = async (req, res) => {
  // Input - examId
  // Other Data - userId from req.user.userId
  // If teacherId from exam is same as userId them delete the exam with examId

  try {
    const { examId } = req.body;
    const userId = req.user.userId;

    const existingExam = await Exam.findById(examId);

    if (!existingExam) {
      res.status(400).json({ message: "Exam Does Not exist." });
    }

    if (existingExam.teacherId == userId) {
      const deletedExam = await Exam.findByIdAndDelete(examId);

      if (!deletedExam) {
        res.status(500).json({ message: "Failed To Delete Exam" });
      }
    } else {
      res
        .status(401)
        .json({ message: "You are not Authorized to Delete this Exam!" });
    }
    res.status(201).json({ message: "Exam Deleted Sucessfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Deleting exam", error: error.message });
  }
};

export const viewExam = async (req, res) => {
  try {
    // Input - None
    // Other Data - userId from req.user.userId and isadmin from req.user.isadmin
    // Return - All Exams if isadmin is false else return all exams with teacherId equal to userId
    const userId = req.user.userId;
    const isadmin = req.user.isadmin;

    if (isadmin) {
      // Fetch exams created by this teacher
      const exams = await Exam.find({ teacherId: userId });
      if (!exams) {
        return res.status(400).json({ message: "No Exams Found" });
      }
      return res
        .status(200)
        .json({ message: "Exams Fetched successfully.", exams });
    }

    // Fetch all exams for Student
    const exams = await Exam.find();
    if (!exams) {
      return res.status(200).json({ message: "No Exams Found", exams });
    }
    return res
      .status(200)
      .json({ message: "Exams Fetched successfully.", exams });
  } catch (error) {
    return res.status(500).json({
      message: "Error while getting Exams Data",
      error: error.message,
    });
  }
};
