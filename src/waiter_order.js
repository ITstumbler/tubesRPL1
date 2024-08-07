import { React, useEffect, useState } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import './Loginpage.css';

function WaiterOrder() {
    // eslint-disable-next-line
    const location = useLocation();
    //console.log(location);

    const [orderList, setOrderList] = useState({});
    const [orderDetails, setOrderDetails] = useState({nomor_meja: "", nama_pelanggan: "", total_price: 0, ordered: false});
    const [tableData, setTableData] = useState([{id_menu: "Memuat data...", nama_menu: "Memuat data...", harga: "Memuat data...", status_ketersediaan: "Memuat data..."}]);
    const [customStatusMessage, setCustomStatusMessage] = useState({message: "", error: 0});

    let errorMessage;
    
    // eslint-disable-next-line
    const navigate = useNavigate();

    useEffect(() => {
        if(location.state.role !== "pelayan") navigate("/forbidden", {state: {token: location.state.token, email: location.state.email, role: location.state.role}});

        fetch(backendUrl + `/viewtable`)
        .then(res => res.json())
        .then(jsondata => {
            setTableData(jsondata);
        });
    }, [location]);

    useEffect(() => {
        let tempPrice = 0;
        for(const [key, value] of Object.entries(orderList)) {
            console.log("Key: " + key);
            console.log("Amt: " + value);
            let pricePerMenu = 0;
            for(let i = 0; i < tableData.length; i++) {
                if (Number(tableData[i].id_menu) !== Number(key)) continue;
                pricePerMenu = tableData[i].harga;
                break;
            }
            console.log("Price: " + pricePerMenu);
            tempPrice += (pricePerMenu * value);
        }
        setOrderDetails(values => ({...values, "total_price": tempPrice}));
    }, [orderList, tableData]);

    if(customStatusMessage.error === 0) {
        if((isNaN(+orderDetails.nomor_meja) && orderDetails.nomor_meja)) {
            errorMessage = "Nomor meja harus berupa angka";
        }
    }
    else {
        errorMessage = customStatusMessage.message;
    }

    const updateOrderDetails = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setOrderDetails(values => ({...values, [name]: value}));
        customStatusMessage.error = 0
    };

    const minusOrderCount = (e) => {
        const menu_id = e.target.name;
        let currentCount = orderList[menu_id] || 0;
        currentCount = currentCount === 0 ? 0 : currentCount - 1;
        setOrderList(values => ({...values, [menu_id]: currentCount}));
        customStatusMessage.error = 0
    }
    
    const plusOrderCount = (e) => {
        const menu_id = e.target.name;
        let currentCount = orderList[menu_id] || 0;
        currentCount += 1;
        setOrderList(values => ({...values, [menu_id]: currentCount}));
        customStatusMessage.error = 0
    }

    const goToLogin = (e) => {
        e.preventDefault();
        navigate("/", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    const goToWaiterOrderStatusPage = (e) => {
        e.preventDefault();
        navigate("/waiter_order_status", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    const placeOrder = (e) => {
        e.preventDefault();
        const currentDate = new Date();
        const date = `${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2,0)}-${currentDate.getDate().toString().padStart(2,0)}`;
        const payload = {
            method: "POST",
            // headers: {"Content-Type": "application/json", "Authorization": userToken},
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({order_list: orderList, order_details: orderDetails, order_date: date}),
            mode: "cors"
        }
        fetch(backendUrl + "/order", payload)
        .then(res => res.json())
        .then(postResponse => {
            setOrderDetails(values => ({...values, "ordered": true}));
            errorMessage = postResponse.message;
            console.log(postResponse.message);
            setCustomStatusMessage({message: postResponse.message, error: postResponse.error});
        });
        
    }

    return(
        <>
        <div className="headertext">DAFTAR MENU PAK RESTO UNIKOM
            <button className={(!isNaN(+orderDetails.nomor_meja) && orderDetails.nomor_meja && orderDetails.total_price > 0 && orderDetails.ordered === false) ? "bottomrightnavbutton" : "bottomrightnavbuttondisabled"} disabled={(!isNaN(+orderDetails.nomor_meja) && orderDetails.nomor_meja && orderDetails.total_price > 0 && orderDetails.ordered === false) ? false : true} onClick={placeOrder} >PESAN ORDER</button>
            <button className="toprightnavbutton" onClick={goToLogin} >LOGOUT</button>
            <button className="topleftnavbutton" onClick={goToWaiterOrderStatusPage} >KESIAPAN ORDER</button>
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
                        <th>Ketersediaan</th>
                        <th>Jumlah Dipesan</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((data) => {
                        return(
                            <tr>
                                <td>{data.nama_menu}</td>
                                <td>Rp {data.harga.toLocaleString("en")}</td>
                                <td><font color={data.status_ketersediaan === "HABIS" ? "red" : ""}>{data.status_ketersediaan}</font></td>
                                <td><button
                                className={data.status_ketersediaan === "HABIS" ? "plusminusbuttondisabled" : "plusminusbutton"}
                                disabled={data.status_ketersediaan === "HABIS" ? true : false}
                                name={data.id_menu}
                                onClick={(e) => {minusOrderCount(e)}}
                                >-</button>
                                <div class="orderCount">{orderList[data.id_menu] || 0}</div>
                                <button
                                className={data.status_ketersediaan === "HABIS" ? "plusminusbuttondisabled" : "plusminusbutton"}
                                disabled={data.status_ketersediaan === "HABIS" ? true : false}
                                name={data.id_menu}
                                onClick={(e) => {plusOrderCount(e)}}
                                >+</button></td>
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
                    <td><input className="passwordinput" type="text" name="nomor_meja"
                    value={orderDetails.nomor_meja} maxlength="2" onChange={(e) => updateOrderDetails(e)} /></td>
                    
                </tr>
                <tr>
                    <td>Nama pelanggan: </td>
                    <td><input className="passwordinput" type="text" name="nama_pelanggan"
                    value={orderDetails.nama_pelanggan} maxlength="64" onChange={(e) => updateOrderDetails(e)} /></td>
                </tr>
                <tr>
                    <td colspan="2">
                    <div className={customStatusMessage.error === 2 ? "statusmessagegreen" : "statusmessagered"}>{errorMessage}</div>
                    </td>
                </tr>
            </tbody>
        </table>
        <table class="totalpricecontainer">
            <tbody>
                <tr>
                    <td>Total harga: </td>
                    <td>Rp {orderDetails.total_price.toLocaleString("en")}</td>
                </tr>
            </tbody>
        </table>
        <Outlet />
        </>
    );
}

export default WaiterOrder;