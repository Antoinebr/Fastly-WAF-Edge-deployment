const dotenv = require('dotenv');
const axios = require('axios');
const { getEnvFilePath } = require('./envChecking');
dotenv.config({ path: getEnvFilePath() });


/**
 * Creates an edge security service for a given corporation and site.
 * 
 * @param {string} corpName - The name of the corporation.
 * @param {string} siteName - The name of the site.
 * @returns {Promise<Object>} - A promise that resolves to the response data from the API.
 * @throws {Error} - Throws an error if `corpName` or `siteName` is not provided.
 */
exports.createEdgeSecurityService = async (corpName, siteName) => {
    if (!corpName) throw new Error(`A corp name is needed we received : ${typeof corpName}`);
    if (!siteName) throw new Error(`A siteName name is needed we received : ${typeof siteName}`);

    const response = await axios({
        method: 'put',
        url: `https://dashboard.signalsciences.net/api/v0/corps/${corpName}/sites/${siteName}/edgeDeployment`,
        headers: {
            'x-api-user': process.env.SIGSCI_EMAIL,
            'x-api-token': process.env.SIGSCI_TOKEN,
            'Content-Type': 'application/json'
        }
    });

    return response.data;
}

/**
 * Retrieves the edge security service for a given corporation and site.
 * 
 * @param {string} corpName - The name of the corporation.
 * @param {string} siteName - The name of the site.
 * @returns {Promise<Object>} - A promise that resolves to the response data from the API.
 * @throws {Error} - Throws an error if `corpName` or `siteName` is not provided.
 */
exports.getGetSecurityService = async (corpName, siteName) => {
    if (!corpName) throw new Error(`A corp name is needed we received : ${typeof corpName}`);
    if (!siteName) throw new Error(`A siteName name is needed we received : ${typeof siteName}`);

    const response = await axios({
        method: 'get',
        url: `https://dashboard.signalsciences.net/api/v0/corps/${corpName}/sites/${siteName}/edgeDeployment`,
        headers: {
            'x-api-user': process.env.SIGSCI_EMAIL,
            'x-api-token': process.env.SIGSCI_TOKEN,
            'Content-Type': 'application/json'
        }
    });

    return response;
}

/**
 * Maps an edge security service to Fastly for a given corporation, site, and Fastly service ID.
 * 
 * @param {string} corpName - The name of the corporation.
 * @param {string} siteName - The name of the site.
 * @param {string} fastlySID - The Fastly service ID.
 * @returns {Promise<Object>} - A promise that resolves to the response data from the API.
 * @throws {Error} - Throws an error if `corpName`, `siteName`, or `fastlySID` is not provided.
 */
exports.mapEdgeSecurityServiceToFastly = async (corpName, siteName, fastlySID) => {
    if (!corpName) throw new Error(`A corp name is needed we received : ${typeof corpName}`);
    if (!siteName) throw new Error(`A siteName name is needed we received : ${typeof siteName}`);
    if (!fastlySID) throw new Error(`A fastlySID name is needed we received : ${typeof fastlySID}`);

    const response = await axios({
        method: 'put',
        url: `https://dashboard.signalsciences.net/api/v0/corps/${corpName}/sites/${siteName}/edgeDeployment/${fastlySID}`,
        headers: {
            'x-api-user': process.env.SIGSCI_EMAIL,
            'x-api-token': process.env.SIGSCI_TOKEN,
            'Fastly-Key': process.env.FASTLY_KEY,
            'Content-Type': 'application/json'
        }
    });

    return response;
}

/**
 * Detaches the Edge Deployment Service for a given corporation, site, and Fastly service ID.
 * 
 * @param {string} corpName - The name of the corporation.
 * @param {string} siteName - The name of the site.
 * @param {string} fastlySID - The Fastly service ID.
 * @returns {Promise<Object>} - A promise that resolves to the response data from the API.
 * @throws {Error} - Throws an error if `corpName`, `siteName`, or `fastlySID` is not provided.
 */
exports.detachEdgeDeploymentService = async (corpName, siteName, fastlySID) => {
    if (!corpName) throw new Error(`A corp name is needed we received: ${typeof corpName}`);
    if (!siteName) throw new Error(`A site name is needed we received: ${typeof siteName}`);
    if (!fastlySID) throw new Error(`A fastlySID is needed we received: ${typeof fastlySID}`);

    const response = await axios({
        method: 'delete',
        url: `https://dashboard.signalsciences.net/api/v0/corps/${corpName}/sites/${siteName}/deliveryIntegration/${fastlySID}`,
        headers: {
            'x-api-user': process.env.SIGSCI_EMAIL,
            'Fastly-Key': process.env.FASTLY_KEY,
            'x-api-token': process.env.SIGSCI_TOKEN,
            'Content-Type': 'application/json'
        }
    });

    return response;
}

/**
 * Removes the Edge Deployment for a given corporation and site.
 * 
 * @param {string} corpName - The name of the corporation.
 * @param {string} siteName - The name of the site.
 * @returns {Promise<Object>} - A promise that resolves to the response data from the API.
 * @throws {Error} - Throws an error if `corpName` or `siteName` is not provided.
 */
