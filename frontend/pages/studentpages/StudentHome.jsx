import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  Modal,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";
import axios from "axios";

function StudentHome() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

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

  const handleOpenExam = (exam) => {
    setSelectedExam(exam);
    setAnswers({});
    setModalOpen(true);
  };

  const handleAnswerChange = (questionIndex, option) => {
    setAnswers({ ...answers, [questionIndex]: option });
  };

  const calculateResult = async () => {
    if (!selectedExam) return;

    const totalMarks = selectedExam.questions.reduce(
      (sum, q) => sum + q.marks,
      0
    );
    let obtainedMarks = 0;

    selectedExam.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        obtainedMarks += question.marks;
      }
    });

    const resultData = {
      examId: selectedExam._id,
      totalMarks,
      obtainedMarks,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/result/create",
        resultData,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        alert("Exam submitted successfully. Result created.");
      } else {
        alert("Failed to create result.");
      }
    } catch (error) {
      console.error(error);
      alert("Error creating result.");
    }

    setModalOpen(false);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Welcome Student!
      </Typography>

      <Typography variant="h5" gutterBottom>
        Available Exams
      </Typography>
      <Grid container spacing={2}>
        {exams.map((exam) => (
          <Grid item xs={12} sm={6} md={4} key={exam._id}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">{exam.title}</Typography>
              <Typography variant="body2">{exam.description}</Typography>
              <Typography variant="body2">
                Passing Marks: {exam.passingMarks}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenExam(exam)}
              >
                Attempt Exam
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Modal for Exam */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Paper
          sx={{
            width: "80%",
            margin: "auto",
            marginTop: "5%",
            padding: 4,
            maxHeight: "80vh",
            overflow: "auto",
          }}
        >
          <Typography variant="h5" gutterBottom>
            {selectedExam?.title}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {selectedExam?.description}
          </Typography>

          {selectedExam?.questions.map((question, index) => (
            <Box key={index} sx={{ marginBottom: 3 }}>
              <Typography variant="h6">
                Q{index + 1}. {question.question}
              </Typography>
              <RadioGroup
                value={answers[index] || ""}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              >
                {question.options.map((option, optionIndex) => (
                  <FormControlLabel
                    key={optionIndex}
                    value={option}
                    control={<Radio />}
                    label={`${String.fromCharCode(
                      65 + optionIndex
                    )}: ${option}`}
                  />
                ))}
              </RadioGroup>
            </Box>
          ))}

          <Button
            variant="contained"
            color="primary"
            onClick={calculateResult}
            sx={{ marginTop: 2 }}
          >
            Submit Exam
          </Button>
        </Paper>
      </Modal>
    </div>
  );
}

export default StudentHome;
