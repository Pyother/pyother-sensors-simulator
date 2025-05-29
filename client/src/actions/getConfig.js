import axios from 'axios';

const getConfig = async ({ setData, setError }) => {

    const url = `${import.meta.env.VITE_APP_BASE_URL}/api/config`;

    axios.get(url)
        .then((response) => {
            if (setData) setData(response.data);
        })
        .catch((error) => {
            if (setError) setError(error.message);
        });
}

export default getConfig;