exports.removeEdgeDeployment = async (corpName, siteName) => {
    if (!corpName) throw new Error(`A corp name is needed we received: ${typeof corpName}`);
    if (!siteName) throw new Error(`A site name is needed we received: ${typeof siteName}`);

    const response = await axios({
        method: 'delete',
        url: `https://dashboard.signalsciences.net/api/v0/corps/${corpName}/sites/${siteName}/edgeDeployment`,
        headers: {
            'x-api-user': process.env.SIGSCI_EMAIL,
            'x-api-token': process.env.SIGSCI_TOKEN,
            'Fastly-Key': process.env.FASTLY_KEY,
            'Content-Type': 'application/json'
        }
    });

    return response;
}

/**
 * Retrieves the latest version of a Fastly service.
 *
 * @param {string} fastlySID - The Fastly service ID.
 * @returns {Promise<string>} - A promise that resolves to the latest version number of the service.
 * @throws {Error} - Throws an error if the retrieval fails.
 */
exports.getLatestServiceVersion = async (fastlySID) => {
    try {
        const response = await axios({
            method: 'get',
            url: `https://api.fastly.com/service/${fastlySID}/version`,
            headers: {
                'Fastly-Key': process.env.FASTLY_KEY,
                'Content-Type': 'application/json'
            }
        });

        // Assuming the versions are returned in ascending order, the last one is the latest
        const versions = response.data;
        const latestVersion = versions[versions.length - 1].number;

        return latestVersion;
    } catch (error) {
        console.error('Error fetching latest service version:', error);
        throw error;
    }
};


/**
 * Retrieves the Edge Security dictionary for a given Fastly service ID and version.
 *
 * @param {string} fastlySID - The Fastly service ID.
 * @param {string} version - The version of the Fastly service.
 * @returns {Promise<Object>} - A promise that resolves to the response data from the API.
 * @throws {Error} - Throws an error if the retrieval fails.
 */
exports.getEdgeSecuriytDictionary = async (fastlySID, version) => {
    try {
        const response = await axios({
            method: 'get',
            url: `https://api.fastly.com/service/${fastlySID}/version/${version}/dictionary/Edge_Security`,
            headers: {
                'Fastly-Key': process.env.FASTLY_KEY,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
        
    } catch (error) {
        console.error('Error geting dictionary :', error.response ? error.response.data : error.message);
        throw error;
    }

}

/**
 * Updates a dictionary item in a Fastly service dictionary.
 *
 * @param {string} fastlySID - The Fastly service ID.
 * @param {string} dictionaryID - The ID of the dictionary to update.
 * @param {string} itemKey - The key of the dictionary item to update.
 * @param {string} itemValue - The new value for the dictionary item.
 * @returns {Promise<Object>} - A promise that resolves to the response data from the API.
 * @throws {Error} - Throws an error if the update fails.
 */
exports.updateDictionaryItem = async (fastlySID, dictionaryID, itemKey, itemValue) => {
    try {
        const response = await axios({
            method: 'put',
            url: `https://api.fastly.com/service/${fastlySID}/dictionary/${dictionaryID}/item/${itemKey}`,
            headers: {
                'Fastly-Key': process.env.FASTLY_KEY,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            data: `item_value=${itemValue}` // URL-encoded form data
        });

        return response.data;
    } catch (error) {
        console.error('Error updating dictionary item:', error.response ? error.response.data : error.message);
        throw error;
    }
}


/**
 * Checks if Bot Management is enabled for a given Fastly service.
 *
 * @param {string} fastlySID - The Fastly service ID.
 * @returns {Promise<Object>} - A promise that resolves to the response data from the API.
 * @throws {Error} - Throws an error if the request fails.
 */
exports.checkBotManagementStatus = async (fastlySID) => {
    try {
        const response = await axios({
            method: 'get',
            url: `https://api.fastly.com/enabled-products/v1/bot_management/services/${fastlySID}`,
            headers: {
                'Fastly-Key': process.env.FASTLY_KEY,
                'Accept': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error checking Bot Management status:', error.response ? error.response.data : error.message);
        throw error;
    }
};


/**
 * Enables Bot Management for a given Fastly service.
 *
 * @param {string} fastlySID - The Fastly service ID.
 * @returns {Promise<Object>} - A promise that resolves to the response data from the API.
 * @throws {Error} - Throws an error if the request fails.
 */
exports.enableBotManagement = async (fastlySID) => {
    try {
        const response = await axios({
            method: 'put',
            url: `https://api.fastly.com/enabled-products/v1/bot_management/services/${fastlySID}`,
            headers: {
                'Fastly-Key': process.env.FASTLY_KEY,
                'Accept': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error enabling Bot Management:', error.response ? error.response.data : error.message);
        throw error;
    }
};


/**
 * 
 * @param {*} corpName 
 * @param {*} siteName 
 * @param {*} fastlySID 
 * @returns 
 */
exports.resyncBackends = async (corpName, siteName, fastlySID) => {
    try {
        const response = await axios({
            method: 'put',
            url: `https://dashboard.signalsciences.net/api/v0/corps/${corpName}/sites/${siteName}/deliveryIntegration/${fastlySID}/backends`,
            headers: {
                'x-api-user': process.env.SIGSCI_EMAIL,
                'x-api-token': process.env.SIGSCI_TOKEN,
                'Fastly-Key': process.env.FASTLY_KEY,
                'Content-Type': 'application/json'
            }
        });

        return response;
    } catch (error) {
        console.error('Error updating backend integration:', error.response ? error.response.data : error.message);
        throw error;
    }
};
