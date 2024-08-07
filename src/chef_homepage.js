import { React, useEffect } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import './Loginpage.css';

function ChefHomepage() {
    const location = useLocation();
    //console.log(location);

    const navigate = useNavigate();

    useEffect(() => {
        if(location.state.role !== "koki") navigate("/forbidden", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    });

    const goToLogin = (e) => {
        e.preventDefault();
        navigate("/", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    const goToMenuList = (e) => {
        e.preventDefault();
        navigate("/chef_menu_list", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    const goToOrderStatus = (e) => {
        e.preventDefault();
        navigate("/chef_order_status", {state: {token: location.state.token, email: location.state.email, role: location.state.role}})
    }

    return(
        <>
        
        <div className="headertext">MENU NAVIGASI KOKI
            <button className="toprightnavbutton" onClick={goToLogin} >LOGOUT</button>
        </div>
        
        <br></br>
        <table className="navigationtable">
            <thead>
                <tr>
                    <th><button className="navigationbutton" onClick={goToMenuList} >Data Menu</button></th>
                    <th><button className="navigationbutton" onClick={goToOrderStatus} >Kesiapan Order</button></th>
                </tr>
            </thead>
        </table>
        <Outlet />
        </>
    );
}

export default ChefHomepage;