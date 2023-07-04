import './App.css';
import React, {  useState, useEffect } from 'react';
import GenerateNewAddress from './component/Generate_new_address';
import ImportAccount from './component/Import_account';


const api_base = "https://mainnet-api.algonode.cloud/v2/accounts/"
function App() {
  const [address, setAddress] = useState(null);
  const [currBalace, setCurrBalance] = useState(null);
  const handleAddressUpdate = (address) =>{
    setAddress(address)
  }
  const handleCurrBalanceUpdate =(balance)=>{
    setCurrBalance(balance)
  }

  const [isLoading, setisLoading] = useState(false);
  
  useEffect(() => {  
    if(address!=null){
      console.log(address)
      setisLoading(true)
      fetch(api_base + address.addr, { headers: { 'Accept': 'application/json' } })
      .then(response => response.json())
      .then(jsonData =>{
        handleCurrBalanceUpdate(jsonData["amount"])
          setisLoading(false)    
      })
      .catch(error => {
        handleCurrBalanceUpdate(null)
          console.error('Error fetching data:', error);
          setisLoading(false)
      });
    }    
      
  },[address]);

  return (
    <>

        <>
        <GenerateNewAddress address={address} handleAddressUpdate={handleAddressUpdate}/>
        <ImportAccount address={address} handleAddressUpdate={handleAddressUpdate}/>
        </>
      
      { address && (<>Your current balance is: {isLoading? "Loading": currBalace} </>)}
    </>
  );
}

export default App;
