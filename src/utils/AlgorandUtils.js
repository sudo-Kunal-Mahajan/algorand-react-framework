import algosdk from "algosdk";




// #########################################################
//Uncomment the following for Algonode API


// export const api_base  = "https://testnet-api.algonode.cloud"
// const algodToken = ''; // Replace with your Algod API token
// const algodServer = api_base; // Replace with your Algorand node URL
// export const algodClient = new algosdk.Algodv2(algodToken, algodServer, 443);


// #########################################################


// Support for PureStake API
const baseServer = 'https://testnet-algorand.api.purestake.io/idx2'
const port = '';

const token = {
    'X-API-Key': process.env.REACT_APP_PURE_STAKE_API_KEY
}
console.log(process.env)
const algodclient = new algosdk.Algodv2(token, baseServer, port);
export const algodClient = algodclient;