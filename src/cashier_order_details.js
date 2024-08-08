import { React, useEffect, useState } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import './Loginpage.css';

function CashierOrderDetails() {
    // eslint-disable-next-line
    const location = useLocation();
    //console.log(location);

    const [orderDetails, setOrderDetails] = useState({nomor_meja: "", nama_pelanggan: "", tanggal_dipesan: "2024-02-02", total_harga: 0, status_pembayaran: "Belum Dibayar"});
    const [tableData, setTableData] = useState([{jumlah: 69, nama_menu: "dummy", harga: 60000, subtotal: 69000}]);
    const [customStatusMessage, setCustomStatusMessage] = useState({message: "", error: 0});

    let errorMessage;
    
    // eslint-disable-next-line
    const navigate = useNavigate();

    useEffect(() => {
        if(location.state.role !== "kasir") navigate("/forbidden", {state: {token: location.state.token, email: location.state.email, role: location.state.role}});
        if(!location.state.id_pesanan) navigate("/cashier_order_list", {state: {token: location.state.token, email: location.state.email, role: location.state.role}});
        fetch(backendUrl + `/viewtable?table=13&id=` + location.state.id_pesanan)
        .then(res => res.json())
        .then(jsondata => {
            setTableData(jsondata);
        });
        fetch(backendUrl + `/viewentry?table=6&id=` + location.state.id_pesanan)
        .then(res => res.json())
        .then(jsondata => {
            setOrderDetails(jsondata);
        });
    }, [orderDetails, location]);

    // useEffect(() => {
    //     let tempPrice = 0;
    //     for(const [key, value] of Object.entries(orderList)) {
    //         console.log("Key: " + key);
    //         console.log("Amt: " + value);
    //         let pricePerMenu = 0;
    //         for(let i = 0; i < tableData.length; i++) {
    //             if (Number(tableData[i].id_menu) !== Number(key)) continue;
    //             pricePerMenu = tableData[i].harga;
    //             break;
    //         }
    //         console.log("Price: " + pricePerMenu);
    //         tempPrice += (pricePerMenu * value);
    //     }
    //     setOrderDetails(values => ({...values, "total_price": tempPrice}));
    // }, [orderList, tableData]);
    
    const goToCashierOrderListPage = (e) => {
        e.preventDefault();
        navigate("/cashier_order_list", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    const goToLogin = (e) => {
        e.preventDefault();
        navigate("/", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    const markPaid = (e) => {
        e.preventDefault();
        const payload = {
            method: "POST",
            headers: {"Content-Type": "application/json", "Authorization": location.state.token},
            body: JSON.stringify({id_pesanan: location.state.id_pesanan}),
            mode: "cors"
        }
        fetch(backendUrl + "/mark_order_paid", payload)
        .then(res => res.json())
        .then(postResponse => {
            setCustomStatusMessage({message: postResponse.message, error: postResponse.error});
        });
        
    }

    return(
        <>
        <div className="headertext">INFORMASI PESANAN {location.state.id_pesanan}
            <button className={(orderDetails.status_pembayaran === "Belum Dibayar") ? "bottomrightnavbutton" : "bottomrightnavbuttondisabled"} disabled={(orderDetails.status_pembayaran === "Belum Dibayar") ? false : true} onClick={(e) => markPaid(e)} >TANDAI DIBAYAR</button>
            <button className="topleftnavbutton" onClick={goToCashierOrderListPage} >DAFTAR PESANAN</button>
            <button className="toprightnavbutton" onClick={goToLogin} >LOGOUT</button>
        </div>
        
        {/* <div className="secondarytext">{"TIDAK LOGGED IN"}</div> */}
        {/* <div className={errorMessageClass}>{deleteMenuResponse.message}</div> */}
        <br></br>
        <div class="menucontainer">
            <table className="menutable">
                <thead>
                    <tr>
                        <th>Nama menu</th>
                        <th>Harga</th>
                        <th>Jumlah</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((data) => {
                        return(
                            <tr>
                                <td>{data.nama_menu}</td>
                                <td>Rp {data.harga.toLocaleString("en")}</td>
                                <td>{data.jumlah}</td>
                                <td>Rp {data.subtotal.toLocaleString("en")}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
        <table class="nomormejacontainer">
            <tbody>
                <tr>
                    <td>Nomor meja: </td>
                    <td>{orderDetails.nomor_meja}</td>
                    
                </tr>
                <tr>
                    <td>Nama pelanggan: </td>
                    <td>{orderDetails.nama_pelanggan || "(Anonim)"}</td>
                </tr>
                <tr>
                    <td colspan="2">
                    <div className={customStatusMessage.error === 2 ? "statusmessagegreen" : "statusmessagered"}>{errorMessage}</div>
                    </td>
                </tr>
            </tbody>
        </table>
        <table class="orderdetailscontainer">
            <tbody>
                <tr>
                    <td>Pesanan ini dibuat tanggal </td>
                    <td>{orderDetails.tanggal_dipesan.substring(0, 10)}</td>
                </tr>
                <tr>
                    <td>Total harga: </td>
                    <td>Rp {orderDetails.total_harga.toLocaleString("en")}</td>
                </tr>
                <tr>
                    <td>Pesanan ini </td>
                    <td><div className={orderDetails.status_pembayaran === "Belum Dibayar" ? "statusmessagered" : "statusmessagegreen"}>{orderDetails.status_pembayaran === "Belum Dibayar" ? "BELUM DIBAYAR" : "SUDAH DIBAYAR"}</div></td>
                </tr>
            </tbody>
        </table>
        <Outlet />
        </>
    );
}

export default CashierOrderDetails;