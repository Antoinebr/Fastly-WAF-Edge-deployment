const dotenv = require('dotenv');
const os = require('os');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { askQuestion } = require('./askQuestion');


const getEnvFilePath = () => {

    // Default to global config directory
    const envDir = path.join(os.homedir(), '.Fastly-WAF-Edge-deployement');
    const envFilePath = path.join(envDir, '.env');

    // Ensure the directory exists
    if (!fs.existsSync(envDir)) {
        fs.mkdirSync(envDir, { recursive: true });
    }

    return envFilePath;
};

exports.getEnvFilePath = getEnvFilePath;


/**
 * 
 * Check if the environment variables are correctly set before proceeding.
 * 
 */
exports.checkEnv = async () => {

    const envFilePath = getEnvFilePath();

    if (!fs.existsSync(envFilePath)) {
        console.log(`\n ❌ .env file not found. in ${envFilePath} \n Let\'s create one! \n`);
        await createEnvFile();
    }

    console.log(`
    👍 .env found at ${envFilePath} \n`);

    dotenv.config({ path: envFilePath });

    // Check if the environment variables are correctly set before proceeding.
    try {

        if (!process.env.SIGSCI_EMAIL) throw new Error('The SIGSCI_EMAIL is required, nothing has been found in the .env');
        if (!process.env.SIGSCI_TOKEN) throw new Error('The SIGSCI_TOKEN is required, nothing has been found in the .env');
        if (!process.env.FASTLY_KEY) throw new Error('The FASTLY_KEY is required, nothing has been found in the .env');
        if (!process.env.corpName) throw new Error('The process.env.corpName is required, nothing has been found in the .env');
        if (!process.env.siteShortName) throw new Error('The process.env.siteShortName is required, nothing has been found in the .env');
        if (!process.env.fastlySID) throw new Error('The process.env.fastlySID is required, nothing has been found in the .env');

    } catch (error) {
        console.error(`❌ Something went wrong 😬... \n\n Your .env file is either missing or incorrectly configured. More information can be found in the following error message: \n`);
        console.error(error);
        process.exit();
    }

    // Check if a key is present twice 
    if (process.env.SIGSCI_TOKEN === process.env.FASTLY_KEY) {
        console.error(`❌ \n SIGSCI_TOKEN is equal to FASTLY_KEY ! You entered the wrong key ! double check your .env`);
        console.error(error);
        process.exit();
    }

    console.log(`
    👌 .env loaded for :

    SIGSCI_EMAIL : ${process.env.SIGSCI_EMAIL}
    corpName : ${process.env.corpName}
    siteShortName : ${process.env.siteShortName}
    fastlySID : ${process.env.fastlySID}`);
    

    const fastlyServices = await getPaginatedServices();
    
    console.log(`
    -----------------------------------------------------
    
    🔍 Checking the correctness of the .env value by calling Fastly APIs`);

    if(fastlyServices.status !== 200){
        console.error(`❌ \n Your FASTLY_KEY in the .env ! seems to be wrong we couldn't list your services we got ${fastlyServices.status}`);
        console.error(error);
        process.exit();
    }

    console.log(`

    ℹ️ Your FASTLY_KEY is correct we received a ${fastlyServices.status} when listing your services`);

    const theService = await getServiceDetails(process.env.fastlySID);
    console.log(`

    ℹ️ Your fastlySID is correct ${theService.id} the service name is
    ${theService.name}`);
    //console.log(theService.name, theService.id, process.env.fastlySID === theService.id, Object.keys(theService)); //environments.name);

    const corps = await getCorps();
    if(corps.data.map(corp => corp.name).includes(process.env.corpName)){
    console.log(`
    ℹ️ Corp name ${process.env.corpName} is accessible with the key your provided
    `);
    }else{
        console.error(`
    ❌ Your corpName in the .env ! seems to be wrong we couldn't get the corp ${process.env.corpName} with your SIGSCI_TOKEN`);
        process.exit();
    }
   
};

/**
 * 
 * Prompt user for environment variables and create .env file.
 * 
 */
const createEnvFile = async () => {
    const envVars = {};

    console.log('Please provide the following environment variables: \n');

    // set the response of askQuestion in envVars
    envVars.SIGSCI_EMAIL = await askQuestion('SIGSCI_EMAIL: ');
    envVars.SIGSCI_TOKEN = await askQuestion('SIGSCI_TOKEN: ');
    envVars.FASTLY_KEY = await askQuestion('FASTLY_KEY: ');
    envVars.corpName = await askQuestion('corpName: ');
    envVars.siteShortName = await askQuestion('siteShortName: ');
    envVars.fastlySID = await askQuestion('fastlySID: ');

    const envContent = Object.entries(envVars).map(([key, value]) => `${key}="${value}"`).join('\n');

    const envFilePath = getEnvFilePath();

    fs.writeFileSync(envFilePath, envContent);
    console.log(`\n ✅ .env file created at ${envFilePath}`);

    dotenv.config(); // Reload the .env file
};

/**
 * 
 * Prompt user for environment variables and create .env file.
 * 
 */
const getServiceDetails = async (fastlySID, version) => {
    try {
        const response = await axios({
            method: 'get',
            url: `https://api.fastly.com/service/${fastlySID}/details`,
            headers: {
                'Fastly-Key': process.env.FASTLY_KEY,
                'Accept': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error(`
    ❌ Error fetching service details 🚧 check if your fastlySID is correct :
        `,error.response ? error.response.data : error.message);
        process.exit();
    }
};


/**
 * 
 * getPaginatedServices
 * 
 */
const getPaginatedServices = async (direction = 'ascend', page = 1, perPage = 20, sort = 'created') => {
    try {
        const response = await axios({
            method: 'get',
            url: 'https://api.fastly.com/service',
            headers: {
                'Fastly-Key': process.env.FASTLY_KEY,
                'Accept': 'application/json'
            },
            params: {
                direction: direction, // Sorting direction (ascend or descend)
                page: page, // Page number
                per_page: perPage, // Number of items per page
                sort: sort // Sorting field ( created, updated, etc.)
            }
        });

        return response;
    } catch (error) {
    
        console.error(`
    ❌ Error fetching services 🚧 check if your FASTLY_KEY is correct :
    `,error.response ? error.response.data : error.message);

        process.exit();
    }
};


const getCorps = async () => {
    try {
        const response = await axios({
            method: 'get',
            url: 'https://dashboard.signalsciences.net/api/v0/corps',
            headers: {
                'x-api-user': process.env.SIGSCI_EMAIL,
                'x-api-token': process.env.SIGSCI_TOKEN,
                'Accept': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error(`
            ❌ Error fetching Signal Sciences corps 🚧 check if your SIGSCI_EMAIL and SIGSCI_TOKEN are correct :
            `,error.response ? error.response.data : error.message);
        
        process.exit();
    }
};