const getConfig = async (dispatcher, setter) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/config`);
        const data = await response.json();
        dispatcher(setter(data));
    } catch (e) {
        console.error(e);
    }
};

export default getConfig;