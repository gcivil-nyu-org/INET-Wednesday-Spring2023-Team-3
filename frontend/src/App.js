import * as React from "react";
import SignInSide from "./Components/login";
import Homepage from "./Components/home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./Components/signup";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Homepage/>} />
          <Route exact path="/SignInSide" element={<SignInSide/>} />
          <Route exact path= "/SignUp" element={<SignUp/>}></Route>
        </Routes>
      </Router>
    </>
  );
}
export default App;
