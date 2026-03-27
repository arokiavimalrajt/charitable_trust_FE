import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL:
    "https://charitable-trust-be-git-vimal.apps.le0z4hd8.centralindia.aroapp.io", // Set your base URL here
});

export default api;
