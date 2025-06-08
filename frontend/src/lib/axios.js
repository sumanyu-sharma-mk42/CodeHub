import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "https://codehub-hkx5.onrender.com/api",
    withCredentials: true // to send cookies in every single request
});