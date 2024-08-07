import { React, useEffect, useState } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import './Loginpage.css';

function AdminWaiterList() {
    const location = useLocation();
    //console.log(location);

    const [tableData, setTableData] = useState([{id_pelayan: "Memuat...", nama_pelayan: "Memuat data...", tanggal_diterima: "Memuat data...", status: "Memuat data..."}]);

    useEffect(() => {
        if(location.state.role !== "administrator") navigate("/forbidden", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
            
        fetch(backendUrl + `/viewtable?table=2`)
        .then(res => res.json())
        .then(jsondata => {setTableData(jsondata)});
    });
    
    const changeData = (e) => {
        const waiter_id = e.target.name;
        navigate("/admin_edit_waiter", {state: {token: location.state.token, email: location.state.email, role: location.state.role, id_pelayan: waiter_id}})
    }

    const navigate = useNavigate();

    const goToHome = (e) => {
        e.preventDefault();
        navigate("/admin_homepage", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    const goToAddWaiterData = (e) => {
        e.preventDefault();
        navigate("/admin_add_waiter", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    return(
        <>
        
        <div className="headertext">DATA PELAYAN
            <button className="toprightnavbutton" onClick={goToHome} >MENU UTAMA</button>
            <button className="topleftnavbutton" onClick={goToAddWaiterData} >TAMBAH PELAYAN</button>
        </div>
        <br></br>
        <table className="kitstable">
            <thead>
                <tr>
                    <th>ID pelayan</th>
                    <th>Nama pelayan</th>
                    <th>Tanggal diterima</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {tableData.map((data) => {
                    return(
                        <tr>
                            <td>{data.id_pelayan}</td>
                            <td>{data.nama_pelayan}</td>
                            <td>{data.tanggal_diterima.substring(0, 10)}</td>
                            <td>{data.status}</td>
                            <td><button
                            className="changedatabutton"
                            name={data.id_pelayan}
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

export default AdminWaiterList;