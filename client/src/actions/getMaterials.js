import axios from 'axios';

const getMaterials = async ({ setData, setError }) => {

    const url = `${import.meta.env.VITE_APP_BASE_URL}/api/materials`;

    axios.get(url)
        .then((response) => {
            if (setData) setData(response.data);
        })
        .catch((error) => {
            if (setError) setError(error.message);
        });
}

export default getMaterials;