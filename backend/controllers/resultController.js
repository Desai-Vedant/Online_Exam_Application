import Exam from "../models/Exam";
import Result from "../models/Result";

export const createResult = async (req, res) => {
  // Inputs : examId, totalMarks, obtainedMarks from req.body
  // Other Inputs : studentId = req.user.userId, appearDate is current Date using Date Module
  // Creates Exam and returns status

  try {
    const { examId, totalMarks, obtainedMarks } = req.body;
    const studentId = req.user.userId;
    const appearDate = new Date().toISOString().split("T")[0];

    const result = { examId, studentId, appearDate, totalMarks, obtainedMarks };

    const createdResult = Result.create(result);

    if (!result) {
      return res.status(400).json({ message: "Failed to create result" });
    }
    res.status(200).json({ message: "Result Created successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error While Creating Result", error: error.message });
  }
};

export const deleteResult = async (req, res) => {
  // Inputs : examId from req.body
  // Other Inputs : teacherId = req.user.userId
  // Check if exam of examId have teacherId same as our Input then delete all results with given examId

  try {
    const { examId } = req.body;
    const teacherId = req.user.userId;

    const exam = Exam.findById(examId);

    if (exam.teacherId !== teacherId) {
      res
        .status(401)
        .json({ message: "You are Not Authorized to delete These Results!" });
    }

    const deletedResults = Result.deleteMany({ examId: examId });

    if (!deletedResults) {
      return res.status(500).json({ message: "Failed to delete results" });
    }

    res.status(200).json({ message: "Result Deleted successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete results", error: error.message });
  }
};

export const viewResult = async (req, res) => {
  // Inputs : None
  // Other Inputs : userId from req.user.userId and isadmin from req.user.isadmin
  // If isadmin is true then send all results otherwise send results of userId

  try {
    const userId = req.user.userId;
    const isadmin = req.user.isadmin;

    if (isadmin) {
      const results = Result.find();
      if (!results) {
        res.status(500).json({ message: "Error while fetching results" });
      }
      res
        .status(200)
        .json({ message: "Results fetched Sucessfully.", results });
    }

    const results = Result.find({ studentId: userId });

    if (!results) {
      res.status(500).json({ message: "Error while fetching results" });
    }
    res.status(200).json({ message: "Results fetched Sucessfully.", results });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetching results", error: error.message });
  }
};
