import algosdk from "algosdk";
import { algodClient } from "../utils/AlgorandUtils";
import { useEffect, useState, useRef } from "react";

const SendAlgo = ({ pub_key, HandleTrxSign, handleIsStale, maxAllowedSend }) => {
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ "recPub": "", "message": "", "amount": "" })
    const Warning_div = useRef(null);
    const TXID_div = useRef(null);
    const handleFormData = (event) => {
        const { name, value } = event.target
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        })
        )
    };
    const [txId, setTxId] = useState(null);
    const [warning, setWarning] = useState(false);
    const clearForm = () => {
        setFormData({ "recPub": "", "message": "", "amount": "" })
    }
    useEffect(() => {
        txId && TXID_div.current.scrollIntoView({ behavior: "smooth", block: 'center' });

        warning && Warning_div.current.scrollIntoView({ behavior: "smooth", block: 'center' });

        const timerId1 = setTimeout(() => {
            setTxId(null);
        }, 5000);
        const timerId2 = setTimeout(() => {
            setWarning(null);
        }, 5000);

        return () => {
            clearTimeout(timerId1);
            clearTimeout(timerId2);
        };
    }, [txId, warning])

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitting(true);
        if (maxAllowedSend <= (Math.round(formData.amount) * 1000000 + 1000)) {
            setWarning("Not Enough balance available!!!!")
            setSubmitting(false);
        } else {            
            sendAlogMainHandler()
        }
        

    }
    const sendAlogMainHandler = () => {

        const sendTransactionUtil = async (signedTxn) => {
            try {
                const txId = await algodClient.sendRawTransaction(signedTxn.blob).do();
                await algosdk.waitForConfirmation(algodClient, txId.txId, 4)
                setTxId(txId.txId);
                clearForm();
                handleIsStale();
            }
            catch (err) {
                console.log(err);
                setWarning(err.message);
            }finally{
                setSubmitting(false);
            }
        }
        const HandleTransaction = async () => {
            try{
                const params = await algodClient.getTransactionParams().do();
                const txn = {
                    from: pub_key,
                    to: formData.recPub,
                    fee: params.fee,
                    amount: Math.round(parseFloat(formData.amount) * 1000000),
                    firstRound: params.firstRound,
                    lastRound: params.lastRound,
                    genesisID: params.genesisID,
                    genesisHash: params.genesisHash,
                    note: algosdk.encodeObj(formData.message),
                };
                const signedTxn = HandleTrxSign(txn);
                await sendTransactionUtil(signedTxn)
            }catch(err){
                console.log(err);
                setWarning(err.message);
                setSubmitting(false);
            }
            
        }

        HandleTransaction();
    }
    return (
        <>
            {
                pub_key && (
                    <>
                        {warning && (
                            <div className="row justify-content-center" ref={Warning_div}>
                                <div className="col-xs-12 col-sm-6 alert alert-danger text-center" role="alert">
                                    <button className="btn-close float-end" onClick={() => setWarning(null)}></button>
                                    {warning}
                                </div>
                            </div>
                        )}

                        {txId && (
                            <div className="row justify-content-center" ref={TXID_div}>
                                <div className="col-xs-12 col-sm-6 alert alert-success text-center" role="alert">
                                    <button className="btn-close float-end" onClick={() => setTxId(null)}></button>
                                    Transaction Successful! {txId}
                                </div>
                            </div>
                        )}

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
                                <button type="submit" className={`btn ${submitting ? 'btn-secondary' : 'btn-primary'} col-4 mx-2`} disabled={submitting}>{submitting? "Please Wait...":"Submit"}</button>
                                <button type="button" onClick={clearForm} className="btn btn-warning col-4 mx-2">Clear</button>
                            </div>
                        </form>
                    </>
                )
            }
        </>
    )
}

export default SendAlgo;