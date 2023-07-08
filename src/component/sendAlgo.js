import algosdk from "algosdk";
import { algodClient } from "../utils/AlgorandUtils";
import { useState } from "react";

const SendAlgo = ({ pub_key, sec_key, maxAllowedSend }) => {
    const [formData, setFormData] = useState({ "recPub": "", "message": "", "amount": "" })
    const handleFormData = (event) => {
        const { name, value } = event.target
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        })
        )
    };
    const clearForm = () => {
        setFormData({ "recPub": "", "message": "", "amount": "" })
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (maxAllowedSend < (formData.amount * 100000 + 1000)) {
            alert("Not Enough balance available!!!!")
            return
        } else {
            sendAlgoUtil().then((result) => {
                if (result !== -1) {
                    alert("Transaction Successful!!! " + result)
                    clearForm();
                }
            })
        }

    }

    const sendAlgoUtil = async () => {

        try {
            const params = await algodClient.getTransactionParams().do();
            const txn = {
                from: pub_key,
                to: formData.recPub,
                fee: params.fee,
                amount: parseFloat(formData.amount) * 1000000,
                firstRound: params.firstRound,
                lastRound: params.lastRound,
                genesisID: params.genesisID,
                genesisHash: params.genesisHash,
                note: algosdk.encodeObj(formData.message),
            };
            console.log(txn)
            const signedTxn = algosdk.signTransaction(txn, sec_key);
            // Submit the transaction
            const txId = await algodClient.sendRawTransaction(signedTxn.blob).do();
            console.log('Transaction successful! Transaction ID:', txId);
            return txId;
        } catch (error) {
            console.log('An error occurred:', error);
            alert("An error occurred: " + error);
            return -1;
        }

    }
    return (
        <>
            {
                pub_key && (
                    <form onSubmit={handleSubmit} className="form p-3">
                        <div className="mb-3">
                            <label htmlFor="recPub" className="form-label">Receiver Address</label>
                            <input type="text" name="recPub" className="form-control" id="recPub" value={formData.recPub} onChange={handleFormData} required />
                        </div>
                        <div className="mb-3 ">
                            <label htmlFor="amount" className="form-label">Amount (in algo)</label>
                            <input type="number" className="form-control" name="amount" id="amount" value={formData.amount} onChange={handleFormData} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="messageInput" className="form-label">Optional Note</label>
                            <textarea className="form-control" name="message" id="messageInput" rows="3" value={formData.message} onChange={handleFormData}></textarea>
                        </div>
                        <div className="mb-3 row justify-content-center">
                            <button type="submit" className="btn btn-primary col-4 mx-2">Submit</button>
                            <button type="button" onClick={clearForm} className="btn btn-warning col-4 mx-2">Clear</button>
                        </div>
                    </form>
                )
            }
        </>
    )
}

export default SendAlgo;