//      Tutorial menjalankan
//      Ganti ke directory folder yang tepat, contohnya:
//      cd C:\Users\ACER\Documents\react\rpl\website\backend
//      node websitenode.js
//      cd C:\Users\ACER\Documents\react\rpl\website
//      npm start

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loginpage from "./Loginpage.js";
import AdminHomepage from "./admin_homepage.js";
import AdminWaiterList from "./admin_waiter_list.js";
import AdminAddWaiter from "./admin_add_waiter.js";
import AdminEditWaiter from "./admin_edit_waiter.js";
import AdminChefList from "./admin_chef_list.js";
import AdminAddChef from "./admin_add_chef.js";
import AdminEditChef from "./admin_edit_chef.js";
import AdminCashierList from "./admin_cashier_list.js";
import AdminAddCashier from "./admin_add_cashier.js";
import AdminEditCashier from "./admin_edit_cashier.js";
import AdminUserList from "./admin_user_list.js";
import AdminAddUser from "./admin_add_user.js";
import AdminEditUser from "./admin_edit_user.js";
import ChefHomepage from "./chef_homepage.js";
import ChefMenuList from "./chef_menu_list.js";
import ChefAddMenu from "./chef_add_menu.js";
import ChefEditMenu from "./chef_edit_menu.js";
import ChefOrderStatus from "./chef_order_status.js";
import CashierOrderList from "./cashier_order_list.js";
import CashierOrderDetails from "./cashier_order_details.js";
import CashierMakeReports from "./cashier_make_reports.js";
import CustomerOrder from "./customer_order.js";
import WaiterOrder from "./waiter_order.js";
import WaiterOrderStatus from "./waiter_order_status.js";
import Forbidden from "./forbidden.js";
// import reportWebVitals from './reportWebVitals';

const backendUrl = "https://tubesrpl1.onrender.com";
export { backendUrl };

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route index element={ <Loginpage />} />
        <Route path="admin_homepage" element={ <AdminHomepage />} />
        <Route path="admin_waiter_list" element={ <AdminWaiterList />} />
        <Route path="admin_add_waiter" element={ <AdminAddWaiter />} />
        <Route path="admin_edit_waiter" element={ <AdminEditWaiter />} />
        <Route path="admin_chef_list" element={ <AdminChefList />} />
        <Route path="admin_add_chef" element={ <AdminAddChef />} />
        <Route path="admin_edit_chef" element={ <AdminEditChef />} />
        <Route path="admin_cashier_list" element={ <AdminCashierList />} />
        <Route path="admin_add_cashier" element={ <AdminAddCashier />} />
        <Route path="admin_edit_cashier" element={ <AdminEditCashier />} />
        <Route path="admin_user_list" element={ <AdminUserList />} />
        <Route path="admin_add_user" element={ <AdminAddUser />} />
        <Route path="admin_edit_user" element={ <AdminEditUser />} />
        <Route path="chef_homepage" element={ <ChefHomepage />} />
        <Route path="chef_menu_list" element={ <ChefMenuList />} />
        <Route path="chef_add_menu" element={ <ChefAddMenu />} />
        <Route path="chef_edit_menu" element={ <ChefEditMenu />} />
        <Route path="chef_order_status" element={ <ChefOrderStatus />} />
        <Route path="cashier_order_list" element={ <CashierOrderList />} />
        <Route path="cashier_order_details" element={ <CashierOrderDetails />} />
        <Route path="cashier_make_reports" element={ <CashierMakeReports />} />
        <Route path="customer_order" element={ <CustomerOrder />} />
        <Route path="waiter_order" element={ <WaiterOrder />} />
        <Route path="waiter_order_status" element={ <WaiterOrderStatus />} />
        <Route path="forbidden" element={ <Forbidden />} />
        <Route path="*" element={ <Loginpage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
