import axiosInstance from './axiosInstance';

const API_URL = `/api/cart`;

export const addToCart = async (foodId, token) => {
    try {
        await axiosInstance.post(API_URL, { foodId });
    } catch (error) {
        console.error('Error while adding the cart data', error);
    }
}

export const removeQtyFromCart = async (foodId, token) => {
    try {
        await axiosInstance.post(API_URL + '/remove', { foodId });
    } catch (error) {
        console.error('Error while removing qty from cart', error);
    }
}

export const getCartData = async (token) => {
    try {
        const response = await axiosInstance.get(API_URL);
        return response.data.items;
    } catch (error) {
        console.error('Error while fetching the cart data', error);
    }
}

export const clearCartItems = async (token, setQuantities) => {
    try {
        await axiosInstance.delete(API_URL);
        setQuantities({});
    } catch (error) {
        console.error('Error while clearing the cart', error);
        throw error;
    }
}
