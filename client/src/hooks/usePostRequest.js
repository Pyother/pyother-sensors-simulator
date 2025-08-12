import { useState } from 'react';
import axios from 'axios';

const usePostRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const postData = async (endpoint, data, options = {}) => {
        const { 
            onSuccess, 
            onError 
        } = options;

        setLoading(true);
        setError(null);

        try {
            const url = `${import.meta.env.VITE_APP_BASE_URL || ''}${endpoint}`;
            const response = await axios.post(url, data);
            
            if (onSuccess) {
                onSuccess(response.data);
            }

            return response.data;
        } catch (err) {
            const errorMessage = err.message || 'An error occurred';
            setError(errorMessage);
            
            if (onError) {
                onError(errorMessage);
            }
            
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        postData,
        loading,
        error,
        clearError: () => setError(null)
    };
};

export default usePostRequest;
