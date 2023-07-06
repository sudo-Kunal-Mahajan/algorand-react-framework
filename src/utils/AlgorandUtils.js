import algosdk from "algosdk";

//const api_base = "https://mainnet-api.algonode.cloud/v2/accounts/"

export const api_base  = "https://testnet-api.algonode.cloud"
const algodToken = ''; // Replace with your Algod API token
const algodServer = api_base; // Replace with your Algorand node URL

// Create an Algod client
export const algodClient = new algosdk.Algodv2(algodToken, algodServer, 443);

