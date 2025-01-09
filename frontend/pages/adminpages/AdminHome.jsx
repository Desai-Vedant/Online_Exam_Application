import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2,
} from "@mui/material";
import axios from "axios";

function AdminHome() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [results, setResults] = useState([]);
  const [resultsModalOpen, setResultsModalOpen] = useState(false);

  // Fetch exams on load
  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/exam/view",
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setExams(response.data.exams || []);
      } else {
        alert("Failed to fetch exams");
      }
    } catch (error) {
      console.error(error);
      alert("Error fetching exams");
    }
  };

  const handleViewResults = async (examId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/result/view",
        { examId }, // Pass the examId to fetch specific results
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        const recievedResults = response.data.results;
        const filteredResults = recievedResults.filter((result) => {
          if (result.examId == examId) {
            return true;
          }
        });
        setResults(filteredResults || []);
        setResultsModalOpen(true); // Open the modal to display results
      } else {
        alert("Failed to fetch results");
      }
    } catch (error) {
      console.error(error);
      alert("Error fetching results");
    }
  };

  const handleDeleteExam = async () => {
    try {
      // Step 1: Delete associated results
      await axios.post(
        "http://localhost:3000/result/delete",
        { examId: selectedExam },
        {
          withCredentials: true,
        }
      );

      // Step 2: Delete the exam
      const response = await axios.post(
        "http://localhost:3000/exam/delete",
        { examId: selectedExam },
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        alert("Exam deleted successfully!");
        setConfirmDelete(false);
        setSelectedExam(null);
        fetchExams(); // Refresh the list of exams
      } else {
        alert("Failed to delete the exam");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting the exam");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome Admin!
      </Typography>
      <Grid2 container spacing={3}>
        {exams.map((exam) => (
          <Grid2 xs={12} sm={6} md={4} key={exam._id}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">{exam.title}</Typography>
              <Typography variant="body1">
                Description: {exam.description}
              </Typography>
              <Typography variant="body2">
                Passing Marks: {exam.passingMarks}
              </Typography>
              <Box sx={{ marginTop: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleViewResults(exam._id)}
                >
                  View Results
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ marginLeft: 1 }}
                  onClick={() => {
                    setSelectedExam(exam._id);
                    setConfirmDelete(true);
                  }}
                >
                  Delete Exam
                </Button>
              </Box>
            </Paper>
          </Grid2>
        ))}
      </Grid2>

      {/* Confirmation Dialog for Deletion */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        aria-labelledby="confirm-delete-title"
      >
        <DialogTitle id="confirm-delete-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this exam? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteExam} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Results Modal */}
      <Dialog
        open={resultsModalOpen}
        onClose={() => setResultsModalOpen(false)}
        aria-labelledby="results-modal-title"
      >
        <DialogTitle id="results-modal-title">Exam Results</DialogTitle>
        <DialogContent>
          {results.length > 0 ? (
            results.map((result) => (
              <Box key={result._id} sx={{ marginBottom: 2 }}>
                <Typography>
                  <strong>Student ID:</strong> {result.studentId}
                </Typography>
                <Typography>
                  <strong>Total Marks:</strong> {result.totalMarks}
                </Typography>
                <Typography>
                  <strong>Obtained Marks:</strong> {result.obtainedMarks}
                </Typography>
                <Typography>
                  <strong>Appear Date:</strong>{" "}
                  {new Date(result.appearDate).toLocaleDateString()}
                </Typography>
                <hr />
              </Box>
            ))
          ) : (
            <Typography>No results available for this exam.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResultsModalOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminHome;
