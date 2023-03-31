import * as React from "react";
import Homepage from "./Components/home";
import UploadQuestion from "./Components/uploadQuestion";
import QuestionDetails from "./Components/questionDetails";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProfilePage from "./Views/profilePage";
import Login from "./Views/loginPage";
import Register from "./Views/registerPage"
import PasswordReset from "./Components/passwordReset"
import SetNewPassword from "./Components/setNewPassword";
import VerifyEmail from "./Components/verifyEmail";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route exact path="/" element={<Homepage />} />
            <Route exact path="/QuestionDetails" element={<QuestionDetails />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/UploadQuestion" element={<UploadQuestion />} />
            <Route path="/questions/:pk" element={<QuestionDetails />} />
            <Route path="/signup/verify/*" element={<VerifyEmail />} />
            <Route path="/password/reset" element={<PasswordReset />} />
            <Route path="/password/reset/verify/*" element={<SetNewPassword />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}
export default App;
