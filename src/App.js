import './App.css';
import React, { useState, useEffect } from 'react';
import GenerateNewAddress from './component/Generate_new_address';
import ImportAccount from './component/Import_account';
import SendAlgo from './component/sendAlgo';
import CreateASA from './component/CreateASA';
import NavMain from './component/NavBar';
import { api_base } from './utils/AlgorandUtils';

function App() {
  const [address, setAddress] = useState(null);
  const [currBalace, setCurrBalance] = useState(null);
  const handleAddressUpdate = (address) => {
    setAddress(address)
  }
  const handleCurrBalanceUpdate = (balance) => {
    setCurrBalance(balance)
  }

  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    console.log("called")
    if (address != null) {
      setisLoading(true)
      fetch(api_base + "/v2/accounts/" + address.addr, { headers: { 'Accept': 'application/json' } })
        .then(response => response.json())
        .then(jsonData => {
          handleCurrBalanceUpdate(jsonData["amount"])
          setisLoading(false)
        })
        .catch(error => {
          handleCurrBalanceUpdate(null)
          console.error('Error fetching data:', error);
          setisLoading(false)
        });
    }

  }, [address]);

  return (
    <>
      <NavMain address={address} handleAddressUpdate={handleAddressUpdate}/>
      <div className="card m-3">
        <div className='card-header'>
          <h3 className='text-center'>{address ? ("Welcome " + address.addr.slice(0, 5) + "...") : "Add Address"}</h3>
        </div>
        <div className='card-body'>          
          <ImportAccount address={address} handleAddressUpdate={handleAddressUpdate} />
          {address && (
            <>
              Your current balance is: {isLoading ? "Loading" : currBalace}
              <br />
              <SendAlgo pub_key={address.addr} sec_key={address.sk}/>
              <CreateASA pub_key={address.addr} sec_key={address.sk}/>
            </>
            )
            }

        </div>
      </div>

      
    </>
  );
}

export default App;
