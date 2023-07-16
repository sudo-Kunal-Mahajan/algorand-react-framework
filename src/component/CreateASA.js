import algosdk from "algosdk";
import React, { useEffect, useState } from "react";
import { algodClient } from "../utils/AlgorandUtils";

const CreateASA = ({ pub_key, HandleTrxSign }) => {
    const [isCreating, setIsCreating] = useState(false)
    const error_div = React.useRef(null);
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        "assetName": undefined, "unitName": undefined, "total": "", "clawback": undefined, "freeze": undefined, "manager": pub_key, "assetURL": undefined, "decimals": 0, "defaultFrozen": "false",
    })
    const handleFormData = (event) => {

        const { name, value } = event.target
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: String(value)
        })
        )

    };
    useEffect(() => {
        //disable error popup after 5 seconds
        error && error_div.current.scrollIntoView({ behavior: "smooth", block: 'center' });
        setIsCreating(false);
        const timerId = setTimeout(() => {
            setError(null);
        }, 5000);
        return () => {
            clearTimeout(timerId);
        };
    }, [error])

    const createASAUtil = async () => {
        try {

            const suggestedParams = await algodClient.getTransactionParams().do();
            const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
                from: pub_key,
                suggestedParams,
                defaultFrozen: formData.defaultFrozen === "true" ? true : false,
                unitName: formData.unitName,
                assetName: formData.assetName,
                manager: formData.manager,
                freeze: formData.freeze,
                clawback: formData.clawback,
                assetURL: formData.assetURL,
                total: Number(formData.total),
                decimals: Number(formData.decimals)
            });

            const signedTxn = HandleTrxSign(txn);
            await algodClient.sendRawTransaction(signedTxn.blob).do();
            const result = await algosdk.waitForConfirmation(
                algodClient,
                txn.txID().toString(),
                3
            );
            console.log(result)
            const assetIndex = result['asset-index'];
            alert(`Asset ID created: ${assetIndex}`);
        } catch (error) {
            console.log(error);

            if ((error.toString()).includes("overspend")) {
                setError("You don't have enough balance to create an ASA.")
            } else {
                setError(error.message)
            }
        } finally{
            setIsCreating(false);
        }

    }

    const handleSubmit = (event) => {
        setIsCreating(true);
        event.preventDefault();
        if (formData.manager !== undefined && !algosdk.isValidAddress(formData.manager)) {
            setError("Invalid Manager Address")
            return
        }
        if (formData.freeze !== undefined && !algosdk.isValidAddress(formData.freeze)) {
            setError("Invalid Freeze Address")
            return
        }
        if (formData.clawback !== undefined && !algosdk.isValidAddress(formData.clawback)) {
            setError("Invalid Clawback Address")
            return
        }
        if (formData.total <= 0) {
            setError("Total Supply must be greater than 0")
            return
        }
        if (formData.decimals < 0 || formData.decimals > 19) {
            setError("Decimals must be between 0 and 19")
            return
        }

        createASAUtil()
       
    }
    return (
        <>
            {error && (
                <div className="row justify-content-center" ref={error_div}>
                    <div className="col-xs-12 col-sm-6 alert alert-danger text-center" role="alert">
                        <button className="btn-close float-end" onClick={() => setError(null)}></button>
                        {error}
                    </div>
                </div>
            )}
            <div className="row">
                <div className="col text-danger">
                    *Required Fields
                </div>
            </div>
            <form onSubmit={handleSubmit} className="form p-3">
                <div className="row mb-4">
                    <label htmlFor="assetName" className="col-sm-2 col-form-label">Asset Name</label>
                    <div className="col-sm-10">
                        <input type="text" maxLength={31} name="assetName" className="form-control" id="assetName" value={formData.assetName} onChange={handleFormData} />
                    </div>
                </div>
                <div className="row mb-4">
                    <label htmlFor="unitName" className="col-sm-2 col-form-label">Unit Name</label>
                    <div className="col-sm-10">
                        <input type="text" maxLength={8} name="unitName" className="form-control" id="unitName" value={formData.unitName} onChange={handleFormData} />
                    </div>
                </div>
                <div className="row mb-4">
                    <label htmlFor="total" className="col-sm-2 col-form-label">Total Supply <span className="text-danger fw-bold">*</span></label>
                    <div className="col-sm-10">
                        <input type="number" name="total" className="form-control" id="total" value={formData.total} onChange={handleFormData} required />
                    </div>


                </div>
                <div className="row mb-4">
                    <label htmlFor="decimals" className="col-sm-2 col-form-label">Decimals <span className="text-danger fw-bold">*</span></label>
                    <div className="col-sm-10">
                        <input type="number" name="decimals" className="form-control" id="decimals" value={formData.decimals} onChange={handleFormData} required />
                    </div>


                </div>
                <fieldset class="row mb-3">
                    <legend class="col-form-label col-sm-2 pt-0">
                        Default Frozen? <span className="text-danger fw-bold">*</span><br />
                        <small className="text-muted"> (Cannot be changed later)</small>
                    </legend>
                    <div className="col-sm-10">
                        <div className="form-check form-check-inline ">
                            <input className="form-check-input" type="radio" id="defaultFrozenTrue" name="defaultFrozen" value="true" onChange={handleFormData} checked={formData.defaultFrozen === "true"} required />
                            <label className="form-check-label" htmlFor="defaultFrozenTrue">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" id="defaultFrozenFalse" name="defaultFrozen" value="false" onChange={handleFormData} checked={formData.defaultFrozen === "false"} />
                            <label className="form-check-label" htmlFor="defaultFrozenFalse"> No</label>
                        </div>
                    </div>
                </fieldset>
                <div className="row mb-4">
                    <label htmlFor="assetURL" className="col-sm-2 col-form-label">Asset URL</label>
                    <div className="col-sm-10">
                        <input type="url" name="assetURL" className="form-control" id="assetURL" value={formData.assetURL} onChange={handleFormData} />
                    </div>
                </div>
                <div className="row mb-4">
                    <label htmlFor="manager" className="col-sm-2 col-form-label">Manager Address</label>
                    <div className="col-sm-10">
                        <input type="text" name="manager" maxLength={58} className="form-control" id="manager" value={formData.manager} onChange={handleFormData} required />
                    </div>
                </div>
                <div className="row mb-4">
                    <label htmlFor="freeze" className="col-sm-2 col-form-label">Freeze Address</label>
                    <div className="col-sm-10">
                        <input type="text" name="freeze" maxLength={58} className="form-control" id="freeze" value={formData.freeze} onChange={handleFormData} placeholder="Leave Empty if freezing is not permitted" />
                    </div>
                </div>
                <div className="row mb-4">
                    <label htmlFor="clawback" className="col-sm-2 col-form-label">Clawback Address</label>
                    <div className="col-sm-10">
                        <input type="text" name="clawback" maxLength={58} className="form-control" id="clawback" value={formData.clawback} onChange={handleFormData} placeholder="Leave Empty if no clawback allowed" />
                    </div>
                </div>
                <div className="row mb-4 justify-content-center">
                        <button className="col-xs-12 col-sm-6 col-md-3  btn btn-primary" disabled={isCreating}>Create ASA</button>
                </div>
                
            </form>

        </>

    )
}

export default CreateASA;