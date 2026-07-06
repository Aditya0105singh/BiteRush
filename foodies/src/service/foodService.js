import axios from 'axios';
import axiosInstance from './axiosInstance';

const API_URL = `${import.meta.env.VITE_API_URL}/api/foods`;

// Used by StoreContext on app load — gets everything (no pagination overhead)
export const fetchFoodList = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        console.error('Error fetching food list:', error);
        throw error;
    }
};

// Used where paginated browsing is needed
export const fetchFoodsPaged = async (page = 0, size = 12, category = '') => {
    try {
        const params = { page, size };
        if (category && category !== 'All') params.category = category;
        const response = await axios.get(API_URL, { params });
        return response.data; // { content, totalPages, totalElements, ... }
    } catch (error) {
        console.error('Error fetching paged foods:', error);
        throw error;
    }
};

export const fetchFoodDetails = async (id) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching food details:', error);
        throw error;
    }
};
