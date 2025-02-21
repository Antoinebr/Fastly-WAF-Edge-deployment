const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');

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