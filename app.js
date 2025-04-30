#!/usr/bin/env node
const {checkEnv} = require('./envChecking');
const EventEmitter = require('events');
const myEmitter = new EventEmitter();
const { handleAxiosError } = require('./utils');
const { createEdgeSecurityService, getGetSecurityService, mapEdgeSecurityServiceToFastly, removeEdgeDeployment, detachEdgeDeploymentService, getEdgeSecuriytDictionary, getLatestServiceVersion, updateDictionaryItem, enableBotManagement, resyncBackends } = require('./edgeService');
const { askQuestion } = require('./askQuestion');
const { error } = require('console');

console.log(`
    =============================================
    
    🚀 Welcome to the Fastly WAF Edge Edge Deployment Script 🌍 
    
    👨‍💻 Author: https://github.com/Antoinebr/  
    
    =============================================

`);

const main = async () => {

    

    console.log(`
    -----------------------------------------------------
    Menu
    -----------------------------------------------------

    🌎 : Create an Edge Security Service - [1]

    🔒 : Get and verify the creation of the Edge Security Service - [2]

    🔗 : Map the Edge Security Service to the Fastly CDN Service - [3]

    💯 : Set the percentage of traffic to be analyzed by the WAF  - [4]

    💥 : detach Edge Deployment Service - [5]

    ❌ : remove Edge Deployment - [6]

    ♻️ : resync backend - [7]

    -----------------------------------------------------
    `);


    const optionChosen = await askQuestion("Choose an option by inputing the number, then hit enter : ");

    const optionChosenAsInt = parseInt(optionChosen);

    if (optionChosenAsInt <= 0 || optionChosenAsInt > 8) {
        console.log('❌ Invalid option... Bye bye...');
        process.exit();
    }

    if (optionChosenAsInt === 1) myEmitter.emit('edgeSecurityServiceCreation');

    if (optionChosenAsInt === 2) myEmitter.emit('getGetSecurityService');

    if (optionChosenAsInt === 3) myEmitter.emit('mapEdgeSecurityServiceToFastly');

    if (optionChosenAsInt === 4) myEmitter.emit('editDictionary');

    //if (optionChosenAsInt === 5) myEmitter.emit('addBotManagement');

    if (optionChosenAsInt === 5) myEmitter.emit('detachEdgeDeploymentService');

    if (optionChosenAsInt === 6) myEmitter.emit('removeEdgeDeployment');

    if (optionChosenAsInt === 7) myEmitter.emit('resyncBackends');
    

}

(async () => {
    
    await checkEnv();

    await main();

})();

/**
 * 
 *  CREATE edgeSecurityService 🌎 
 * 
 */
myEmitter.on('edgeSecurityServiceCreation', async () => {

    const wantsToContinue = await askQuestion(`\n\n You are about to create a WAF edge deployement, for corpName : ${process.env.corpName} and siteShortName ${process.env.siteShortName}  continue ? [Y/N] \n\n`);

    if (wantsToContinue && wantsToContinue.toLowerCase() === "n") await main(); //process.exit();

    const edgeSecurityServiceCreation = await createEdgeSecurityService(process.env.corpName, process.env.siteShortName).catch(handleAxiosError)

    if (typeof edgeSecurityServiceCreation !== "object") throw new Error('Unfortunetly the edgeSecurityServiceCreation failed');

    console.log(`✅ edgeSecurityServiceCreation : Service created 🌎`);
    await main();

});

/**
 * 
 *  GET getGetSecurityService 🔒
 * 
 */
myEmitter.on('getGetSecurityService', async () => {

    console.log(`\n\n Getting security service for ${process.env.corpName} and siteShortName ${process.env.siteShortName}`);

    const securityServ = await getGetSecurityService(process.env.corpName, process.env.siteShortName).catch(handleAxiosError);

    if (!securityServ) {
        console.log("❌ Error getGetSecurityService");
        await main();
        return;
    }   

    if (securityServ.status === 200) console.log(`\n\n getGetSecurityService worked ✅ 🎉  \n\n ${JSON.stringify(securityServ.data,null, 2)} \n\n`);


    await main();

});

/*
 *
 * Mapping to the Fastly service 🔗 
 *
 */
