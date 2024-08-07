import { React, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import "./Loginpage.css";

function AdminAddChef() {
    const location = useLocation();
    const [chefData, setChefData] = useState({nama_koki: "", tanggal_diterima: "", status: "Aktif"});
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

    const updateChefData = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setChefData(values => ({...values, [name]: value}));
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

    const submitNewChefData = (e) => {
        e.preventDefault();
        if(chefData.nama_koki === ""
        || chefData.tanggal_diterima  === ""
        || chefData.status  === "") {
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
                    body: JSON.stringify(chefData),
                    mode: "cors"
                }
                fetch(backendUrl + "/addchefdata", payload)
                .then(res => res.json())
                .then(postResponse => setCustomStatusMessage({message: postResponse.msg, error: postResponse.success}));
            }
        }
    }

    const goToHome = (e) => {
        e.preventDefault();
        navigate("/admin_homepage", {state: {token: userToken, email: location.state.email, role: location.state.role}})
    }

    const goToChefList = (e) => {
        e.preventDefault();
        navigate("/admin_chef_list", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    return(
        <>
        <div className="headertext">TAMBAH DATA KOKI
            <button className="toprightnavbutton" onClick={goToHome} >MENU UTAMA</button>
            <button className="topleftnavbutton" onClick={goToChefList} >DATA KOKI</button>
        </div>
        <div className="secondarytext"></div>
        <br></br>
        <form onSubmit={submitNewChefData}>
            <table className="submitkittable">
                <tr>
                    <td>NAMA KOKI</td>
                    <td>
                    <input className="submitkitinput" type="text" name="nama_koki"
                    value={chefData.nama_koki} maxlength="64" onChange={(e) => updateChefData(e)} />
                    </td>
                </tr>
                <tr>
                    <td>TANGGAL DITERIMA</td>
                    <td><input className="submitkitinput" type="date" name="tanggal_diterima"
                    value={chefData.tanggal_diterima} onChange={(e) => updateChefData(e)} /></td>
                </tr>
                <tr>
                    <td>STATUS</td>
                    <td><select name="status" className="submitkitinput"
                        value={chefData.status} onChange={(e) => updateChefData(e)}>
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

export default AdminAddChef;