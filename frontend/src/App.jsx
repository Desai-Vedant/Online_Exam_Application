import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../components/LoginPage";
import RegisterPage from "../components/RegisterPage";
import MenuAppBar from "../components/MenuAppBar";
import StudentHome from "../pages/studentpages/StudentHome";
import AdminHome from "../pages/adminpages/AdminHome";
import StudentPrivateComponent from "../components/StudentPrivateComponent";
import AdminPrivateComponent from "../components/AdminPrivateComponent";
import ViewResults from "../pages/studentpages/ViewResults";
import CreateExam from "../pages/adminpages/CreateExam";

function App() {
  return (
    <div>
      <Router>
        <MenuAppBar />
        <Routes>
          <Route element={<StudentPrivateComponent />}>
            {/* User Specific Private Routes */}
            <Route path="/studenthome" element={<StudentHome />} />
            <Route path="/veiwresults" element={<ViewResults />} />
          </Route>
          <Route element={<AdminPrivateComponent />}>
            {/* Admin Specific Private Routes */}
            <Route path="/adminhome" element={<AdminHome />} />
            <Route path="/createexam" element={<CreateExam />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
