# Fastly WAF @Edge deployment

This CLI tool streamlines the deployment and management of Fastly's Web Application Firewall (WAF) at the edge. It provides a simple interface to perform tasks such as creating edge security services, mapping them to Fastly, and managing deployments.


## Install and run

```
npx fastly-waf-edge-deployment
```



If you do not have a ```.env``` at ```/Users/<yourUser>/.Fastly-WAF-Edge-deployment/.env```


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

You can also provide the argument `--profile` with the name of an existing configuration to load it. Very useful if you jump from one account to another.

## Features 

```
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
    
Choose an option by inputing the number, then hit enter :    

```

## options 


```
--profile example
```

This will load the `example.env` file in `/Users/<yourUser>/.Fastly-WAF-Edge-deployment/`
