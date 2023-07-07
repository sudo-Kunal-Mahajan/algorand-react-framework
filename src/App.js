import './App.css';
import React, { useState, useEffect } from 'react';
import ImportAccount from './component/Import_account';
import SendAlgo from './component/sendAlgo';
import CreateASA from './component/CreateASA';
import NavMain from './component/NavBar';

import { api_base } from './utils/AlgorandUtils';
import algosdk from 'algosdk';


function App() {
    const [address, setAddress] = useState(null);
    const [currBalace, setCurrBalance] = useState(null);

    const handleAddressUpdate = (address) => {
        setAddress(address)
    }
    const handleCurrBalanceUpdate = (balance) => {
        setCurrBalance(balance)
    }

    const welcomeAndGetBalance = () => {
        if (address) {
            return (
                <div className="d-flex align-items-center">
                    <h3>
                        {"Welcome " + address.addr.slice(0, 5) + "..."}
                    </h3>
                    <span className='ms-auto fw-bold'>Balance: <strong>{isLoading ? "Loading..." : + (currBalace / 1000000).toFixed(2) + " ALGO"}</strong> </span>
                </div>
            )
        } else {
            return (<h3>Add your seed here...</h3>)
        }
    }

    const viewKeyModal = () => {
        return (
            <>
                <div className="modal fade" id="viewKeyModalMain" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="viewKeyModalMainLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="viewKeyModalMainLabel">Your Current Keys</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className='container-fluid'>
                                    <div className='row'>
                                        <div className='col-12'>
                                            Public Key: {address && address.addr}
                                        </div>
                                    </div>
                                    <br />
                                    <div className='row'>
                                        <div className='col-12'>
                                            Private Key (Mnemonic): {address && algosdk.secretKeyToMnemonic(address.sk)}
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-success" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const viewKeyModalTrigger = () => {
        return (<button type="button" className="dropdown-item" data-bs-toggle="modal" data-bs-target="#viewKeyModalMain">View Keys</button>)
    }
    const [isLoading, setisLoading] = useState(false);

    useEffect(() => {
        if (address != null) {
            setisLoading(true)
            fetch(api_base + "/v2/accounts/" + address.addr, { headers: { 'Accept': 'application/json' } })
                .then(response => response.json())
                .then(jsonData => {
                    handleCurrBalanceUpdate(jsonData["amount"])
                    setisLoading(false)
                })
                .catch(error => {
                    handleCurrBalanceUpdate(0)
                    console.error('Error fetching data:', error);
                    setisLoading(false)
                });
        }

    }, [address]);


    return (
        <>
            {viewKeyModal()}
            <NavMain address={address} handleAddressUpdate={handleAddressUpdate} viewKeyModalTrigger={viewKeyModalTrigger} />
            <div className="card m-3">
                <div className='card-header'>
                    {welcomeAndGetBalance()}
                </div>
                <div className='card-body'>
                    <ImportAccount address={address} handleAddressUpdate={handleAddressUpdate} />
                    {address && (
                        <>
                            <p>
                                <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseForSendAlgo" aria-expanded="false" aria-controls="collapseForSendAlgo">
                                    Send ALGO
                                </button>
                                <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseForCreateASA" aria-expanded="false" aria-controls="collapseForCreateASA">
                                    Send ALGO
                                </button>
                            </p>
                            <div class="collapse" id="collapseForSendAlgo">
                                <div class="card card-body">
                                     <SendAlgo pub_key={address.addr} sec_key={address.sk} />
                                </div>
                            </div>
                            <div class="collapse" id="collapseForCreateASA">
                                <div class="card card-body">
                                    <CreateASA pub_key={address.addr} sec_key={address.sk} />
                                </div>
                            </div>
                            <br />
                            
                            
                        </>
                    )
                    }

                </div>
            </div>


        </>
    );
}

export default App;
