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
if(!process.env.siteName) throw new Error('The siteName is required, nothing has been found in the .env');
if(!process.env.fastlySID) throw new Error('The fastlySID is required, nothing has been found in the .env');


const corpName = process.env.corpName;
const siteName = process.env.siteName;
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

    const wantsToContinue = await askQuestion(`\nYou are about to create a WAF edge deployement, for corpName : ${corpName} and siteName ${siteName}  continue ? [Y/N]`);

    if(wantsToContinue && wantsToContinue.toLowerCase() === "n") process.exit();

    const edgeSecurityServiceCreation = await createEdgeSecurityService(corpName, siteName);

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

    console.log(`Getting security service for ${corpName} and siteName ${siteName}`);
    const securityServ = await getGetSecurityService(corpName, siteName);
    console.log(securityServ);

    process.exit();

});







/*
*
* Mapping to the Fastly service 🔗 
*
*/
myEmitter.on('mapEdgeSecurityServiceToFastly', async () => {

    const wantsToContinue = await askQuestion(`\nYou are about to mapEdgeSecurityServiceToFastly, for corpName : ${corpName}, siteName ${siteName} and fastlySID ${fastlySID} continue ? [Y/N]`);

    if(wantsToContinue && wantsToContinue.toLowerCase() === "n") process.exit();

    const mapingResult = await mapEdgeSecurityServiceToFastly(corpName,siteName, fastlySID);

    console.log(mapingResult);


});

