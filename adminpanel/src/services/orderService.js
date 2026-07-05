import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/orders`;

export const fetchAllOrders = async (token) => {
    try {
        const response = await axios.get(API_URL + "/all", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error occured while fetching the orders', error);
        throw error;
    }
}

export const updateOrderStatus = async (orderId, status, token) => {
    try {
        const response = await axios.patch(
            `${API_URL}/status/${orderId}?status=${status}`,
            {},
            { headers: { "Authorization": `Bearer ${token}` } }
        );
        return response.status === 200;
    } catch (error) {
        console.error('Error occured while updating the status', error);
        throw error;
    }
}
