/**
 * Handles errors thrown by axios requests.
 * @param {Error} error - The error object thrown by axios.
 */
function handleAxiosError(error) {
    if (error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        console.error(`Error: ${error.response.status} - ${error.response.statusText}`);

        if(error.response.data) console.log(error.response.data);
        
        return;
    }
    if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        return;
    }
    // Something happened in setting up the request that triggered an Error
    console.error('Error', error.message);
}

module.exports = {
    handleAxiosError
};