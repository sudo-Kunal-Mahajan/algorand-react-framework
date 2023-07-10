import React, { useEffect } from 'react';
import { useState,useRef } from 'react';
import { algoIndexer } from '../utils/AlgorandUtils';
import OptInAsset from './OptIntoAssets';

const AssetDisplay = ({ pub_key, accountInfo, handleIsStale, HandleTrxSign }) => {
    const assets = accountInfo ? accountInfo.assets : [];
    const [isLoading, setIsLoading] = useState(false);
    const [transactions, setTransactions] = useState(null);
    const errorDivRef = useRef(null);
    const successDivRef = useRef(null);
    const [error,setError]  = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSetError= (error) =>{
        setError(error);
    }
    const handleSetSuccess = (success) =>{
        setSuccess(success);
        handleIsStale();
    }

    useEffect(() => {
        async function getTransactions() {
            setIsLoading(true);
            const transaction_info = await algoIndexer.lookupAccountTransactions(pub_key).do();
            setTransactions(transaction_info["transactions"]);
            setIsLoading(false);
        }
        getTransactions();
    }, [pub_key]);

    useEffect(() => {
        error && errorDivRef.current.scrollIntoView({ behavior: "smooth", block: 'center' });

        success && successDivRef.current.scrollIntoView({ behavior: "smooth", block: 'center' });

        const timerId1 = setTimeout(() => {
            setError(null);
        }, 5000);
        const timerId2 = setTimeout(() => {
            setSuccess(null);
        }, 5000);

        return () => {
            clearTimeout(timerId1);
            clearTimeout(timerId2);
        };
    }, [error, success])

    return (
        <>
            {error && (
                <div className="row justify-content-center mt-2 mb-2" ref={errorDivRef}>
                    <div className="col-xs-12 col-sm-6 alert alert-danger text-center" role="alert">
                        <button className="btn-close float-end" onClick={() => setError(null)}></button>
                        {error}
                    </div>
                </div>
            )}
            {success && (
                <div className="row justify-content-center mt-2 mb-2" ref={successDivRef}>
                    <div className="col-xs-12 col-sm-6 alert alert-success text-center" role="alert">
                        <button className="btn-close float-end" onClick={() => setSuccess(null)}></button>
                        {success}
                    </div>
                </div>
            )}
            <div className='card mt-3'>
                <div className='card-header d-flex flex-column flex-sm-row justify-content-between'>
                    <h4>Opted-In Assets</h4>
                    <OptInAsset pubKey={pub_key} HandleTrxSign={HandleTrxSign} handleSetError={handleSetError} handleSetSuccess={handleSetSuccess} />
                </div>
                <div className='card-body'>

                    {(assets && assets.length > 0) ? (
                        <div className='container-fluid table-responsive' >
                            <table className='table table-striped '>
                                <thead className='align-middle '>
                                    <tr>
                                        <th>Asset ID</th>
                                        <th>Name</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody className='align-middle'>
                                    {assets.map((asset) => {
                                        return (<tr key={asset["asset-id"]}>
                                            <td>{asset["asset-id"]}</td>
                                            <td></td>
                                            <td>{asset.amount}</td>
                                        </tr>)
                                    }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No assets found for this address.</p>
                    )}
                </div>
            </div>

            {(accountInfo && accountInfo["created-assets"] && accountInfo["created-assets"].length > 0) ? (
                <div className='card mt-3'>
                    <div className='card-header'>
                        <h4>Your Creations</h4>
                    </div>
                    <div className='card-body'>
                        <div className='container-fluid table-responsive'>
                            <table className='table table-striped '>
                                <thead className='align-middle '>
                                    <tr>
                                        <th>Asset ID</th>
                                        <th>Name</th>
                                        <th>Total</th>
                                        <th>Unit</th>
                                        <th>Frozen</th>
                                    </tr>
                                </thead>
                                <tbody className='align-middle'>
                                    {accountInfo["created-assets"].map((asset) => {
                                        return (<tr key={asset["index"]}>
                                            <td>{asset["index"]}</td>
                                            <td>{asset["params"]["name"]}</td>
                                            <td>{asset["params"]["total"]}</td>
                                            <td>{asset["params"]["unit-name"]}</td>
                                            <td>{asset["params"]["default-frozen"] ? "True" : "False"}</td>
                                        </tr>)
                                    }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : ""}
            <div className='card mt-3  '>
                <div className='card-header'>
                    <h4>Your Transactions</h4>
                </div>
                <div className='card-body'>
                    {isLoading ? <p>Loading...</p> : <>
                        {transactions && transactions.length > 0 ? (
                            //prevent the bootstrap table from going out of bounds
                            <div className='container-fluid table-responsive' style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                                <table className='table table-striped '>
                                    <thead className='align-middle '>
                                        <tr>
                                            <th>Type</th>
                                            <th>Transaction ID</th>
                                            <th>Amount</th>
                                            <th>Fee</th>
                                            <th>Sender</th>
                                            <th>Receiver</th>
                                        </tr>
                                    </thead>
                                    <tbody className='align-middle'>
                                        {transactions.map((transaction) => {
                                            if (transaction["tx-type"] === "pay")
                                                return (<tr key={transaction["id"]}>
                                                    <td>{transaction["tx-type"]}</td>
                                                    <td className='text-break'> {transaction["id"].slice(0, 10) + "..."}</td>
                                                    <td>{transaction["payment-transaction"]["amount"] / 1000000}</td>
                                                    <td> {transaction["fee"] / 1000000}</td>
                                                    <td className='text-break'> {transaction["sender"].slice(0, 10) + "..."}</td>
                                                    <td className='text-break'> {transaction["payment-transaction"]["receiver"].slice(0, 10) + "..."}</td>

                                                </tr>)
                                            else
                                                return (<tr key={transaction["id"]}>
                                                    <td>{transaction["tx-type"]}</td>
                                                    <td className='text-break'>{transaction["id"].slice(0, 10) + "..."}</td>
                                                    <td>NA</td>
                                                    <td> {transaction["fee"] / 1000000}</td>
                                                    <td className='text-break'> {transaction["sender"].slice(0, 10) + "..."}</td>
                                                    <td>NA</td>
                                                </tr>)
                                        }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>No transactions found for this address.</p>
                        )}</>
                    }
                </div>
            </div>

        </>
    );
}

export default AssetDisplay;