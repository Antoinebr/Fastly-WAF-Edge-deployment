const dotenv = require('dotenv');
dotenv.config();

const EventEmitter = require('events');
const myEmitter = new EventEmitter();

const {createEdgeSecurityService,getGetSecurityService,mapEdgeSecurityServiceToFastly} = require('./edgeService');

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

    -----------------------------------------------------
    `);


    const optionChosen = await askQuestion("Choose an option by inputing the number, then hit enter :");

    const optionChosenAsInt = parseInt(optionChosen);

    if(optionChosenAsInt <= 0 || optionChosenAsInt > 3){
        console.log('❌ Invalid option... Bye bye...');
        process.exit();
    } 

    if(optionChosenAsInt === 1) myEmitter.emit('edgeSecurityServiceCreation');

    if(optionChosenAsInt === 2) myEmitter.emit('getGetSecurityService');

    if(optionChosenAsInt === 3) myEmitter.emit('mapEdgeSecurityServiceToFastly');
    
    

})();




/**
 * 
 *  CREATE edgeSecurityService 🌎 
 * 
 */
myEmitter.on('edgeSecurityServiceCreation', async () => {

    const wantsToContinue = await askQuestion(`\nYou are about to create a WAF edge deployement, for corpName : ${corpName} and siteShortName ${siteShortName}  continue ? [Y/N]`);

    if(wantsToContinue && wantsToContinue.toLowerCase() === "n") process.exit();

    const edgeSecurityServiceCreation = await createEdgeSecurityService(corpName, siteShortName);

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
    const securityServ = await getGetSecurityService(corpName, siteShortName);
    console.log(securityServ);

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
        mapingResult = await mapEdgeSecurityServiceToFastly(corpName, siteShortName, fastlySID);
        statusCode = mapingResult ? mapingResult.status : null;

        if (statusCode !== 200) {
            console.log(`Received status code ${statusCode}. Retrying in 3 seconds...`);
            await new Promise( (resolve, reject) => setTimeout( () => resolve(), 3000 ));
        }

    } while (statusCode !== 200);

    console.log(`\n\n mapEdgeSecurityServiceToFastly worked ✅ 🎉 \n\n`);
    console.log(mapingResult.data);
    console.log("Good Bye 👋");
    process.exit();

});

