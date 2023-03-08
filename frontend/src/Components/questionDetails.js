import { useState, useEffect } from 'react';
import Navbar from './navbar';


function QuestionDetails() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://127.0.0.1:8000/api/questions/?pk=1");
      const output = await response.json();
      setData(output);
    }

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  console.log(data)
  const fields = data.question_data[0].fields
  const categories = fields.categories
  const companies = fields.companies
  const description = fields.description
  const difficulty = fields.difficulty
  const positions = fields.positions
  const title = fields.title
  const type = fields.type

  console.log(fields, categories, companies, description, difficulty, positions, title, type);

  return <div>
    <Navbar></Navbar>
    <div>
      <h1>Title: {title}</h1>
      <h3>Description: {description}</h3>
    </div>
  </div>;
}

export default QuestionDetails;