# Document Verification Dapp

This is an Ethereum Dapp for document verification. The dapp suppports three actors - owner, verifier and checker.
Owner is the owner of the document. Owner can submit verification document verification requests to verifier.
The documents itself are not stored on the network, only document hashes.
Verfier verifies if the document submitted is correct and can mark it as 'VERIFIED'.
Checker is assumed to be a third party who can check whether the document belongs to a particular owner or its correctness.  

## Contract
At the heart of this is a solidity contract for to achieve communication with ethereum. 

## Environment
I have used VSCode to build the app. Truffle/Web3 provides interface to ethereum interaction.
Angular is used to build a functional front end.

## Run Local
Bring up ganache. 
Deploy contract to network with truffle migrate.
Run the app with npm start.

## Usage
The app is available at http://localhost:4200
The app expects a browser wallet plugin like Metamask to be avaibale and connected to your ethereum account.
