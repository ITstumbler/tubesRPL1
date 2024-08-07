import { React, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import "./Loginpage.css";

function AdminAddCashier() {
    const location = useLocation();
    const [cashierData, setCashierData] = useState({nama_kasir: "", tanggal_diterima: "", status: "Aktif"});
    //error 0 means use default error messages for password mismatch and passwords being under 6 characters long.
    //error 1 or 2 uses the message set in customStatusMessage. 1 displays red text and 2 displays green text.
    const [customStatusMessage, setCustomStatusMessage] = useState({message: "", error: 0});

    const navigate = useNavigate();

    useEffect(() => {
        if(location.state.role !== "administrator") navigate("/forbidden", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }, [location]);

    let errorMessage = " ";
    let errorMessageClass = "statusmessagered";
    let userToken = "";
    if(location.state.token && location.state.token) {
        userToken = location.state.token;
    }

    const updateCashierData = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setCashierData(values => ({...values, [name]: value}));
        customStatusMessage.error = 0
    };
    
    if(customStatusMessage.error === 0) {
        errorMessage = "";
        errorMessageClass = "statusmessagered";
    }

    else if(customStatusMessage.error === 1) {
        errorMessage = customStatusMessage.message;
        errorMessageClass = "statusmessagered";
    }
    else {
        errorMessage = customStatusMessage.message;
        errorMessageClass = "statusmessagegreen";
    }

    const submitNewCashierData = (e) => {
        e.preventDefault();
        if(cashierData.nama_kasir === ""
        || cashierData.tanggal_diterima  === ""
        || cashierData.status  === "") {
            setCustomStatusMessage({message: "Mohon mengisi semua kolom", error: 1});
        }
        else {
            if(userToken === "") {
                setCustomStatusMessage({message: "Harus login untuk menambahkan data", error: 1});
            }
            else {
                const payload = {
                    method: "POST",
                    headers: {"Content-Type": "application/json", "Authorization": userToken},
                    body: JSON.stringify(cashierData),
                    mode: "cors"
                }
                fetch(backendUrl + "/addcashierdata", payload)
                .then(res => res.json())
                .then(postResponse => setCustomStatusMessage({message: postResponse.msg, error: postResponse.success}));
            }
        }
    }

    const goToHome = (e) => {
        e.preventDefault();
        navigate("/admin_homepage", {state: {token: userToken, email: location.state.email, role: location.state.role}})
    }

    const goToCashierList = (e) => {
        e.preventDefault();
        navigate("/admin_cashier_list", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    return(
        <>
        <div className="headertext">TAMBAH DATA KASIR
            <button className="toprightnavbutton" onClick={goToHome} >MENU UTAMA</button>
            <button className="topleftnavbutton" onClick={goToCashierList} >DATA KASIR</button>
        </div>
        <div className="secondarytext"></div>
        <br></br>
        <form onSubmit={submitNewCashierData}>
            <table className="submitkittable">
                <tr>
                    <td>NAMA KASIR</td>
                    <td>
                    <input className="submitkitinput" type="text" name="nama_kasir"
                    value={cashierData.nama_kasir} maxlength="64" onChange={(e) => updateCashierData(e)} />
                    </td>
                </tr>
                <tr>
                    <td>TANGGAL DITERIMA</td>
                    <td><input className="submitkitinput" type="date" name="tanggal_diterima"
                    value={cashierData.tanggal_diterima} onChange={(e) => updateCashierData(e)} /></td>
                </tr>
                <tr>
                    <td>STATUS</td>
                    <td><select name="status" className="submitkitinput"
                        value={cashierData.status} onChange={(e) => updateCashierData(e)}>
                            <option value="Aktif">Aktif</option>
                            <option value="Tidak Aktif">Tidak Aktif</option>
                        </select></td>
                </tr>
                <tr>
                    <td colspan="2">
                        <div className={errorMessageClass}>{errorMessage}</div>
                        <input className="submitkitbutton" type="submit" value="TAMBAH" />
                    </td>
                </tr>
            </table>
        </form>
        </>
    );
}

export default AdminAddCashier;