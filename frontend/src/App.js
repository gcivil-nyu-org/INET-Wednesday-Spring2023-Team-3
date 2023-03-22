import * as React from "react";
import SignInSide from "./Components/login";
import Homepage from "./Components/home";
import SignUp from "./Components/signup";
import UploadQuestion from "./Components/uploadQuestion";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";
import ProtectedPage from "./Views/utils_ProtectedPage";
import Login from "./Views/loginPage";
import Register from "./Views/registerPage"
function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            {/* <Route exact path='/' element={<PrivateRoute/>}/> */}
            <Route exact path="/" element={<Homepage />} />
            
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />}></Route>
            <Route
              exact
              path="/UploadQuestion"
              element={<UploadQuestion />}
            ></Route>
          </Routes>{" "}
        </AuthProvider>
      </Router>
    </>
  );
}
export default App;
