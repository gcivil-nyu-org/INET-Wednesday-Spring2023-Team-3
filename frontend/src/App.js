import * as React from "react";
import Homepage from "./Views/home";
import UploadQuestion from "./Views/uploadQuestion";
import QuestionDetails from "./Views/questionDetails";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProfilePage from "./Views/profilePage";
import Login from "./Views/loginPage";
import Register from "./Views/registerPage";
import PasswordReset from "./Views/passwordReset";
import SetNewPassword from "./Views/setNewPassword";
import VerifyEmail from "./Views/verifyEmail";
import AnswersList from "./Views/answersList";
import AnswerDetails from "./Views/answerDetails";
import EditProfile from "./Views/editProfilePage";
import QuickStart from "./Views/quickstart";
import MockInterview from "./Views/mockInterview";
import Experience from "./Views/experience";
import ExperienceDetails from "./Views/experienceDetails";
import UploadExperience from "./Views/uploadExperience";
import RecruiterHome from "./Views/recruiterHome";
import ChatRoom from "./Components/chatRoom";
import Connect from "./Components/connect";
import ProfilePageOther from "./Views/profilePageOther";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route exact path="/" element={<Homepage />} />
            <Route exact path="/recruiterHome" element={<RecruiterHome />} />
            <Route
              exact
              path="/QuestionDetails"
              element={<QuestionDetails />}
            />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/UploadQuestion" element={<UploadQuestion />} />
            <Route
              exact
              path="/uploadExperience"
              element={<UploadExperience />}
            />
            <Route path="/questions/:pk" element={<QuestionDetails />} />
            <Route path="/answers/:question_id" element={<AnswersList />} />
            <Route path="/answer/:answer_id" element={<AnswerDetails />} />
            <Route path="/signup/verify/*" element={<VerifyEmail />} />
            <Route path="/password/reset" element={<PasswordReset />} />
            <Route path="/start" element={<QuickStart />} />
            <Route path="/mock-interview" element={<MockInterview />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/social" element={<ChatRoom />} />
            <Route path="/connect" element={<Connect />} />
            <Route
              path="/experience/:pk/:author"
              element={<ExperienceDetails />}
            />
            <Route
              path="/password/reset/verify/*"
              element={<SetNewPassword />}
            />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userEmail" element={<ProfilePageOther />} />
            <Route path="/editProfilePage" element={<EditProfile />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}
export default App;
