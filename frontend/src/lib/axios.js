import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.BACKEND_URL,
    withCredentials: true // to send cookies in every single request
});