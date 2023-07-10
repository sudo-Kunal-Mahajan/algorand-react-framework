import algosdk from "algosdk";
import { algodClient } from "../utils/AlgorandUtils";
import {  useState } from "react";

const OptInAsset = ({ pubKey, HandleTrxSign, handleSetError,handleSetSuccess }) => {
    const [submitting, setSubmitting] = useState(false);
    const [assetId, setassetId] = useState(0);

    const handleassetId = (event) => {
        if(Number.isInteger(parseInt(event.target.value))){
            setassetId(parseInt(event.target.value))
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitting(true);

        algodClient.getAssetByID(assetId)
        .do()
        .then(()=>optInAssetUtil())
        .catch((error)=>{
            if (error && error.status === 404) {
                // Handle the 404 error here
                handleSetError(`Asset with ID ${assetId} does not exist.`);
              } else {
                // Handle other errors
                handleSetError(error.message)
              }
              event.preventDefault()
        })
        .finally(()=>setSubmitting(false))
    }

    
    const optInAssetUtil = async () => {
        const suggestedParams = await algodClient.getTransactionParams().do();
        const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: pubKey,
            to: pubKey,
            assetIndex: assetId,
            amount: 0,
            suggestedParams,
        });
        const signedTxn = HandleTrxSign(txn);
        await algodClient.sendRawTransaction(signedTxn.blob).do();
        await algosdk.waitForConfirmation(
            algodClient,
            txn.txID().toString(),
            3
        );
        handleSetSuccess(`Successfully opted in to asset ${assetId}`)
    }
    return (
        <>
        
        
            <form className="row row-cols-lg-auto align-items-center" onSubmit={handleSubmit}>
                <div className="col-8">
                    <input type="number" className="form-control" onChange={handleassetId} placeholder="Asset ID" required/>
                </div>
                <div className="col-4">
                    <button type="submit" className="btn btn-secondary" disabled={submitting}>{submitting? "Working..." : "Opt In"}</button>
                </div>
            </form>
        </>
        
    )

}
export default OptInAsset;