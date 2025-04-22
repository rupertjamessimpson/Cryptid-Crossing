const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api"
    : "/api";

export default API_BASE_URL;
