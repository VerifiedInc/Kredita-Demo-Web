# Kredita Web Demo

## Overview

> This project acts as a simple web application for a fictional customer, Kredita, which accepts UnumID [credentials](https://docs.verified.inc/terminology#credential) issued by Hooli.

The Kredita Web Demo is implemented using the [Remix](https://remix.run/docs) full stack web framework. Additional information about the Unum ID demo ecosystem can be found in our [documentation](https://docs.verified.inc/kredita-demo).

### Remix

While knowledge of the Remix framework is not fully required to observe and understand the simplicity of the Unum ID reusable credential implementation it is worth noting that Remix has a notion of "middleware" that serves as a lightweight backend, which takes the form an express server.

Because of this characteristic, even though this is a client side app, not all of the software in this repo is executed in the browser. The files with the naming convention `.server.` denote that they are executed on the express server. This is an important distinction because your Unum ID API Key used to authenticate needs to be kept secret and can only be used in a secure backend environment. **TL;DR, Please do not call the Unum ID API directly from client side code that is executed in the browser because the API key is sensitive.**

## Interacting with the Demo

The live web app can be found [here](https://kredita-web.demo.sandbox-verifiedinc.com).

The application's home page is a sample registration page. In order to "register", you will need to enter in the provided test email address (richard@piedpiper.net) and phone number (+10123456789). If you prefer, you may instead enter your own email address and/or phone number. For example, if you used your email address to issue credentials with the Hooli demo, that email (and the corresponding issued credentials) can be used here to register with Kredita. Ensure the value(s) you enter are valid as a OTP will be required at a later step.

After you (the test user) click 'Register', the following occurs for Kredita to leverage your existing credentials.

1. A `POST` request is made to [/hasMatchingCredentials](https://kredita-web.demo.sandbox-verifiedinc.com).
2. A match for the requested credentials is found and you are redirected to the Unum ID Web Wallet to complete the share credentials request flow.
3. After you elect to share your credentials, the Unum ID Web Wallet redirects back to the Kredita demo with a `sharedCredentialsUuid` query parameter.
4. The `sharedCredentialsUuid` is used by Kredita in a `GET` request made to [/sharedCredentials/{uuid}](https://docs.verified.inc/api-overview#get-shared-credentials). This gives Kredita access to the credentials, and a user session is created. _Note: A brand's access to shared credentials is deleted after 5 minutes of the initial credential data retrieval._

Functionality for the critical api calls can be found in the [coreAPI.server.ts](https://github.com/UnumID/Kredita-Demo-Web/blob/main/app/coreAPI.server.ts) file. Both `hasMatchingCredentials` and `sharedCredentialsUuid` are called in the [register.tsx](https://github.com/UnumID/Kredita-Demo-Web/blob/main/app/routes/register.tsx) file.

## Development

### Getting Started

Install necessary dependencies

```sh
npm install
```

Make a clone of the `.env.example` file and save as `.env` in the demo's root directory. There are a few items worth noting for setting up the `.env`.

- `PORT` can be updated to whichever port you'd prefer the demo to run on locally. If the value of `PORT` is changed, you will also need to change the port specified in the `DEMO_URL`.
- `VERIFIED_API_KEY` needs to be populated with the API key you've been provided.
- `CORE_SERVICE_URL` and `VERIFIED_WALLET_URL` are defaulted to the Unum ID Core Service API and Web Wallet in our sandbox environment.
- `CORE_SERVICE_ADMIN_AUTH_KEY` is an Verified Inc Only, internal environment key which is used to allow custom branding and brand API Key fetching. This can be ignored for reference purposes.

### Running

Start the Remix development asset server and the Express server by running:

```sh
npm run dev
```

_Note: The demo will launch on the specified `PORT` in the `.env` file._
