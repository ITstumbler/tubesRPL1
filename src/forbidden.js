import { Outlet, useNavigate } from "react-router-dom";
import './Loginpage.css';

function Forbidden() {

  const navigate = useNavigate();

  const goToLogin = (e) => {
    e.preventDefault();
    navigate("/", {state: {}})
  }

  return (
    <><div className="subtextnoaccount">Anda tidak memiliki izin untuk mengakses halaman ini</div>
    <button className="toprightnavbutton" onClick={goToLogin} >LOGIN</button>
    <Outlet />
    </>
  );
}

export default Forbidden;
