// * Networking:
import axios from 'axios';

const sendRequest = async ({ data, setResponse, setError }) => {
    const url = `${import.meta.env.VITE_APP_BASE_URL}/api/calc/distance`;
    const body = {
        position: {
            x: data?.position?.x,
            y: data?.position?.y
        }, 
        direction: data?.direction,
        angleStep: data?.angleStep,
        sensor: data?.sensor,
        inputObjects: (data?.inputObjects || []).map(obj => ({
            inputObject: obj.geometry || []
        }))
    }

    console.log('Sending request with body:', JSON.stringify(body, null, 2));

    axios.post(url, body)
        .then((response) => {
            console.log('Response:', response.data);
            if (setResponse) {
                setResponse(response.data);
            }
        }).catch((error) => {
            if (setError) {
                console.log('Error:', error.message);
                setError(error.message);
            }
        });
}

export default sendRequest;