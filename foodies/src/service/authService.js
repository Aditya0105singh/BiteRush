import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const registerUser = async (data) => {
    const response = await axios.post(API_URL + "/register", data, { timeout: 40000 });
    return response;
}

export const login = async (data) => {
    const response = await axios.post(API_URL + "/login", data, { timeout: 40000 });
    return response;
}

export const googleAuth = async (token) => {
    const response = await axios.post(API_URL + "/auth/google", { token }, { timeout: 40000 });
    return response;
}
