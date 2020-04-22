# Delivery Driver App Demo 

A simple website that demonstrates [Amazon Chime proxy phone sessions](https://aws.amazon.com/about-aws/whats-new/2020/04/introducing-amazon-chime-proxy-phone-sessions)

##  Getting Started

### Prerequisites

* [AWS CLI](https://aws.amazon.com/cli/) - AWS Command Line Interface

### Installing

------------


#### **Step 1.** Clone this repository and install the dependancies
- Run the followning commands on the command line:

```bash
git clone https://github.com/aws-samples/delivery-driver-app-demo.git

cd delivery-driver-app-demo

npm install
```

------------

#### **Step 2.** Create an Amazon Chime Voice Connector

- Use the AWS CLI to create the Amazon Chime Voice Connector by using the following command:

```bash
aws chime create-voice-connector --name "DeliveryDriverAppDemo" --no-require-encryption
```

- Make note of the **VoiceConnectorId**.

- Configure the Amzon Chime Voice Connector Proxy Session by using the following command:

```bash
aws chime put-voice-connector-proxy --voice-connector-id <VoiceConnectorId> --default-session-expiry-minutes 15 --phone-number-pool-countries "US"
```

------------

#### **Step 3.** Install the Serveless Framework
  
To install the Serverless Framework run the following command:

```bash
npm install -g serverless
```

------------

#### **Step 4.** Configure the application 

Create a secrets.json file that conatins the following JSON:

```json
    {
		  "SERVICE":"delivery-driver-app-demo",
		  "NODE_ENV": "dev",
		  "JWT_SECRET":"Ch^ngeM3",
		  "VOICE_CONNECTOR_ID": "<VoiceConnectorId>",
		  "API_PREFIX":"/dev"
    }
```

- Change the **JWT_SECRET** to something random and different then `Ch^ngeM3`

- Change  **VOICE_CONNECTOR_ID** to the the ID of the Voice Connector you created in step #2


------------

#### **Step 5.** Deploy Application

- Export your AWS ACCESS KEY and SECERT KEY to your envoriment:

- On the command line type the following commands:

```bash
    export AWS_ACCESS_KEY_ID=<your-key-here>
    
    export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>
```

- On the command line deploy the project with the following command:

```bash
    npm run deploy
```

- You should see output similar to this:

```bash

    > delivery-driver-app-demo@1.0.0 deploy delivery-driver-app-demo
    > nuxt build  && sls deploy
    
    
     WARN  vendor has been deprecated due to webpack4 optimization                                          09:46:33
    
    ℹ Production build                                                                                      09:46:35
    ✔ Builder initialized                                                                                   09:46:35
    ✔ Nuxt files generated                                                                                  09:46:36
    
    ✔ Client
      Compiled successfully in 27.75s
    
    ✔ Server
      Compiled successfully in 5.59s
    .....................
    .....................
    .....................
    Serverless: Packaging service...
    Serverless: Excluding development dependencies...
    Serverless: Uploading CloudFormation file to S3...
    Serverless: Uploading artifacts...
    Serverless: Uploading service chime-proxy-demo.zip file to S3 (74.33 MB)...
    Serverless: Validating template...
    Serverless: Updating Stack...
    Serverless: Checking Stack update progress...
    ....................
    Serverless: Stack update finished...
    Service Information
    service: deliver-driver-app-demo
    stage: dev
    region: us-east-1
    stack: deliver-driver-app-demo-dev
    resources: 22
    api keys:
      None
    endpoints:
      ANY - https://qtg531o4i7.execute-api.us-east-1.amazonaws.com/dev
      ANY - https://qtg531o4i7.execute-api.us-east-1.amazonaws.com/dev/{proxy+}
      ANY - https://qtg531o4i7.execute-api.us-east-1.amazonaws.com/dev/api
      ANY - https://qtg531o4i7.execute-api.us-east-1.amazonaws.com/dev/api/{proxy+}
    functions:
      nuxt: delivery-driver-app-demo-dev-nuxt
      api: delivery-driver-app-demo-dev-api
    layers:
      None

```
Make note of the main URL from the above output.  It will look something like:

`https://qtg531o4i7.execute-api.us-east-1.amazonaws.com/dev`

Paste your URL in your browser and test!

## Built With

* [NuxtJS](https://nuxtjs.org/) - The ProgressiveVue.js Framework
* [Buefy](https://buefy.org/) - Lightweight UI components for Vue.js based on Bulma

## Authors

* **Marcello Federico**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
