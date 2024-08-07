import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { backendUrl } from "./index.js";
import './Loginpage.css';

function Loginpage() {

  const [logindata, setLogindata] = useState({});
  const [customStatusMessage, setCustomStatusMessage] = useState({message: "", error: true});

  const updateLogindata = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setLogindata(values => ({...values, [name]: value}));
  };

  const navigate = useNavigate();

  let errorMessage = customStatusMessage.message;
  let errorMessageClass = customStatusMessage.error ? "statusmessagered" : "statusmessagegreen";

  const goToCustomerOrder = (e) => {
    e.preventDefault();
    navigate("/customer_order", {state: {}})
}

  const login = (e) => {
    e.preventDefault();
    const payload = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logindata),
      mode: "cors"
    }
    fetch(backendUrl + `/login`, payload)
    .then(res => res.json())
    .then((postResponse) => {
      if(postResponse.loginsuccess === true) {
        setCustomStatusMessage({message: postResponse.message, error: false});
        const homepageToRedirect = "/" + postResponse.redirect;
        navigate(homepageToRedirect, {state: {token: postResponse.token, email: postResponse.email, role: postResponse.role}});
      }
      else if(postResponse.message) {
        setCustomStatusMessage({message: postResponse.message, error: true});
      }
      else {
        setCustomStatusMessage({message: "Unknown error", error: true});
      }
    });
  }

  return (
    <><div className="headertext">LOGIN
      <button className="toprightnavbutton" onClick={goToCustomerOrder} >BUAT PESANAN</button>
    </div>
    
    <div className="loginbox">
      <form onSubmit={login}>
        <table>
            <input type="text" className="passwordinput" placeholder="Email" name="email" title="Email" value={logindata.email} maxlength="64"
            onChange={(e) => {updateLogindata(e)}}
            />
            <input type="password" className="passwordinput" placeholder="Password" name ="password" title="Password" value={logindata.password} maxlength="64"
            onChange={(e) => {updateLogindata(e)}}
            />
            <p className={errorMessageClass}>{errorMessage}</p>
            <input className="tf2button" type="submit" value="Login" />
            
            <p className="subtextnoaccount">HALAMAN INI HANYA UNTUK KARYAWAN PAK RESTO UNIKOM</p>
        </table>
      </form>

    </div>
    {/* <p className="disclaimer">Font TF2 dan gayanya adalah sebuah trademark dan/atau registered trademark dari Valve Corporation. CSS website ini terinspirasi darinya.</p> */}
    <Outlet />
    </>
  );
}

export default Loginpage;
