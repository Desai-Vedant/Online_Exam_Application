import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import axios from "axios";

function ViewResults() {
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]); // Store exam details

  useEffect(() => {
    fetchResults();
    fetchExams(); // Fetch exam details
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/result/view",
        null,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200 && response.data.results) {
        setResults(response.data.results);
      } else {
        alert("No results found.");
      }
    } catch (error) {
      console.error(error);
      alert("Error fetching results.");
    }
  };

  const fetchExams = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/exam/view",
        null,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setExams(response.data.exams);
      } else {
        alert("Failed to fetch exams.");
      }
    } catch (error) {
      console.error(error);
      alert("Error fetching exams.");
    }
  };

  // Helper function to get the exam name by examId
  const getExamName = (examId) => {
    const exam = exams.find((e) => e._id === examId);
    return exam ? exam.title : "Unknown Exam";
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Results
      </Typography>

      {results.length === 0 ? (
        <Typography variant="body1">No results available.</Typography>
      ) : (
        <Grid container spacing={2}>
          {results.map((result) => (
            <Grid item xs={12} sm={6} md={4} key={result._id}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6">
                  Exam Name: {getExamName(result.examId)}
                </Typography>
                <Typography variant="body1">
                  Total Marks: {result.totalMarks}
                </Typography>
                <Typography variant="body1">
                  Obtained Marks: {result.obtainedMarks}
                </Typography>
                <Typography variant="body1">
                  Appear Date:{" "}
                  {new Date(result.appearDate).toLocaleDateString()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default ViewResults;
