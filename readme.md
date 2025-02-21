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

    🌎 : edgeSecurityServiceCreation - [1]

    🔒 : getGetSecurityService - [2]

    🔗 : mapEdgeSecurityServiceToFastly - [3]

    💥 : detachEdgeDeploymentService - [4]

    ❌ : removeEdgeDeployment - [5]

    -----------------------------------------------------
    
Choose an option by inputing the number, then hit enter :    


```

