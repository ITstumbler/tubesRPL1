import { React, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import "./Loginpage.css";

function AdminAddUser() {
    const location = useLocation();
    const [userData, setUserData] = useState({peran: "pelayan", id_karyawan: "1", email: "", status: "Aktif", password: ""});
    //error 0 means use default error messages for password mismatch and passwords being under 6 characters long.
    //error 1 or 2 uses the message set in customStatusMessage. 1 displays red text and 2 displays green text.
    const [customStatusMessage, setCustomStatusMessage] = useState({message: "", error: 0});
    const [employeeList, setEmployeeList] = useState([{nama_karyawan: "Memuat data...", id_karyawan: "-1"}]);

    const navigate = useNavigate();

    useEffect(() => {
        if(location.state.role !== "administrator") navigate("/forbidden", {state: {token: location.state.token, email: location.state.email, role: location.state.role}});
        fetch(backendUrl + "/viewtable?table=6")
        .then(res => res.json())
        .then(employeeData => setEmployeeList(employeeData));
    }, [location]);

    let errorMessage = " ";
    let errorMessageClass = "statusmessagered";
    let userToken = "";
    if(location.state.token && location.state.token) {
        userToken = location.state.token;
    }

    const updateUserData = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setUserData(values => ({...values, [name]: value}));
        customStatusMessage.error = 0
    };

    if(userData.peran === "pelayan") {
        fetch(backendUrl + "/viewtable?table=6")
        .then(res => res.json())
        .then(employeeData => setEmployeeList(employeeData));
    }

    if(userData.peran === "koki") {
        fetch(backendUrl + "/viewtable?table=7")
        .then(res => res.json())
        .then(employeeData => setEmployeeList(employeeData));
    }

    if(userData.peran === "kasir") {
        fetch(backendUrl + "/viewtable?table=8")
        .then(res => res.json())
        .then(employeeData => setEmployeeList(employeeData));
    }

    if(userData.peran === "administrator") {
        fetch(backendUrl + "/viewtable?table=9")
        .then(res => res.json())
        .then(employeeData => setEmployeeList(employeeData));
    }
    
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

    const submitNewUserData = (e) => {
        e.preventDefault();
        if(userData.peran === ""
        || userData.id_karyawan  === "-1"
        || userData.email  === ""
        || userData.status  === ""
        || userData.password === "") {
            //setCustomStatusMessage({message: "Peran: "+userData.peran+"ID karyawan: "+userData.id_karyawan+"Email: "+userData.email+"Status: "+userData.id_status+"Password: "+userData.password, error: 1});
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
                    body: JSON.stringify(userData),
                    mode: "cors"
                }
                fetch(backendUrl + "/adduserdata", payload)
                .then(res => res.json())
                .then(postResponse => {setCustomStatusMessage({message: postResponse.msg, error: postResponse.success})});
            }
        }
    }

    const goToHome = (e) => {
        e.preventDefault();
        navigate("/admin_homepage", {state: {token: userToken, email: location.state.email, role: location.state.role}})
    }

    const goToUserList = (e) => {
        e.preventDefault();
        navigate("/admin_user_list", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    return(
        <>
        <div className="headertext">TAMBAH DATA USER
            <button className="toprightnavbutton" onClick={goToHome} >MENU UTAMA</button>
            <button className="topleftnavbutton" onClick={goToUserList} >DATA USER</button>
        </div>
        <br></br>
        <form onSubmit={submitNewUserData}>
            <table className="submitkittable">
                <tr>
                    <td>Peran</td>
                    <td>
                        <select name="peran" className="submitkitinput"
                        value={userData.peran} onChange={(e) => updateUserData(e)}>
                            <option value="pelayan">Pelayan</option>
                            <option value="koki">Koki</option>
                            <option value="kasir">Kasir</option>
                            <option value="administrator">Administrator</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Nama karyawan</td>
                    <td>
                        <select name="id_karyawan" className="submitkitinput"
                        value={userData.id_karyawan} onChange={(e) => updateUserData(e)}>
                            {employeeList.map((employeeEntry) => {
                                return(
                                    <option value={employeeEntry.id_karyawan}>{employeeEntry.nama_karyawan}</option>
                                )
                            })}
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>EMAIL</td>
                    <td><input className="submitkitinput" type="text" name="email"
                    value={userData.email} onChange={(e) => updateUserData(e)} /></td>
                </tr>
                <tr>
                    <td>STATUS</td>
                    <td><select name="status" className="submitkitinput"
                        value={userData.status} onChange={(e) => updateUserData(e)}>
                            <option value="Aktif">Aktif</option>
                            <option value="Tidak Aktif">Tidak Aktif</option>
                            <option value="ADMINISTRATOR">Administrator</option>
                        </select></td>
                </tr>
                <tr>
                    <td>PASSWORD</td>
                    <td><input className="submitkitinput" type="text" name="password"
                    value={userData.password} onChange={(e) => updateUserData(e)} /></td>
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

export default AdminAddUser;