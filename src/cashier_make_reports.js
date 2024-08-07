import { React, useEffect, useState } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import './Loginpage.css';

function CashierMakeReports() {
    const location = useLocation();
    //console.log(location);

    const currentDate = new Date();
    const date = `${currentDate.getFullYear()}-${(currentDate.getMonth()+1).toString().padStart(2,0)}-${currentDate.getDate().toString().padStart(2,0)}`;

    const [dateData, setDateData] = useState({start_date: "2020-01-01", end_date: date});
    const [tableData, setTableData] = useState([{id_pesanan: 69, tanggal_dipesan: "Memuat data...", nama_pelanggan: "Memuat data...", nomor_meja: 10, total_harga: 60000, status_pembayaran: "Memuat data..."}]);
    const [totalPrice, setTotalPrice] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        if(location.state.role !== "kasir") navigate("/forbidden", {state: {token: location.state.token, email: location.state.email, role: location.state.role}});

        fetch(backendUrl + `/viewtable?table=14&start_date=`+dateData.start_date+`&end_date=`+dateData.end_date)
        .then(res => res.json())
        .then(jsondata => {setTableData(jsondata); console.log(jsondata)});

        let total_sales = 0;
        for(let i = 0; i < tableData.length; i++) {
            total_sales += tableData[i].total_harga;
        }
        setTotalPrice(total_sales);
    }, [dateData, tableData, location]);

    const updateDateData = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setDateData(values => ({...values, [name]: value}));
    };

    const goToCashierOrderListPage = (e) => {
        e.preventDefault();
        navigate("/cashier_order_list", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    const goToLogin = (e) => {
        e.preventDefault();
        navigate("/", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    return(
        <>
        <div className="headertext">BUAT LAPORAN
            <button className="topleftnavbutton" onClick={goToCashierOrderListPage} >DAFTAR PESANAN</button>
            <button className="toprightnavbutton" onClick={goToLogin} >LOGOUT</button>
        </div>
        
        <div className="secondarytext">{location.state.email || "TIDAK LOGGED IN"}</div>
        <br></br>
        <div class="menucontainer">
            <table className="menutable">
                <thead>
                    <tr>
                        <th>ID Pesanan</th>
                        <th>Tanggal dipesan</th>
                        <th>Nama pelanggan</th>
                        <th>Total harga</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((data) => {
                        return(
                            <tr>
                                <td>{data.id_pesanan}</td>
                                <td>{data.tanggal_dipesan.substring(0, 10)}</td>
                                <td>{data.nama_pelanggan || "(Anonim)"}</td>
                                <td>Rp {data.total_harga.toLocaleString("en")}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
        <table class="nomormejacontainer">
            <tbody>
                <tr>
                    <td>Mulai dari tanggal: </td>
                    <td><input className="submitkitinput" type="date" name="start_date"
                    value={dateData.start_date} onChange={(e) => updateDateData(e)} /></td>
                    
                </tr>
                <tr>
                    <td>Berakhir di tanggal: </td>
                    <td><input className="submitkitinput" type="date" name="end_date"
                    value={dateData.end_date} onChange={(e) => updateDateData(e)} /></td>
                </tr>
            </tbody>
        </table>
        <table class="orderdetailscontainer">
            <tbody>
                <tr>
                    <td>Jumlah pesanan: </td>
                    <td>{tableData.length}</td>
                </tr>
                <tr>
                    <td>Total penjualan: </td>
                    <td>Rp {totalPrice.toLocaleString("en")}</td>
                </tr>
            </tbody>
        </table>
        <Outlet />
        </>
    );
}

export default CashierMakeReports;