import algosdk from "algosdk";
import { algodClient } from "../utils/AlgorandUtils";

const CreateASA = ({ pub_key, sec_key, to_user }) => {

    const createASAUtil = async () => {
        const suggestedParams = await algodClient.getTransactionParams().do();

        // Create the payment transaction from sender to algo receiver
        const paymentTxn = algosdk.makePaymentTxnWithSuggestedParams(
            pub_key,
            to_user,
            0.0001,
            undefined,
            undefined,
            suggestedParams
        );

        // Create the asset transfer transaction from sender to asset receiver
        const assetTxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
            senderAccount.addr,
            assetReceiver,
            undefined,
            undefined,
            1,
            undefined,
            assetID,
            suggestedParams
        );

        // Construct the group transaction
        const txnGroup = [paymentTxn, assetTxn];

        // Sign each transaction in the group
        const signedTxnGroup = txnGroup.map((txn) => txn.signTxn(senderAccount.sk));

        // Create the group transaction object
        const groupTxn = algosdk.assignGroupID(signedTxnGroup);

        // Convert the group transaction object to a byte array
        const encodedTxn = algosdk.encodeObj(groupTxn);

        // Send the transaction to the Algorand network
        const response = await algodClient.sendRawTransaction(encodedTxn).do();

        // Wait for confirmation
        await algodClient.waitForConfirmation(response.txId);

        console.log('Asset and Algo sent successfully');

    }
    return (
        <button onClick={createASAUtil}>Create ASA</button>
    )
}

export default CreateASA;