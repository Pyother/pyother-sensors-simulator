import { useState, useEffect } from 'react';
import axios from 'axios';

const useGetRequest = (endpoint, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { 
        immediate = true, 
        onSuccess,
        onError
    } = options;

    const fetchData = async () => {
        if (!endpoint) return;

        setLoading(true);
        setError(null);

        try {
            const url = `${import.meta.env.VITE_APP_BASE_URL || ''}${endpoint}`;
            const response = await axios.get(url);
            
            setData(response.data);
            
            if (onSuccess) {
                onSuccess(response.data);
            }
        } catch (err) {
            const errorMessage = err.message || 'An error occurred';
            setError(errorMessage);
            
            if (onError) {
                onError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (immediate && endpoint) {
            fetchData();
        }
    }, [endpoint, immediate]);

    return {
        data,
        loading,
        error,
        refetch: fetchData
    };
};

export default useGetRequest;
