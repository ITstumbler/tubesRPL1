import { React, useEffect, useState } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import './Loginpage.css';

function CashierOrderList() {
    const location = useLocation();
    //console.log(location);

    const [orderData, setOrderData] = useState([{id_pesanan: "Memuat data...", tanggal_dipesan: "Memuat data...", nama_pelanggan: "Memuat data...", nomor_meja: "Memuat data...", total_harga: "Memuat data...", status_pembayaran: "Memuat data..."}]);

    useEffect(() => {
        if(location.state.role !== "kasir") navigate("/forbidden", {state: {token: location.state.token, email: location.state.email, role: location.state.role}});

        fetch(backendUrl + `/viewtable?table=12`)
        .then(res => res.json())
        .then(jsondata => {setOrderData(jsondata)});
    });

    const displayOrderDetails = (e) => {
        const id_pesanan = e.target.name;
        navigate("/cashier_order_details", {state: {token: location.state.token, email: location.state.email, role: location.state.role, id_pesanan: id_pesanan}});
    }

    const goToLogin = (e) => {
        e.preventDefault();
        navigate("/", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }
    
    const navigate = useNavigate();

    const goToMakeReportsPage = (e) => {
        e.preventDefault();
        navigate("/cashier_make_reports", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    return(
        <>
        <div className="headertext">DAFTAR MENU PAK RESTO UNIKOM
            <button className="topleftnavbutton" onClick={goToMakeReportsPage} >BUAT LAPORAN</button>
            <button className="toprightnavbutton" onClick={goToLogin} >LOGOUT</button>
        </div>
        
        <div className="secondarytext">{location.state.email || "TIDAK LOGGED IN"}</div>
        <br></br>
        <table className="kitstable">
            <thead>
                <tr>
                    <th>ID Pesanan</th>
                    <th>Tanggal dipesan</th>
                    <th>Nomor meja</th>
                    <th>Nama pelanggan</th>
                    <th>Total harga</th>
                    <th>Status pembayaran</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {orderData.map((data) => {
                    return(
                        <tr>
                            <td>{data.id_pesanan}</td>
                            <td>{data.tanggal_dipesan.substring(0, 10)}</td>
                            <td>{data.nomor_meja}</td>
                            <td>{data.nama_pelanggan || "(Anonim)"}</td>
                            <td>Rp {data.total_harga.toLocaleString("en")}</td>
                            <td><font color={data.status_pembayaran === "Belum Dibayar" ? "red" : ""}>{data.status_pembayaran}</font></td>
                            <td><button
                            className="changedatabutton"
                            name={data.id_pesanan}
                            onClick={(e) => {displayOrderDetails(e)}}
                            >LIHAT DETAIL</button></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        <Outlet />
        </>
    );
}

export default CashierOrderList;