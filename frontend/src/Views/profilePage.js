import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Navbar from "../Components/navbar";

function ProfilePage() {
  
  const { user } = useContext(AuthContext);
  
  if (!user) {
    return <Navigate to="/login"/>;
  }

  console.log(user.email)
  return (
    <>
    <Navbar/>
    <div>
      <h3>Hi, {user.email}. Your are logged in</h3>
    </div>
    </>
  );
}

export default ProfilePage;