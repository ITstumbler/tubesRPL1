import { React, useEffect, useState } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import './Loginpage.css';

function AdminUserList() {
    const location = useLocation();
    //console.log(location);

    const [tableData, setTableData] = useState([{id_user: "Memuat data...", nama_pelayan: "Memuat data...", email: "Memuat data...", status: "Memuat data..."}]);

    useEffect(() => {
        if(location.state.role !== "administrator") navigate("/forbidden", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
            
        fetch(backendUrl + `/viewtable?table=5`)
        .then(res => res.json())
        .then(jsondata => {setTableData(jsondata)});
    });
    
    const changeData = (e) => {
        const user_id = e.target.name;
        let user_peran = "EXTRANOOB";
        for(let i=0; i<tableData.length; i++) {
            if(String(tableData[i].id_user) === String(user_id)) {
                user_peran = tableData[i].nama_pelayan !== null ? "pelayan" : (tableData[i].nama_koki !== null ? "koki" : (tableData[i].nama_kasir !== null ? "kasir" : "administrator"))
            }
        }
        navigate("/admin_edit_user", {state: {token: location.state.token, email: location.state.email, role: location.state.role, id_user: user_id, peran_user: user_peran}})
    }

    const navigate = useNavigate();

    const goToHome = (e) => {
        e.preventDefault();
        navigate("/admin_homepage", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    const goToAddUserData = (e) => {
        e.preventDefault();
        navigate("/admin_add_user", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    return(
        <>
        
        <div className="headertext">DATA USER
            <button className="toprightnavbutton" onClick={goToHome} >KEMBALI</button>
            <button className="topleftnavbutton" onClick={goToAddUserData} >TAMBAH USER</button>
        </div>
        
        <div className="statusmessagered"></div>
        <br></br>
        <table className="kitstable">
            <thead>
                <tr>
                    <th>ID user</th>
                    <th>Karyawan</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Peran</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {tableData.map((data) => {
                    return(
                        <tr>
                            <td>{data.id_user}</td>
                            <td>{data.nama_pelayan !== null ? data.nama_pelayan : (data.nama_koki !== null ? data.nama_koki : (data.nama_kasir !== null ? data.nama_kasir : "ADMINISTRATOR"))}</td>
                            <td>{data.email}</td>
                            <td>{data.status}</td>
                            <td>{data.nama_pelayan !== null ? "Pelayan" : (data.nama_koki !== null ? "Koki" : (data.nama_kasir !== null ? "Kasir" : "Administrator"))}</td>
                            <td><button
                            className="changedatabutton"
                            name={data.id_user}
                            onClick={(e) => {changeData(e)}}
                            >UBAH DATA</button></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        <Outlet />
        </>
    );
}

export default AdminUserList;