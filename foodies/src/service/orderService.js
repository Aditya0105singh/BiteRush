import axiosInstance from './axiosInstance';

const API_URL = `/api/orders`;

export const fetchUserOrders = async (token) => {
    try {
        const response = await axiosInstance.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error occured while fetching the orders', error);
        throw error;
    }
}

export const createOrder = async (orderData, token) => {
    try {
        const response = await axiosInstance.post(API_URL + '/create', orderData);
        return response.data;
    } catch (error) {
        console.error('Error occured while creating the order', error);
        throw error;
    }
}

export const verifyPayment = async (paymentData, token) => {
    try {
        const response = await axiosInstance.post(API_URL + '/verify', paymentData);
        return response.status === 200;
    } catch (error) {
        console.error('Error occured while verifing the payment', error);
        throw error;
    }
}

export const deleteOrder = async (orderId, token) => {
    try {
        await axiosInstance.delete(API_URL + '/' + orderId);
    } catch (error) {
        console.error('Error occured while deleting the order', error);
        throw error;
    }
}
