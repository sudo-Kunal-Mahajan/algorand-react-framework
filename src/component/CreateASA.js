import algosdk from "algosdk";
import { algodClient } from "../utils/AlgorandUtils";

const CreateASA = ({ pub_key, HandleTrxSign}) => {
    
    const createASAUtil = async () => {
        const suggestedParams = await algodClient.getTransactionParams().do();
        const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: pub_key,
        suggestedParams,
        defaultFrozen: false,
        unitName: 'rug',
        assetName: 'Testing 69420',
        manager: pub_key,
        reserve: undefined,
        freeze: undefined,
        clawback: undefined,
        assetURL: '',
        total: 1000000,
        decimals: 0,
        });

        const signedTxn = HandleTrxSign(txn);
        await algodClient.sendRawTransaction(signedTxn.blob).do();
        const result = await algosdk.waitForConfirmation(
        algodClient,
        txn.txID().toString(),
        3
        );

        const assetIndex = result['asset-index'];
        console.log(`Asset ID created: ${assetIndex}`);
    }
    return (
    <button onClick={createASAUtil}>Create ASA</button>
    )
}

export default CreateASA;