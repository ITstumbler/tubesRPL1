import { React, useEffect, useState } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import './Loginpage.css';

function AdminChefList() {
    const location = useLocation();
    //console.log(location);

    const [tableData, setTableData] = useState([{id_koki: "Memuat data...", nama_koki: "Memuat data...", tanggal_diterima: "Memuat data...", status: "Memuat data..."}]);

    useEffect(() => {
        if(location.state.role !== "administrator") navigate("/forbidden", {state: {token: location.state.token, email: location.state.email, role: location.state.role}});
            
        fetch(backendUrl + `/viewtable?table=3`)
        .then(res => res.json())
        .then(jsondata => {setTableData(jsondata)});
    });
    
    const changeData = (e) => {
        const chef_id = e.target.name;
        navigate("/admin_edit_chef", {state: {token: location.state.token, email: location.state.email, role: location.state.role, id_koki: chef_id}})
    }

    const navigate = useNavigate();

    const goToHome = (e) => {
        e.preventDefault();
        navigate("/admin_homepage", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    const goToAddChefData = (e) => {
        e.preventDefault();
        navigate("/admin_add_chef", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    return(
        <>
        
        <div className="headertext">DATA KOKI
            <button className="toprightnavbutton" onClick={goToHome} >MENU UTAMA</button>
            <button className="topleftnavbutton" onClick={goToAddChefData} >TAMBAH KOKI</button>
        </div>
        <br></br>
        <table className="kitstable">
            <thead>
                <tr>
                    <th>ID koki</th>
                    <th>Nama koki</th>
                    <th>Tanggal diterima</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {tableData.map((data) => {
                    return(
                        <tr>
                            <td>{data.id_koki}</td>
                            <td>{data.nama_koki}</td>
                            <td>{data.tanggal_diterima.substring(0, 10)}</td>
                            <td>{data.status}</td>
                            <td><button
                            className="changedatabutton"
                            name={data.id_koki}
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

export default AdminChefList;