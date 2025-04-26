import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://murmur-1eyn.onrender.com/api",
    withCredentials: true
})

export default axiosInstance;