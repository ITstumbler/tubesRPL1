import { React, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import "./Loginpage.css";

function ChefEditMenu() {
    const location = useLocation();
    const [menuData, setMenuData] = useState({nama_menu: "", harga: "", status_ketersediaan: "Tersedia"});
    //error 0 means use default error messages for password mismatch and passwords being under 6 characters long.
    //error 1 or 2 uses the message set in customStatusMessage. 1 displays red text and 2 displays green text.
    const [customStatusMessage, setCustomStatusMessage] = useState({message: "", error: 0});

    const navigate = useNavigate();

    useEffect(() => {
        if(location.state.role !== "koki") navigate("/forbidden", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
        if(!location.state.id_menu) navigate("/chef_menu_list", {state: {token: location.state.token, email: location.state.email, role: location.state.role}});
        fetch(backendUrl + `/viewentry?id=`+location.state.id_menu)
        .then(res => res.json())
        .then(jsondata => {setMenuData(jsondata)});
    }, [location]);

    let errorMessage = " ";
    let errorMessageClass = "statusmessagered";
    let userToken = "";
    if(location.state.token && location.state.token) {
        userToken = location.state.token;
    }

    const updateMenuData = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setMenuData(values => ({...values, [name]: value}));
        customStatusMessage.error = 0
    };
    
    if(customStatusMessage.error === 0) {
        if((isNaN(+menuData.harga) && menuData.harga)) {
            errorMessage = "Harga harus berupa angka";
            errorMessageClass = "statusmessagered";
        }
    }

    else if(customStatusMessage.error === 1) {
        errorMessage = customStatusMessage.message;
        errorMessageClass = "statusmessagered";
    }
    else {
        errorMessage = customStatusMessage.message;
        errorMessageClass = "statusmessagegreen";
    }

    const submitNewMenuData = (e) => {
        e.preventDefault();
        if(menuData.nama_menu === undefined
        || menuData.harga  === undefined
        || menuData.status_ketersediaan  === "") {
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
                    body: JSON.stringify(menuData),
                    mode: "cors"
                }
                fetch(backendUrl + "/editmenudata?id="+location.state.id_menu, payload)
                .then(res => res.json())
                .then(postResponse => setCustomStatusMessage({message: postResponse.msg, error: postResponse.success}));
            }
        }
    }

    const goToMenu = (e) => {
        e.preventDefault();
        navigate("/chef_menu_list", {state: {token: userToken, email: location.state.email, role: location.state.role}})
    }

    const goToChefHomepage = (e) => {
        e.preventDefault();
        navigate("/chef_homepage", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    return(
        <>
        <div className="headertext">EDIT DATA MENU
            <button className="topleftnavbutton" onClick={goToMenu} >DAFTAR MENU</button>
            <button className="toprightnavbutton" onClick={goToChefHomepage} >KESIAPAN ORDER</button>
        </div>
        <div className="secondarytext"></div>
        <br></br>
        <form onSubmit={submitNewMenuData}>
            <table className="submitkittable">
                <tr>
                    <td>NAMA MENU</td>
                    <td>
                    <input className="submitkitinput" type="text" name="nama_menu"
                    value={menuData.nama_menu} maxlength="64" onChange={(e) => updateMenuData(e)} />
                    </td>
                </tr>
                <tr>
                    <td>HARGA</td>
                    <td>Rp. <input className="submitkitinputprice" type="text" name="harga"
                    value={menuData.harga} onChange={(e) => updateMenuData(e)} /></td>
                </tr>
                <tr>
                    <td>KETERSEDIAAN</td>
                    <td><select name="status_ketersediaan" className="submitkitinput"
                        value={menuData.status_ketersediaan} onChange={(e) => updateMenuData(e)}>
                            <option value="Tersedia">Tersedia</option>
                            <option value="HABIS">HABIS</option>
                        </select></td>
                </tr>
                <tr>
                    <td colspan="2">
                        <div className={errorMessageClass}>{errorMessage}</div>
                        <input className="submitkitbutton" type="submit" value="EDIT" />
                    </td>
                </tr>
            </table>
        </form>
        </>
    );
}

export default ChefEditMenu;