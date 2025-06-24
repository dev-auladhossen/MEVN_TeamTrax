import axios from "axios";

export const fetchProjectSummary = async (projectId) => {
  const res = await axios.get(
    `http://localhost:5000/api/project-summary/${projectId}`
  );
  return res.data;
};
