import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../components/LoginPage";
import RegisterPage from "../components/RegisterPage";
import MenuAppBar from "../components/MenuAppBar";
import UserHome from "../components/UserHome";
import AdminHome from "../components/AdminHome";
import UserPrivateComponent from "../components/UserPrivateComponent";
import AdminPrivateComponent from "../components/AdminPrivateComponent";

function App() {
  return (
    <div>
      <Router>
        <MenuAppBar />
        <Routes>
          <Route element={<UserPrivateComponent />}>
            {/* User Specific Private Routes */}
            <Route path="/userhome" element={<UserHome />} />
          </Route>
          <Route element={<AdminPrivateComponent />}>
            {/* Admin Specific Private Routes */}
            <Route path="/adminhome" element={<AdminHome />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
