import { useParams } from "react-router-dom";

import Navbar from "../Components/navbar";

function AnswersList() {
  const { question_id } = useParams();

  return (
    <>
      <Navbar />
    </>
  );
}

export default AnswersList;
