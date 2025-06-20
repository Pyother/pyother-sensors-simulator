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
        inputObjects: [
            {
                inputObject: [
                    { x: 0, y: 100 },
                    { x: 40, y: 60 }
                ]
            },
            {
                inputObject: [
                    { x: 40, y: 60 },
                    { x: 60, y: 40 }
                ]
            },
            {
                inputObject: [
                    { x: 60, y: 40 },
                    { x: 100, y: 0 }
                ]
            }
        ]
    }

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