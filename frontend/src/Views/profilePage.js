import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function ProfilePage() {
  
  const { user } = useContext(AuthContext);
  
  if (!user) {
    return <Navigate to="/login"/>;
  }

  console.log(user)
  return (
    <div>
      <h1>Projected Page</h1>
    </div>
  );
}

export default ProfilePage;