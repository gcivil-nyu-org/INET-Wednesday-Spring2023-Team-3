import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../Components/navbar";
import AuthContext from "../context/AuthContext";
import { API_ENDPOINT } from "../Components/api";

function RecuriterHome() {
  const { user } = useContext(AuthContext);
  const [userType, setUserType] = useState("Hiring Manager");

  useEffect(() => {
    fetch(`${API_ENDPOINT}/get_user_type/${user.email}/`)
      .then((response) => response.json())
      .then((data) => {
        setUserType(data.user_type);
      })
      .catch((error) => console.error(error));
  }, []);

  const navigate = useNavigate();
  if (userType !== "Hiring Manager") {
    navigate("/");
  }

  return (
    <>
      <Navbar />
      Weclome
    </>
  );
}

export default RecuriterHome;
