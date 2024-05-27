const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');

exports.createEdgeSecurityService = async (corpName, siteName) => {

    if(!corpName) throw new Error(`A corp name is needed we received : ${typeof corpName}`);

    if(!siteName) throw new Error(`A siteName name is needed we received : ${typeof siteName}`);

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


exports.getGetSecurityService = async (corpName, siteName) => {

    if(!corpName) throw new Error(`A corp name is needed we received : ${typeof corpName}`);

    if(!siteName) throw new Error(`A siteName name is needed we received : ${typeof siteName}`);

    const response = await axios({
        method: 'get',
        url: `https://dashboard.signalsciences.net/api/v0/corps/${corpName}/sites/${siteName}/edgeDeployment`,
        headers: {
          'x-api-user': process.env.SIGSCI_EMAIL,
          'x-api-token': process.env.SIGSCI_TOKEN,
          'Content-Type': 'application/json'
        }
      });
    
      return response.data;
}


exports.mapEdgeSecurityServiceToFastly = async (corpName, siteName, fastlySID) => {

    if(!corpName) throw new Error(`A corp name is needed we received : ${typeof corpName}`);

    if(!siteName) throw new Error(`A siteName name is needed we received : ${typeof siteName}`);

    if(!fastlySID) throw new Error(`A fastlySID name is needed we received : ${typeof fastlySID}`);

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
    
      return response.data;
      
}