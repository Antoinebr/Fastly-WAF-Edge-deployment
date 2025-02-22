# Fastly WAF @Edge deployement

This CLI tool streamlines the deployment and management of Fastly's Web Application Firewall (WAF) at the edge. It provides a simple interface to perform tasks such as creating edge security services, mapping them to Fastly, and managing deployments.


## Install 

```
npx fastly-waf-edge-deployement
```


## Run 

```
npm run cli
```

If you do not have a ```.env``` at ```  /Users/<yourUser>/.Fastly-WAF-Edge-deployement/.env  ```


```.env``` example : 
```
SIGSCI_EMAIL="yourEmail@provider.com"
SIGSCI_TOKEN="YOUR_SIGSCI_TOKEN_HERE"
FASTLY_KEY="YOUR_SIGSCI_API_KEY_HERE"


corpName = "your_corp_name_here"
siteShortName = "your_site_short_name_here"
fastlySID = "your_fastly_service_id_here"
```

The cli will prompt you the infos to create one.

```
    -----------------------------------------------------
    Menu
    -----------------------------------------------------

    🌎 : Create an Edge Security Service - [1]

    🔒 : Get and verify the creation of the Edge Security Service - [2]

    🔗 : Map the Edge Security Service to the Fastly CDN Service - [3]

    💯 : Set the percentage of traffic to be analyzed by the WAF  - [4]

    💥 : detach Edge nDeployment Service - [5]

    ❌ : remove Edge Deployment - [6]

    -----------------------------------------------------
    
Choose an option by inputing the number, then hit enter :    

```

