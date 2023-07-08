import './App.css';
import React, { useState, useEffect } from 'react';
import SendAlgo from './component/sendAlgo';
import CreateASA from './component/CreateASA';
import NavMain from './component/NavBar';
import AssetDisplay from './component/AccountInfo';
import { algodClient } from './utils/AlgorandUtils';
import algosdk from 'algosdk';


function App() {
    const [accountInfo, setAccountInfo] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const [address, setAddress] = useState(null);

    const handleAddressUpdate = (address) => {
        localStorage.removeItem("address")
        localStorage.setItem("address", JSON.stringify(address))    
        setAddress(localStorage.getItem("address") ? JSON.parse(localStorage.getItem("address")) : null)
    }

    useEffect(() => {
        setAddress(localStorage.getItem("address") ? JSON.parse(localStorage.getItem("address")) : null)
    }, [])

    const welcomeAndGetBalance = () => {
        if (address) {
            return (
                <div className="d-flex align-items-center">
                    <h3>
                        {"Welcome " + address.addr.slice(0, 5) + "..."}
                    </h3>
                    <div className='ms-auto '>
                        <span>
                            Balance: <strong>{isLoading ? "Loading..." : + ((accountInfo ? accountInfo["amount"] : 0) / 1000000).toFixed(2) + " ALGO"}</strong>
                        </span>
                        <br />
                        <span>
                            Min Balance: {isLoading ? "Loading..." : + ((accountInfo ? accountInfo["min-balance"] : 0) / 1000000).toFixed(2) + " ALGO"}
                        </span>
                    </div>
                </div>
            )
        } else {
            return (<h3>Hey Stranger...</h3>)
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
                                            Private Key (Mnemonic): {address && address.mnemonic }
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



    useEffect(() => {
        if (address != null) {
            setisLoading(true)
            const fetchAssets = async () => {
                try {
                    const accountInfo = await algodClient.accountInformation(address.addr).do();
                    setAccountInfo(accountInfo["account"])
                    setisLoading(false)
                } catch (error) {
                    console.error('Error fetching assets:', error);
                    setisLoading(false)
                }
            }
            fetchAssets();
        }

    }, [address]);

    const AboutMe = () => {
        return (
            <div className='card-body bg-light '>
                <div className='card-title'>
                    Hey There!
                </div>
                <div className='card-text'>
                    <ul>
                        <li>Feel free to clone and tweak as needed.</li>
                        <li>Components are made using basic React and styled using Bootstrap Framework.</li>
                        <li>Instead of creating everything from start, you can just copy-paste most of them as required.</li>
                        <li>
                            <div className='d-flex'>
                                Reach out to me at:
                                <address>
                                    <a href="mailto:destinier.kunal34@gmail.com" className='text-decoration-none mx-2'>E-Mail</a>
                                    <a href="https://www.linkedin.com/in/kunal-mahajan-8592a3212" rel="noreferrer" target="_blank" className='text-decoration-none mx-2'>LinkedIn</a>
                                </address>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
    return (
        <>
            {viewKeyModal()}
            <NavMain address={address} handleAddressUpdate={handleAddressUpdate} viewKeyModalTrigger={viewKeyModalTrigger} />

            {address &&
                (
                    <div className="card m-3">
                        <div className='card-header'>
                            {welcomeAndGetBalance()}
                        </div>
                        <div className='card-body'>
                            {address && (
                                <>
                                    <ul className="nav nav-tabs" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <a className="nav-link active" data-bs-toggle="tab" aria-controls="AboutMe" href="#AboutMe">About</a>
                                        </li>

                                        <li className="nav-item" role="presentation">
                                            <a className="nav-link" data-bs-toggle="tab" aria-controls="collapseForYourAccount" href="#collapseForYourAccount">Your Account</a>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <a className="nav-link" data-bs-toggle="tab" aria-controls="collapseForSendAlgo" href="#collapseForSendAlgo">Send Algo</a>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <a className="nav-link disabled" data-bs-toggle="tab" aria-controls="collapseForCreateASA" href="#collapseForCreateASA">Create ASA</a>
                                        </li>
                                    </ul>
                                    <div className="tab-content mt-1 mb-2">
                                        <div role="tabpanel" className="tab-pane fade show active card" id="AboutMe">
                                            {AboutMe()}
                                        </div>

                                        <div role="tabpanel" className="card card-body bg-light tab-pane fade" id="collapseForYourAccount">
                                            <AssetDisplay publicAddress={address.addr} accountInfo={accountInfo} />
                                        </div>

                                        <div role="tabpanel" className="card card-body bg-light tab-pane fade" id="collapseForSendAlgo">
                                            <SendAlgo pub_key={address.addr} sec_key={algosdk.mnemonicToSecretKey(address.mnemonic).sk} maxAllowedSend={accountInfo && (accountInfo["amount"] - accountInfo["min-balance"])} />
                                        </div>

                                        <div role="tabpanel" className="card card-body bg-light tab-pane fade" id="collapseForCreateASA">
                                            <CreateASA pub_key={address.addr} sec_key={algosdk.mnemonicToSecretKey(address.mnemonic).sk} />
                                        </div>
                                    </div>
                                </>
                            )
                            }
                        </div>
                    </div>
                )

            }

            {!address && (
                <>
                    <h3 className='m-3'>Import or Generate New Account from the provided buttons on Navigation Bar</h3>
                    <div className='card m-3'>
                        {AboutMe()}
                    </div>
                </>
            )}

        </>
    );
}

export default App;
