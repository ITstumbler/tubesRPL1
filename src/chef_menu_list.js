import { React, useEffect, useState } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import './Loginpage.css';

function ChefMenuList() {
    const location = useLocation();
    //console.log(location);

    const [tableData, setTableData] = useState([{id_menu: "Memuat data...", nama_menu: "Memuat data...", harga: "Memuat data...", status_ketersediaan: "Memuat data..."}]);
    const [deleteMenuResponse, setDeleteMenuResponse] = useState({message: "", error: false});

    let errorMessageClass = "statusmessagered";

    useEffect(() => {
        if(location.state.role !== "koki") navigate("/forbidden", {state: {token: location.state.token, email: location.state.email, role: location.state.role}});

        fetch(backendUrl + `/viewtable`)
        .then(res => res.json())
        .then(jsondata => {setTableData(jsondata)});
    });

    if(deleteMenuResponse.error === false) {
        errorMessageClass = "statusmessagegreen";
    }

    else if(deleteMenuResponse.error === true) {
        errorMessageClass = "statusmessagered";
    }

    const changeMenu = (e) => {
        const menu_id = e.target.name;
        navigate("/chef_edit_menu", {state: {token: location.state.token, email: location.state.email, role: location.state.role, id_menu: menu_id}});
    }
    
    const deleteMenu = (e) => {
        const id_menu = e.target.name;
        const payload = {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": location.state.token },
            body: JSON.stringify({menuIdToDelete: id_menu}),
            mode: "cors"
        }
        fetch(backendUrl + `/deletemenudata`, payload)
        .then(res => res.json())
        .then(jsondata => {setDeleteMenuResponse({message: jsondata.message, error: jsondata.err})});
    }

    const navigate = useNavigate();

    const goToAddMenuPage = (e) => {
        e.preventDefault();
        navigate("/chef_add_menu", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    const goToChefHomepage = (e) => {
        e.preventDefault();
        navigate("/chef_homepage", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    return(
        <>
        <div className="headertext">DAFTAR MENU PAK RESTO UNIKOM
            <button className="topleftnavbutton" onClick={goToAddMenuPage} >TAMBAH MENU</button>
            <button className="toprightnavbutton" onClick={goToChefHomepage} >KEMBALI</button>
        </div>
        
        <div className="secondarytext">{location.state.email || "TIDAK LOGGED IN"}</div>
        <div className={errorMessageClass}>{deleteMenuResponse.message}</div>
        <br></br>
        <table className="kitstable">
            <thead>
                <tr>
                    <th>ID Menu</th>
                    <th>Nama menu</th>
                    <th>Harga</th>
                    <th>Ketersediaan</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {tableData.map((data) => {
                    return(
                        <tr>
                            <td>{data.id_menu}</td>
                            <td>{data.nama_menu}</td>
                            <td>Rp {data.harga.toLocaleString("en")}</td>
                            <td><font color={data.status_ketersediaan === "HABIS" ? "red" : ""}>{data.status_ketersediaan}</font></td>
                            <td><button
                            className="changedatabutton"
                            name={data.id_menu}
                            onClick={(e) => {changeMenu(e)}}
                            >UBAH DATA</button></td>
                            <td><button
                            className="changedatabutton"
                            name={data.id_menu}
                            onClick={(e) => {deleteMenu(e)}}
                            >HAPUS DATA</button></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        <Outlet />
        </>
    );
}

export default ChefMenuList;