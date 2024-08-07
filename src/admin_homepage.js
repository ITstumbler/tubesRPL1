import { React, useEffect } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import './Loginpage.css';

function AdminHomepage() {
    const location = useLocation();
    //console.log(location);

    const navigate = useNavigate();

    useEffect(() => {
        if(location.state.role !== "administrator") navigate("/forbidden", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    });

    const goToLogin = (e) => {
        e.preventDefault();
        navigate("/", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    const goToWaiterList = (e) => {
        e.preventDefault();
        navigate("/admin_waiter_list", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    const goToChefList = (e) => {
        e.preventDefault();
        navigate("/admin_chef_list", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    const goToCashierList = (e) => {
        e.preventDefault();
        navigate("/admin_cashier_list", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    const goToUserList = (e) => {
        e.preventDefault();
        navigate("/admin_user_list", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    return(
        <>
        
        <div className="headertext">MENU NAVIGASI ADMIN
            <button className="toprightnavbutton" onClick={goToLogin} >LOGOUT</button>
        </div>
        
        <br></br>
        <table className="navigationtable">
            <thead>
                <tr>
                    <th><button className="navigationbutton" onClick={goToWaiterList} >Data Pelayan</button></th>
                    <th><button className="navigationbutton" onClick={goToChefList} >Data Koki</button></th>
                    <th><button className="navigationbutton" onClick={goToCashierList} >Data Kasir</button></th>
                    <th><button className="navigationbutton" onClick={goToUserList} >Data User</button></th>
                </tr>
            </thead>
        </table>
        <Outlet />
        </>
    );
}

export default AdminHomepage;