myEmitter.on('mapEdgeSecurityServiceToFastly', async () => {

    const wantsToContinue = await askQuestion(`\nYou are about to mapEdgeSecurityServiceToFastly, for corpName : ${process.env.corpName}, siteShortName ${process.env.siteShortName} and fastlySID ${process.env.fastlySID} continue ? [Y/N] \n \n`);

    if (wantsToContinue && wantsToContinue.toLowerCase() === "n") await main();

    console.log(`\n\nThis can take up to 3 minutes, so do not panic; that's normal.`);

    let mapingResult;
    let statusCode;

    do {
        try {
            console.log(`\n\nStarting an attempt to map Edge Security Service to Fastly... please wait...`);
            mapingResult = await mapEdgeSecurityServiceToFastly(process.env.corpName, process.env.siteShortName, process.env.fastlySID);
            statusCode = mapingResult ? mapingResult.status : null;
        } catch (error) {
            if (error.response) {
                console.log(`Received status code ${error.response.status} - ${error.response.statusText}.\nRetrying in 3 seconds... Be patient ! 🙂`);
                await new Promise(resolve => setTimeout(resolve, 3000)); // Wait before retrying
            } else {
                console.error(`Error: ${error.message}. Retrying in 3 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 3000)); // Wait before retrying
            }
        }
    } while (statusCode !== 200);

    console.log(`\n\n mapEdgeSecurityServiceToFastly worked ✅ 🎉 \n\n`);
    console.log(mapingResult.data);
    //console.log("Good Bye 👋");
    //process.exit();

    await main();
});

/*
 *
 * editDictionary 📙
 *
 */
myEmitter.on('editDictionary', async () => { 

    const percentage = await askQuestion("Choose a percentage of traffic to send to the WAF, then hit enter : ");

    if(isNaN(parseInt(percentage))) throw new Error(`${percentage} is not a valid option`);

    if(parseInt(percentage) > 100 || parseInt(percentage) < 0 )  throw new Error(`${percentage} is not a valid option it must be between 0 and 100`);

    const latestVersion = await getLatestServiceVersion(process.env.fastlySID);

    if(!latestVersion) throw new Error(`We were unable to obtain the latest version of the service ID ${process.env.fastlySID} `);

    const EdgeSecurityDictionary = await getEdgeSecuriytDictionary(process.env.fastlySID, latestVersion);

    if(!EdgeSecurityDictionary.id) throw new Error(`We were unable to get the EdgeSecurityDictionary id `);

    const updateResult = await updateDictionaryItem(process.env.fastlySID,EdgeSecurityDictionary.id,"Enabled",percentage);
    
    if(parseInt(updateResult.item_value) !== parseInt(percentage) ) throw new Error(`We were unable to set the enabled value to ${percentage}`);

    console.log(updateResult);

    console.log(`🎉 we updated ${updateResult.dictionary_id} successfuly to ${updateResult.item_value}%`);

    await main();
    
});


myEmitter.on('addBotManagement', async () => {

    const wantsToContinue = await askQuestion(`\nYou are about to enableBotManagement, for corpName : ${process.env.corpName}, siteShortName ${process.env.siteShortName} and fastlySID ${process.env.fastlySID} continue ? [Y/N]`);

    if (wantsToContinue && wantsToContinue.toLowerCase() === "n") process.exit();

    console.log(`Enabling Bot Management....`);
    const enableBotManagementResponse = await enableBotManagement(process.env.corpName, process.env.siteShortName, process.env.fastlySID).catch(console.error);
    if (!enableBotManagementResponse) throw new Error('Unfortunetly the enableBotManagement failed');

    console.log(`\n\n enableBotManagement worked ✅ 🎉 \n\n`);
    console.log(enableBotManagementResponse.data);
    console.log("Good Bye 👋");
    process.exit();
});
/*
 *
 * detachEdgeDeploymentService 💥
 *
 */
myEmitter.on('detachEdgeDeploymentService', async () => {

    const wantsToContinue = await askQuestion(`\nYou are about to detachEdgeDeploymentService, for corpName : ${process.env.corpName}, siteShortName ${process.env.siteShortName} and fastlySID ${process.env.fastlySID} continue ? [Y/N]`);

    if (wantsToContinue && wantsToContinue.toLowerCase() === "n") process.exit();

    console.log(`Detaching EdgeDeploymentService....`);
    const detachResult = await detachEdgeDeploymentService(process.env.corpName, process.env.siteShortName, process.env.fastlySID).catch(handleAxiosError);
    if (!detachResult) throw new Error('Unfortunetly the detachEdgeDeploymentService failed');

    console.log(`\n\n detachEdgeDeploymentService worked ✅ 🎉 \n\n`);
    console.log(detachResult.data);
    console.log("Good Bye 👋");
    process.exit();

});

/*
 *
 * removeEdgeDeployment ❌
 *
 */
myEmitter.on('removeEdgeDeployment', async () => {

    const wantsToContinue = await askQuestion(`\nYou are about to removeEdgeDeployment, for corpName : ${process.env.corpName}, siteShortName ${process.env.siteShortName} and process.env.fastlySID ${process.env.fastlySID} continue ? [Y/N]`);

    if (wantsToContinue && wantsToContinue.toLowerCase() === "n") process.exit();

    console.log(`Removing the EdgeDeployment....`);

    const removeResult = await removeEdgeDeployment(process.env.corpName, process.env.siteShortName).catch(handleAxiosError);
    if (removeResult.status !== 204 && removeResult.status !== 200) throw new Error('Unfortunetly the removeEdgeDeployment failed');
    console.log(`\n\n removeEdgeDeployment worked ✅ 🎉 \n\n`);
    console.log(removeResult.data);


    console.log("Good Bye 👋");
    process.exit();

});

myEmitter.on('resyncBackends', async () => {

    const wantsToContinue = await askQuestion(`\nYou are about to resyncBackends, for corpName : ${process.env.corpName}, siteShortName ${process.env.siteShortName} and process.env.fastlySID ${process.env.fastlySID} continue ? [Y/N]`);

    if (wantsToContinue && wantsToContinue.toLowerCase() === "n") process.exit();

    console.log(`resyncing Backends...`);

    const resyncResult = await resyncBackends(process.env.corpName, process.env.siteShortName,process.env.fastlySID).catch(handleAxiosError);
    if (resyncResult.status !== 200) throw new Error('Unfortunetly the resyncResult failed');
    
    console.log(`\n\n resyncResult worked ✅ 🎉 \n\n`);
    console.log(resyncResult.data);

});