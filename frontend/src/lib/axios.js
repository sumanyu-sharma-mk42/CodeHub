import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: process.env.BACKEND_URL,
    withCredentials: true // to send cookies in every single request
});