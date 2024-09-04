const dotenv = require('dotenv');
dotenv.config();
const EventEmitter = require('events');
const myEmitter = new EventEmitter();
const {handleAxiosError} = require('./utils');
const {createEdgeSecurityService,getGetSecurityService,mapEdgeSecurityServiceToFastly,removeEdgeDeployment,detachEdgeDeploymentService} = require('./edgeService');
const {askQuestion} = require('./askQuestion');




if(!process.env.SIGSCI_EMAIL) throw new Error('The SIGSCI_EMAIL is required, nothing has been found in the .env');
if(!process.env.SIGSCI_TOKEN) throw new Error('The SIGSCI_TOKEN is required, nothing has been found in the .env');
if(!process.env.FASTLY_KEY) throw new Error('The FASTLY_KEY is required, nothing has been found in the .env');


if(!process.env.corpName) throw new Error('The corpName is required, nothing has been found in the .env');
if(!process.env.siteShortName) throw new Error('The siteShortName is required, nothing has been found in the .env');
if(!process.env.fastlySID) throw new Error('The fastlySID is required, nothing has been found in the .env');


const corpName = process.env.corpName;
const siteShortName = process.env.siteShortName;
const fastlySID = process.env.fastlySID;




(async() => {


    console.log(`
    -----------------------------------------------------
    Menu
    -----------------------------------------------------

    🌎 : edgeSecurityServiceCreation - [1]

    🔒 : getGetSecurityService - [2]

    🔗 : mapEdgeSecurityServiceToFastly - [3]

    💥 : detachEdgeDeploymentService - [4]

    ❌ : removeEdgeDeployment - [5]

    -----------------------------------------------------
    `);


    const optionChosen = await askQuestion("Choose an option by inputing the number, then hit enter :");

    const optionChosenAsInt = parseInt(optionChosen);

    if(optionChosenAsInt <= 0 || optionChosenAsInt >5){
        console.log('❌ Invalid option... Bye bye...');
        process.exit();
    } 

    if(optionChosenAsInt === 1) myEmitter.emit('edgeSecurityServiceCreation');

    if(optionChosenAsInt === 2) myEmitter.emit('getGetSecurityService');

    if(optionChosenAsInt === 3) myEmitter.emit('mapEdgeSecurityServiceToFastly');

    if(optionChosenAsInt === 4) myEmitter.emit('detachEdgeDeploymentService');

    if(optionChosenAsInt === 5) myEmitter.emit('removeEdgeDeployment');
    
    

})();

/**
 * 
 *  CREATE edgeSecurityService 🌎 
 * 
 */
myEmitter.on('edgeSecurityServiceCreation', async () => {

    const wantsToContinue = await askQuestion(`\nYou are about to create a WAF edge deployement, for corpName : ${corpName} and siteShortName ${siteShortName}  continue ? [Y/N]`);

    if(wantsToContinue && wantsToContinue.toLowerCase() === "n") process.exit();

    const edgeSecurityServiceCreation = await createEdgeSecurityService(corpName, siteShortName).catch(handleAxiosError)

    if(typeof edgeSecurityServiceCreation !== "object") throw new Error('Unfortunetly the edgeSecurityServiceCreation failed');
    
    console.log(`✅ edgeSecurityServiceCreation : Service created 🌎`);
    process.exit();
    
});

/**
 * 
 *  GET getGetSecurityService 🔒
 * 
 */
myEmitter.on('getGetSecurityService', async () => {

    console.log(`Getting security service for ${corpName} and siteShortName ${siteShortName}`);

    const securityServ = await getGetSecurityService(corpName, siteShortName).catch(handleAxiosError);

    if(!securityServ){
        console.log("❌ Error getGetSecurityService");
        return;
    } 

    if(securityServ.status === 200 ) console.log( `\n\n getGetSecurityService worked ✅ 🎉  \n\n ${JSON.stringify(securityServ.data)} \n\n`);

    process.exit();

});

/*
*
* Mapping to the Fastly service 🔗 
*
*/
myEmitter.on('mapEdgeSecurityServiceToFastly', async () => {

    const wantsToContinue = await askQuestion(`\nYou are about to mapEdgeSecurityServiceToFastly, for corpName : ${corpName}, siteShortName ${siteShortName} and fastlySID ${fastlySID} continue ? [Y/N]`);

    if(wantsToContinue && wantsToContinue.toLowerCase() === "n") process.exit();

    let mapingResult;
    let statusCode;
    
    do {
        try {
            mapingResult = await mapEdgeSecurityServiceToFastly(corpName, siteShortName, fastlySID);
            statusCode = mapingResult ? mapingResult.status : null;
        } catch (error) {
            if (error.response) {
                console.log(`Received status code ${error.response.status} - ${error.response.statusText}. Retrying in 3 seconds... Be patient ! 🙂`);
                await new Promise(resolve => setTimeout(resolve, 3000)); // Wait before retrying
            } else {
                console.error(`Error: ${error.message}. Retrying in 3 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 3000)); // Wait before retrying
            }
        }
    } while (statusCode !== 200);
    
    console.log(`\n\n mapEdgeSecurityServiceToFastly worked ✅ 🎉 \n\n`);
    console.log(mapingResult.data);
    console.log("Good Bye 👋");
    process.exit();

});

/*
*
* 
*
*/
myEmitter.on('detachEdgeDeploymentService', async () => {

    const wantsToContinue = await askQuestion(`\nYou are about to detachEdgeDeploymentService, for corpName : ${corpName}, siteShortName ${siteShortName} and fastlySID ${fastlySID} continue ? [Y/N]`);

    if(wantsToContinue && wantsToContinue.toLowerCase() === "n") process.exit();

    console.log(`Detaching EdgeDeploymentService....`);
    const detachResult = await detachEdgeDeploymentService(corpName,siteShortName,fastlySID).catch(handleAxiosError);
    if(!detachResult)  throw new Error('Unfortunetly the detachEdgeDeploymentService failed');

    console.log(`\n\n detachEdgeDeploymentService worked ✅ 🎉 \n\n`);
    console.log(detachResult.data);
    console.log("Good Bye 👋");
    process.exit();

});

/*
*
* 
*
*/
myEmitter.on('removeEdgeDeployment', async () => {

    const wantsToContinue = await askQuestion(`\nYou are about to removeEdgeDeployment, for corpName : ${corpName}, siteShortName ${siteShortName} and fastlySID ${fastlySID} continue ? [Y/N]`);

    if(wantsToContinue && wantsToContinue.toLowerCase() === "n") process.exit();

    console.log(`Removing the EdgeDeployment....`);

    const removeResult = await removeEdgeDeployment(corpName, siteShortName).catch(handleAxiosError);
    if(removeResult.status !== 204 && removeResult.status !== 200)  throw new Error('Unfortunetly the removeEdgeDeployment failed');
    console.log(`\n\n removeEdgeDeployment worked ✅ 🎉 \n\n`);
    console.log(removeResult.data);


    console.log("Good Bye 👋");
    process.exit();

});

