import api from "../api";

export const studentLogin = async (roll) => {
  return api.post("/student/login", { roll });
};

export const getSubjects = async () => {
  return api.get("/student/subjects");
};

export const submitFeedback = async (data) => {
  return api.post("/student/submit", data);
};
