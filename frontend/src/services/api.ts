import axios from "axios";

const API = axios.create({
  baseURL: "youtube-rag-ai-production.up.railway.app",
});

export default API;