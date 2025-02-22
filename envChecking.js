const dotenv = require('dotenv');
const os = require('os');
const fs = require('fs');
const path = require('path');
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