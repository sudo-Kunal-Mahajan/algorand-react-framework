import algosdk from "algosdk";
const showConfirmation = () => {
  const result = window.confirm('Do you want to proceed?');
  console.log(result)
  return result;
};
const GenerateNewAddress = ({address, handleAddressUpdate}) => {
    const generateAddress = () => {
      const account = algosdk.generateAccount();
      handleAddressUpdate({ addr: account.addr, sk: algosdk.secretKeyToMnemonic(account.sk) });
    };
    const handleconfirmation = ()=>{
      const result = showConfirmation();
      return result? generateAddress() :null
    }
    return (
      <div>
        {
          !address && (
            <button onClick={generateAddress}>Generate Address</button>
          )
        }
        
        {address && (
          <div>
            <div>Address: {address.addr}</div>
            <div>Secret Key: {address.sk}</div>
  
            <button onClick={handleconfirmation}>Generate New</button>
          </div>
          
        )}
      </div>
    );
  };
  
export default GenerateNewAddress;