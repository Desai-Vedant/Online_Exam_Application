import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  IconButton,
  MenuItem,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import axios from "axios";

function CreateExam() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [passingMarks, setPassingMarks] = useState(0);
  const [questions, setQuestions] = useState([]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: "", marks: 0 },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctAnswer = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    const data = {
      title,
      description,
      passingMarks,
      questions,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/exam/create",
        data,
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        alert("Exam created successfully!");
      } else {
        alert("Failed to create exam.");
      }
    } catch (error) {
      console.error(error);
      alert("Error creating exam. Please try again.");
    }
  };

  return (
    <Paper sx={{ padding: 3, margin: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create Exam
      </Typography>
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          fullWidth
          label="Exam Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Passing Marks"
          type="number"
          value={passingMarks}
          onChange={(e) => setPassingMarks(Number(e.target.value))}
          variant="outlined"
          margin="normal"
        />
      </Box>
      <Typography variant="h5" gutterBottom>
        Questions
      </Typography>
      {questions.map((question, questionIndex) => (
        <Paper
          key={questionIndex}
          sx={{ padding: 2, marginBottom: 2, position: "relative" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={`Question ${questionIndex + 1}`}
                value={question.question}
                onChange={(e) =>
                  handleInputChange(questionIndex, "question", e.target.value)
                }
                variant="outlined"
                margin="normal"
              />
            </Grid>
            {question.options.map((option, optionIndex) => (
              <Grid item xs={6} sm={3} key={optionIndex}>
                <TextField
                  fullWidth
                  label={`Option ${optionIndex + 1}`}
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(
                      questionIndex,
                      optionIndex,
                      e.target.value
                    )
                  }
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Correct Answer"
                value={question.correctAnswer}
                onChange={(e) =>
                  handleCorrectAnswerChange(questionIndex, e.target.value)
                }
                variant="outlined"
                margin="normal"
              >
                {question.options.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {`Option ${String.fromCharCode(65 + index)}: ${option}`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Marks"
                type="number"
                value={question.marks}
                onChange={(e) =>
                  handleInputChange(
                    questionIndex,
                    "marks",
                    Number(e.target.value)
                  )
                }
                variant="outlined"
                margin="normal"
              />
            </Grid>
          </Grid>
          <IconButton
            onClick={() => handleRemoveQuestion(questionIndex)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <RemoveCircleIcon color="error" />
          </IconButton>
        </Paper>
      ))}
      <Box sx={{ marginBottom: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddCircleIcon />}
          onClick={handleAddQuestion}
        >
          Add Question
        </Button>
      </Box>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Create Exam
      </Button>
    </Paper>
  );
}

export default CreateExam;
