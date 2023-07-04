import algosdk from "algosdk";
import { useState } from "react";


const ImportAccount = ({ address, handleAddressUpdate }) => {
    const [inputMnemonic, setinputMnemonic] = useState("")

    const handleMnemonicProvided = (event) => {
        if(event.target.value===""){
            return
        } else {
            setinputMnemonic(event.target.value);
        }
        
    };

    const handleSubmittedMnemonic = () => {
        const keypair = algosdk.mnemonicToSecretKey(inputMnemonic);
        handleAddressUpdate({ addr: keypair.addr, sk: algosdk.secretKeyToMnemonic(keypair.sk) });
    };
    return (
        <div>
            {
                !address && (
                    <div>
                        <input type="text" value={inputMnemonic} onChange={handleMnemonicProvided} />
                        <button onClick={handleSubmittedMnemonic}>Get Input Value</button>
                    </div>
                )
            }

        </div>
    );
};

export default ImportAccount;