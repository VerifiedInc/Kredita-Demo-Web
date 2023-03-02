# Kredita Web Demo

## Overview
> This project acts as a simple web application for a fictional customer, Kredita, which accepts UnumID [credentials](https://docs.unumid.co/terminology#credential) issued by Hooli.

The Kredita Web Demo is implemented using the [Remix](https://remix.run/docs) full stack web framework. Additional information about the Unum ID demo ecosystem can be found in our [documentation](https://docs.unumid.co/kredita-demo).

### Remix

While knowledge of the Remix framework is not fully required to observe and understand the simplicity of the Unum ID reusable credential implementation it is worth noting that Remix has a notion of "middleware" that serves as a lightweight backend, which takes the form an express server.

Because of this characteristic, even though this is a client side app, not all of the software in this repo is executed in the browser. The files with the naming convention `.server.` denote that they are executed on the express server. This is an important distinction because your Unum ID API Key used to authenticate needs to be kept secret and can only be used in a secure backend environment. **TL;DR, Please do not call the Unum ID API directly from client side code that is executed in the browser because the API key is sensitive.**

## Interacting with the Demo

The live web app can be found [here](https://kredita-web.demo.sandbox-unumid.co).

## Development

### Getting Started

Install necessary dependencies

```sh
npm install
```

Make a clone of the `.env.example` file and save as `.env` in the demo's root directory. There are a few items worth noting for setting up the `.env`.
* `PORT` can be updated to whichever port you'd prefer the demo to run on locally. If the value of `PORT` is changed, you will also need to change the port specified in the `DEMO_URL`.
* `UNUM_API_KEY` needs to be populated with the API key you've been provided.
* `CORE_SERVICE_URL` and `UNUM_WALLET_URL` are defaulted to the Unum ID Core Service API and Web Wallet in our sandbox environment.

### Running

Start the Remix development asset server and the Express server by running:

```sh
npm run dev
```

_Note: The demo will launch on the specified `PORT` in the `.env` file._
