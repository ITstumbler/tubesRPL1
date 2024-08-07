import { React, useEffect, useState } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import './Loginpage.css';

function AdminCashierList() {
    const location = useLocation();
    //console.log(location);

    const [tableData, setTableData] = useState([{id_kasir: "lma", nama_kasir: "Budi Kokibudi", tanggal_diterima: "1980-12-12", status: "Dummy"}]);

    useEffect(() => {
        if(location.state.role !== "administrator") navigate("/forbidden", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
            
        fetch(backendUrl + `/viewtable?table=4`)
        .then(res => res.json())
        .then(jsondata => {setTableData(jsondata)});
    });
    
    const changeData = (e) => {
        const cashier_id = e.target.name;
        navigate("/admin_edit_cashier", {state: {token: location.state.token, email: location.state.email, role: location.state.role, id_kasir: cashier_id}})
    }

    const navigate = useNavigate();

    const goToHome = (e) => {
        e.preventDefault();
        navigate("/admin_homepage", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    const goToAddCashierData = (e) => {
        e.preventDefault();
        navigate("/admin_add_cashier", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    return(
        <>
        
        <div className="headertext">DATA KASIR
            <button className="toprightnavbutton" onClick={goToHome} >MENU UTAMA</button>
            <button className="topleftnavbutton" onClick={goToAddCashierData} >TAMBAH KASIR</button>
        </div>
        <br></br>
        <table className="kitstable">
            <thead>
                <tr>
                    <th>ID kasir</th>
                    <th>Nama kasir</th>
                    <th>Tanggal diterima</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {tableData.map((data) => {
                    return(
                        <tr>
                            <td>{data.id_kasir}</td>
                            <td>{data.nama_kasir}</td>
                            <td>{data.tanggal_diterima.substring(0, 10)}</td>
                            <td>{data.status}</td>
                            <td><button
                            className="changedatabutton"
                            name={data.id_kasir}
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

export default AdminCashierList;