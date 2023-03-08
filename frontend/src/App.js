import * as React from "react";
import SignInSide from "./Components/login";
import Homepage from "./Components/home";
import SignUp from "./Components/signup";
import UploadQuestion from "./Components/uploadQuestion";
import QuestionDetails from "./Components/questionDetails";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route exact path="/QuestionDetails" element={<QuestionDetails />} />
          <Route exact path="/SignInSide" element={<SignInSide />} />
          <Route exact path="/SignUp" element={<SignUp />}></Route>
          <Route
            exact
            path="/UploadQuestion"
            element={<UploadQuestion />}
          ></Route>
        </Routes>
      </Router>
    </>
  );
}
export default App;
