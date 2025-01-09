import Exam from "../models/Exam.js";
import Result from "../models/Result.js";

export const createResult = async (req, res) => {
  // Inputs : examId, totalMarks, obtainedMarks from req.body
  // Other Inputs : studentId = req.user.userId, appearDate is current Date using Date Module
  // Creates Exam and returns status

  try {
    const { examId, totalMarks, obtainedMarks } = req.body;
    const studentId = req.user.userId;
    const appearDate = new Date().toISOString().split("T")[0];

    const result = { examId, studentId, appearDate, totalMarks, obtainedMarks };

    const createdResult = await Result.create(result);

    if (!createdResult) {
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

    const exam = await Exam.findById(examId);

    if (exam.teacherId != teacherId) {
      res
        .status(401)
        .json({ message: "You are Not Authorized to delete These Results!" });
    }

    const deletedResults = await Result.deleteMany({ examId: examId });

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
  // Inputs: None
  // Other Inputs: userId from req.user.userId and isadmin from req.user.isadmin
  // If isadmin is true, send all results; otherwise, send results of userId

  try {
    const userId = req.user.userId;
    const isadmin = req.user.isadmin;

    // Determine the query based on the user's admin status
    const query = isadmin ? {} : { studentId: userId };

    // Fetch results based on the query
    const results = await Result.find(query);

    if (!results) {
      return res.status(404).json({ message: "No results found." });
    }

    // Send results back to the client
    return res
      .status(200)
      .json({ message: "Results fetched successfully.", results });
  } catch (error) {
    // Handle unexpected errors
    return res
      .status(500)
      .json({ message: "Error while fetching results", error: error.message });
  }
};
