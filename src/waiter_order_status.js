import { React, useEffect, useState } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import './Loginpage.css';

function WaiterOrderStatus() {
    const location = useLocation();
    //console.log(location);

    const [tableData, setTableData] = useState([{nomor_meja: 69, nama_menu: "dummy", jumlah: 42, siap_disajikan: "dummy"}]);
    const [updateOrderStatus, updateOrderStatusResponse] = useState({message: "", error: 0});

    useEffect(() => {
        if(location.state.role !== "pelayan") navigate("/forbidden", {state: {token: location.state.token, email: location.state.email, role: location.state.role}});

        fetch(backendUrl + `/viewtable?table=11`)
        .then(res => res.json())
        .then(jsondata => {setTableData(jsondata)});
    });
    
    const markOrderDone = (e) => {
        const id_menu = e.target.name;
        const id_pesanan = e.target.value;
        const payload = {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": location.state.token },
            body: JSON.stringify({id_menu: id_menu, id_pesanan: id_pesanan, status: "Telah Disajikan"}),
            mode: "cors"
        }
        fetch(backendUrl + `/mark_order_ready`, payload)
        .then(res => res.json())
        .then(jsondata => {updateOrderStatusResponse({message: jsondata.msg, error: jsondata.success})});
    }

    const navigate = useNavigate();

    const goToLogin = (e) => {
        e.preventDefault();
        navigate("/", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    const goToOrderPage = (e) => {
        e.preventDefault();
        navigate("/waiter_order", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    return(
        <>
        
        <div className="headertext">STATUS KESIAPAN PESANAN
            <button className="toprightnavbutton" onClick={goToLogin} >LOGOUT</button>
            <button className="topleftnavbutton" onClick={goToOrderPage} >BUAT PESANAN</button>
        </div>
        
        <div className="secondarytext">{location.state.email || "NOT LOGGED IN"}</div>
        <div className={updateOrderStatus.error === 2 ? "statusmessagegreen" : "statusmessagered"}>{updateOrderStatus.message}</div>
        <br></br>
        <table className="kitstable">
            <thead>
                <tr>
                    <th>Nomor Meja</th>
                    <th>Nama menu</th>
                    <th>Jumlah</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {tableData.map((data) => {
                    return(
                        <tr>
                            <td>{data.nomor_meja}</td>
                            <td>{data.nama_menu}</td>
                            <td>{data.jumlah}</td>
                            <td><font color={data.siap_disajikan === "Siap Disajikan" ? "red" : "#fbf1d7"}>{data.siap_disajikan}</font></td>
                            <td><button
                            className={data.siap_disajikan === "Siap Disajikan" ? "changedatabutton" : "changedatabuttondisabled"}
                            disabled={data.siap_disajikan === "Siap Disajikan" ? false : true}
                            name={data.id_menu}
                            value={data.id_pesanan}
                            onClick={(e) => {markOrderDone(e)}}
                            >TANDAI SUDAH</button></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        <Outlet />
        </>
    );
}

export default WaiterOrderStatus;