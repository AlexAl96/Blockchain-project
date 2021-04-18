---
title: Things You Need
slug: /
---
Before we get to know the functions of PEER, you need to download a few things beforehand if you don't have them and integrate the project

## Step 1: Install the following requirements:

- Ganache CLI v6.12.2 (ganache-core: 2.13.2)
- Node v14.15.3
- Angular 9
- Npm v7.6.2
- Truffle v5.2.6

## Step 2: Add meta mask to browser

If you do not yet use Metamask, please download Metamask and create an account first: https://metamask.io/

Here you can find a short video about what Metamask is used for:
<iframe width="560" height="315" src="https://www.youtube.com/embed/YVgfHZMFFFQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Step 3: Start a local blockchain with ganache cli:

```shell
ganache-cli -l 800000000 -d 100000000 –allowUnlimitedContractSize
```

Please be careful. Blockchain should run on port 8545, otherwise adapt port in angular-peer/truffle/truffle-config.js

## Step 4: Open a new terminal and clone Git-Repository

- Clone git repository and migrate smart contracts
```shell
git clone https://git.scc.kit.edu/undys/angular-peer.git
```

- Cd into the truffle folder:
```shell
cd angular-peer/truffle
```
```shell
truffle migrate --network development --reset
```

## Step 5: Open a new terminal again and start the angular app

- Install packages and start the frontend: 
```shell
npm install
```
```shell
npm start
```
## Step 6: Connect app to metamask

- Open the angular app in your browser under http://localhost:4200/
- On the first start metamask should open following image:

![Metamask](/img/metamask.png)
- Click on ‘Mit Hilfe der Seed-Wörterreihenfolge wiederherstellen‘
- Scroll to the top of the terminal window where you started ganache-cli. There you will find a Mnemonic. Copy it and paste it into the Wallet Seed field in meta mask. Define a new password.
- Select Localhost8545 as network and connect your account to the angular app

## Step 7: Open the development tool (F12 in Chrome) and look if there are any errors

- If you run into this (Returned values aren’t valid):
  
  ![Error](/img/error.png)

- The network id of your Abi file doesn’t match the one in your environment.
- Delete all your json files inside /angular-peer/truffle/build/contracts/
- Migrate your contracts again in a terminal in the truffle directory with:
```shell
truffle migrate --network development --reset 
```
- Navigate to /angular-peer/truffle/build/contracts/Controller.json and search for “networks”. Copy the number inside the networks object, for example “1618774824138”
  ![Example](/img/example.png)
  
- If there are multiple numbers, take the latest.
- Past the number to your networkId inside your environment.ts. You can find the file inside /angular-peer/src/environments/environment.ts
- Refresh your angular app and everything should work as expected