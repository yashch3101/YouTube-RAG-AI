import axios from "axios";

const API = axios.create({
  baseURL: "https://youtube-rag-ai-production.up.railway.app",
});

export default API;