//      C:\Users\ACER\Documents\react\rpl\website\backend node websitenode.js
//      C:\Users\ACER\Documents\react\rpl\website npm start
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const port = 8082;
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const crypto = require('crypto');

let userdata = {};

app.use(cors());

const con = mysql.createConnection({
    host: "localhost",
    port: "3307",
    user: "smpru_user",
    password: "password_untuk_smpru",
    database: "smpru"
});

app.use(multer().array());
app.use(express.json());
 
app.use(bodyParser.json());
 
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());

dotenv.config();

function generateAccessToken(identifier) {
    return jwt.sign(identifier, `${process.env.TOKEN_SECRET}`, { expiresIn: '86400s' });
}

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if(token == null) {
        return res.status(401).json({
            message: "Anda harus login untuk melakukan ini."
        });
    }
    else {
        jwt.verify(token, `${process.env.TOKEN_SECRET}`.toString(), (err, user) => {
            if(err) {
                console.log(err);
                return res.status(403).json({
                    message: "Login salah."
                });
            }
            else {
                req.user = user;
                //console.log(user);
                //console.log(user.identifier);
                const sqlQueryCheckUserIdFromEmail = "SELECT id_user FROM user WHERE email = '" + user.identifier + "'";
                con.query(sqlQueryCheckUserIdFromEmail, (err, rows) => {
                    //console.log(rows[0]);
                    if(rows[0]) {
                        req.userid = rows[0].userid;
                        //console.log(req.userid);
                        next();
                    }
                    else {
                        return res.status(403).json({
                            message: "Error!"
                        });
                    }
                });
                
            }
        });
    }
}

// Handling Errors
app.use((err, req, res, next) => {
    // console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      message: err.message,
    });
});

app.post('/login', (req, res) => {
    if(req.body.email && req.body.password) {
        userdata = {
            email: req.body.email,
            password: req.body.password
        };
        //const identifierToUse = userdata.email; // + userdata.username;
        const sqlQueryCheckUserPassword = "SELECT password, id_pelayan, id_koki, id_kasir, status FROM user WHERE email = '" + userdata.email + "'";
        con.query(sqlQueryCheckUserPassword, (err, rows) => {
            if(err) {
                res.sendStatus(403);
            }
            else {
                let hashedPassword = crypto.createHash('md5').update(userdata.password).digest('hex');
                // console.log(rows[0]);
                // console.log(rows[0].id_pelayan);
                // console.log(rows[0].id_koki);
                // console.log(rows[0].id_kasir);
                let roleName = "";
                let redirectTarget = "";
                if(rows[0].status == "ADMINISTRATOR") {
                    roleName = "administrator";
                    redirectTarget = "admin_homepage";
                }
                else if(rows[0].id_pelayan != null) {
                    roleName = "pelayan";
                    redirectTarget = "waiter_order";
                }
                else if(rows[0].id_koki != null) {
                    roleName = "koki";
                    redirectTarget = "chef_homepage";
                }
                else if(rows[0].id_kasir != null) {
                    roleName = "kasir";
                    redirectTarget = "cashier_order_list";
                }
                if(rows[0]) {
                    if(hashedPassword == rows[0].password ) {
                        const token = generateAccessToken({ identifier: userdata.email });
                        res.status(200).json({
                            token: token,
                            loginsuccess: true,
                            role: roleName,
                            redirect: redirectTarget,
                            email: userdata.email,
                            message: "Login sukses!"
                        });
                    }
                    else {
                        res.status(400).json({
                            loginsuccess: false,
                            message: "Email atau password salah"
                        });
                    }
                }
                else {
                    //console.log("This also got triggered");
                    res.status(400).json({
                        loginsuccess: false,
                        message: "Email tidak ditemukan"
                    });
                }
            }
        });
    }
    else {
        res.status(400).json({
            loginsuccess: false,
            message: "Mohon mengisi semua kolom"
        });
    }
});

app.get('/login', (req, res) => {
    //console.log("Detected GET request at /register");
    res.status(200).json({
        message: "Pakai post method disini :>",
        loginsuccess: false
        //token: token
    });
});

app.get('/testlogin',  authenticateToken, (req, res) => {
    res.status(200).json({
        message: "Login dengan token sukses.",
        userid: req.userid
    });
});

app.get('/viewtable', (req, res) => {

    let sqlQueryToUse = "SELECT * FROM `menu` ORDER BY status_ketersediaan DESC LIMIT 200";
    
    const tableToView = req.query.table;

    if(tableToView == 2) {
        sqlQueryToUse = "SELECT * FROM pelayan ORDER BY status ASC LIMIT 200";
    }
    else if(tableToView == 3) {
        sqlQueryToUse = "SELECT * FROM koki ORDER BY status ASC LIMIT 200";
    }
    else if(tableToView == 4) {
        sqlQueryToUse = "SELECT * FROM kasir ORDER BY status ASC LIMIT 200";
    }
    else if(tableToView == 5) {
        sqlQueryToUse = "SELECT user.id_user, user.id_pelayan, user.id_koki, user.id_kasir, user.email, user.password, user.status, pelayan.nama_pelayan, koki.nama_koki, kasir.nama_kasir FROM `user` LEFT JOIN pelayan ON user.id_pelayan = pelayan.id_pelayan LEFT JOIN koki ON user.id_koki = koki.id_koki LEFT JOIN kasir ON user.id_kasir = kasir.id_kasir ORDER BY id_user ASC LIMIT 200";
    }
    else if(tableToView == 6) {
        sqlQueryToUse = "SELECT id_pelayan AS id_karyawan, nama_pelayan AS nama_karyawan FROM pelayan ORDER BY nama_pelayan ASC LIMIT 200";
    }
    else if(tableToView == 7) {
        sqlQueryToUse = "SELECT id_koki AS id_karyawan, nama_koki AS nama_karyawan FROM koki ORDER BY nama_koki ASC LIMIT 200";
    }
    else if(tableToView == 8) {
        sqlQueryToUse = "SELECT id_kasir AS id_karyawan, nama_kasir AS nama_karyawan FROM kasir ORDER BY nama_kasir ASC LIMIT 200";
    }
    else if(tableToView == 9) {
        sqlQueryToUse = "SELECT id_user AS id_karyawan, status AS nama_karyawan FROM user WHERE status = 'ADMINISTRATOR' LIMIT 10";
    }
    else if(tableToView == 10) {
        sqlQueryToUse = "SELECT item_pesanan.id_pesanan, item_pesanan.id_menu, pesanan.nomor_meja, menu.nama_menu, item_pesanan.jumlah, item_pesanan.siap_disajikan FROM item_pesanan INNER JOIN pesanan ON pesanan.id_pesanan = item_pesanan.id_pesanan INNER JOIN menu ON menu.id_menu = item_pesanan.id_menu ORDER BY siap_disajikan ASC LIMIT 200";
    }
    else if(tableToView == 11) {
        sqlQueryToUse = "SELECT item_pesanan.id_pesanan, item_pesanan.id_menu, pesanan.nomor_meja, menu.nama_menu, item_pesanan.jumlah, item_pesanan.siap_disajikan FROM item_pesanan INNER JOIN pesanan ON pesanan.id_pesanan = item_pesanan.id_pesanan INNER JOIN menu ON menu.id_menu = item_pesanan.id_menu WHERE item_pesanan.siap_disajikan != 'Telah Disajikan' ORDER BY siap_disajikan DESC LIMIT 200";
    }
    else if(tableToView == 12) {
        sqlQueryToUse = "SELECT item_pesanan.id_pesanan, pesanan.nomor_meja, pesanan.tanggal_dipesan, pesanan.status_pembayaran, pesanan.nama_pelanggan, SUM(menu.harga * item_pesanan.jumlah) AS total_harga FROM item_pesanan INNER JOIN menu ON menu.id_menu = item_pesanan.id_menu INNER Join pesanan ON item_pesanan.id_pesanan = pesanan.id_pesanan GROUP BY id_pesanan;";
    }
    else if(tableToView == 13) {
        sqlQueryToUse = "SELECT item_pesanan.id_pesanan, item_pesanan.id_menu, pesanan.nomor_meja, menu.nama_menu, menu.harga, item_pesanan.jumlah, menu.harga * jumlah AS subtotal FROM item_pesanan INNER JOIN pesanan ON pesanan.id_pesanan = item_pesanan.id_pesanan INNER JOIN menu ON menu.id_menu = item_pesanan.id_menu WHERE item_pesanan.id_pesanan = " + req.query.id;
    }
    else if(tableToView == 14) {
        sqlQueryToUse = "SELECT item_pesanan.id_pesanan, pesanan.nomor_meja, pesanan.tanggal_dipesan, pesanan.status_pembayaran, pesanan.nama_pelanggan, SUM(menu.harga * item_pesanan.jumlah) AS total_harga FROM item_pesanan INNER JOIN menu ON menu.id_menu = item_pesanan.id_menu INNER Join pesanan ON item_pesanan.id_pesanan = pesanan.id_pesanan WHERE tanggal_dipesan <= '"+req.query.end_date+"' AND tanggal_dipesan >= '"+req.query.start_date+"' AND status_pembayaran = 'Sudah Dibayar' GROUP BY id_pesanan;";
        //console.log(sqlQueryToUse);
    }

    con.query(sqlQueryToUse, (err, rows) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        if (rows) {
            //if(tableToView == 14) console.log(rows);
            res.status(200).json(rows);
        }
    });
});

app.get('/viewentry', (req, res) => {

    let sqlQueryToUse = "SELECT * FROM menu WHERE id_menu = " + req.query.id;
    
    const tableToView = req.query.table;

    if(tableToView == 2) {
        sqlQueryToUse = "SELECT nama_pelayan, tanggal_diterima, status FROM pelayan WHERE id_pelayan = " + req.query.id;
    }
    else if(tableToView == 3) {
        sqlQueryToUse = "SELECT nama_koki, tanggal_diterima, status FROM koki WHERE id_koki = " + req.query.id;
    }
    else if(tableToView == 4) {
        sqlQueryToUse = "SELECT nama_kasir, tanggal_diterima, status FROM kasir WHERE id_kasir = " + req.query.id;
    }
    else if(tableToView == 5) {
        switch(req.query.peran) {
            case "pelayan":
                sqlQueryToUse = "SELECT id_pelayan AS id_karyawan, email, status FROM `user` WHERE id_user = " + req.query.id;
                break;
            case "koki":
                sqlQueryToUse = "SELECT id_koki AS id_karyawan, email, status FROM `user` WHERE id_user = " + req.query.id;
                break;
            case "kasir":
                sqlQueryToUse = "SELECT id_kasir AS id_karyawan, email, status FROM `user` WHERE id_user = " + req.query.id;
                break;
            case "administrator":
                sqlQueryToUse = "SELECT id_user AS id_karyawan, email, status FROM `user` WHERE id_user = " + req.query.id;
                break;
            default:
                break;
        }
        
    }
    else if(tableToView == 6) {
        sqlQueryToUse = "SELECT pesanan.tanggal_dipesan, pesanan.nomor_meja, pesanan.nama_pelanggan, pesanan.status_pembayaran, SUM(item_pesanan.jumlah * menu.harga) AS total_harga FROM pesanan INNER JOIN item_pesanan ON item_pesanan.id_pesanan = pesanan.id_pesanan INNER JOIN menu ON item_pesanan.id_menu = menu.id_menu WHERE pesanan.id_pesanan = " + req.query.id;
    }
    

    con.query(sqlQueryToUse, (err, rows) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        if (rows) {
            // console.log(rows);
            if(tableToView == 2 || tableToView == 3 || tableToView == 4) {
                const day = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(rows[0].tanggal_diterima);
                const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(rows[0].tanggal_diterima);
                const year = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(rows[0].tanggal_diterima);
                rows[0].tanggal_diterima = `${day}-${month}-${year}`;
            }
            if(tableToView == 5) {
                rows[0].peran = req.query.peran;
            }
            //console.log(rows[0]);
            res.status(200).json(rows[0]);
        }
    });
});

app.post('/users', function(req, res) {
    console.log(req.body);
    let user_id = req.body.id;
  
    res.send({
      'user_id': user_id
    });
  });

app.post('/order', (req, res) => {
    
    const order_list = req.body.order_list;
    const order_details = req.body.order_details;

    let sqlQueryOrder = "INSERT INTO pesanan (nomor_meja, nama_pelanggan, tanggal_dipesan, status_pembayaran) VALUES ('"+ order_details.nomor_meja +"', '" + order_details.nama_pelanggan + "', '" + req.body.order_date + "', '" + "Belum Dibayar" + "')";
    let orderId = 0;
    con.query(sqlQueryOrder, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Error!", error: 1 });
            return;
        }
        else {
            orderId = rows.insertId;
            // console.log(orderId);
            res.status(200).json({ message: "Pesanan telah dibuat!", error: 2 });
            for(const [key, value] of Object.entries(order_list)) {
                let sqlQueryOrderItems = "INSERT INTO item_pesanan (id_pesanan, id_menu, jumlah, subtotal, siap_disajikan) VALUES ("+ orderId +", "+ key +", "+ value +", 0, 'Belum Siap')";
                con.query(sqlQueryOrderItems);
            }
        }
    });

    
    
});

app.post('/mark_order_ready', authenticateToken, (req, res) => {
    
    const id_menu = req.body.id_menu;
    const id_pesanan = req.body.id_pesanan;
    const status = req.body.status;

    let sqlQueryToUse = "UPDATE item_pesanan SET siap_disajikan = '"+ status +"' WHERE id_menu = " + id_menu + " AND id_pesanan = " + id_pesanan;
    con.query(sqlQueryToUse, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(400).json({ msg: "Gagal. Error tidak diketahui.", success: 1 });
        }
        else {
            res.status(200).json({ msg: "Status pesanan telah diperbarui.", success: 2 });
        }
    });
});

app.post('/mark_order_paid', authenticateToken, (req, res) => {
    
    const id_pesanan = req.body.id_pesanan;

    let sqlQueryToUse = "UPDATE pesanan SET status_pembayaran = 'Sudah Dibayar' WHERE id_pesanan = " + id_pesanan;
    con.query(sqlQueryToUse, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(400).json({ message: "Gagal. Error tidak diketahui.", error: 1 });
        }
        else {
            res.status(200).json({ message: "Status pembayaran telah diperbarui.", error: 2 });
        }
    });
});

app.post('/addmenudata', authenticateToken, (req, res) => {
    
    const nama_menu = req.body.nama_menu;
    const harga = req.body.harga;
    const status_ketersediaan = req.body.status_ketersediaan;

    let sqlQueryToUse = "INSERT INTO menu (nama_menu, harga, status_ketersediaan) VALUES ('"+ nama_menu +"', '" + harga + "', '" + status_ketersediaan + "')";
    con.query(sqlQueryToUse, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(400).json({ msg: "Gagal. Error tidak diketahui.", success: 1 });
        }
        else {
            res.status(200).json({ msg: "Data menu telah disimpan.", success: 2 });
        }
    });
});

app.post('/editmenudata', authenticateToken, (req, res) => {
    
    const nama_menu = req.body.nama_menu;
    const harga = req.body.harga;
    const status_ketersediaan = req.body.status_ketersediaan;

    let sqlQueryToUse = "UPDATE menu SET nama_menu = '"+ nama_menu +"', harga = '" + harga + "', status_ketersediaan = '" + status_ketersediaan + "' WHERE id_menu = " + req.query.id;
    con.query(sqlQueryToUse, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(400).json({ msg: "Gagal. Error tidak diketahui.", success: 1 });
        }
        else {
            res.status(200).json({ msg: "Data menu telah diedit.", success: 2 });
        }
    });
});

app.post('/deletemenudata', authenticateToken, (req, res) => {
    const menuIdToDelete = req.body.menuIdToDelete;
    let rowThatMatchesWithMenuId = -1;
    const sqlQuerySelect = "SELECT * FROM menu";
    con.query(sqlQuerySelect, (err, rows) => {
        for(i in rows) {
            if(menuIdToDelete == rows[i].id_menu) {
                console.log("Menu cocok ditemukan");
                rowThatMatchesWithMenuId = i;
                break;
            }
        }
        if(rowThatMatchesWithMenuId == -1) {
            console.log("Tidak ada menu yang ditemukan dengan id tersebut!");
        }
        else {
            const sqlQueryDelete = "DELETE FROM menu WHERE id_menu = " + menuIdToDelete;
            con.query(sqlQueryDelete);
            res.status(200).json({
                message: "Menu sukses dihapuskan.",
                err: false
            });
        }
        if (err) {
            res.status(500).json({
                message: "Error tidak diketahui.",
                err: true
            });
        }
        else if(rowThatMatchesWithMenuId == -1) {
            res.status(400).json({
                message: "Tidak ditemukan menu dengan ID tersebut.",
                err: false
            });
        }
    });
});

app.post('/addwaiterdata', authenticateToken, (req, res) => {
    
    const nama_pelayan = req.body.nama_pelayan;
    const tanggal_diterima = req.body.tanggal_diterima;
    const status = req.body.status;

    let sqlQueryToUse = "INSERT INTO pelayan (nama_pelayan, tanggal_diterima, status) VALUES ('"+ nama_pelayan +"', '" + tanggal_diterima + "', '" + status + "')";
    con.query(sqlQueryToUse, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(400).json({ msg: "Gagal. Error tidak diketahui.", success: 1 });
        }
        else {
            res.status(200).json({ msg: "Data pelayan telah disimpan.", success: 2 });
        }
    });
});

app.post('/editwaiterdata', authenticateToken, (req, res) => {
    
    const nama_pelayan = req.body.nama_pelayan;
    const tanggal_diterima = req.body.tanggal_diterima;
    const status = req.body.status;

    let sqlQueryToUse = "UPDATE pelayan SET nama_pelayan = '"+ nama_pelayan +"', tanggal_diterima = '" + tanggal_diterima + "', status = '" + status + "' WHERE id_pelayan = " + req.query.id + "";
    con.query(sqlQueryToUse, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(400).json({ msg: "Gagal. Error tidak diketahui.", success: 1 });
        }
        else {
            res.status(200).json({ msg: "Data pelayan telah diedit.", success: 2 });
        }
    });
});

app.post('/addchefdata', authenticateToken, (req, res) => {
    
    const nama_koki = req.body.nama_koki;
    const tanggal_diterima = req.body.tanggal_diterima;
    const status = req.body.status;

    let sqlQueryToUse = "INSERT INTO koki (nama_koki, tanggal_diterima, status) VALUES ('"+ nama_koki +"', '" + tanggal_diterima + "', '" + status + "')";
    con.query(sqlQueryToUse, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(400).json({ msg: "Gagal. Error tidak diketahui.", success: 1 });
        }
        else {
            res.status(200).json({ msg: "Data koki telah disimpan.", success: 2 });
        }
    });
});

app.post('/editchefdata', authenticateToken, (req, res) => {
    
    const nama_koki = req.body.nama_koki;
    const tanggal_diterima = req.body.tanggal_diterima;
    const status = req.body.status;

    let sqlQueryToUse = "UPDATE koki SET nama_koki = '"+ nama_koki +"', tanggal_diterima = '" + tanggal_diterima + "', status = '" + status + "' WHERE id_koki = " + req.query.id + "";
    con.query(sqlQueryToUse, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(400).json({ msg: "Gagal. Error tidak diketahui.", success: 1 });
        }
        else {
            res.status(200).json({ msg: "Data koki telah diedit.", success: 2 });
        }
    });
});

app.post('/addcashierdata', authenticateToken, (req, res) => {
    
    const nama_kasir = req.body.nama_kasir;
    const tanggal_diterima = req.body.tanggal_diterima;
    const status = req.body.status;

    let sqlQueryToUse = "INSERT INTO kasir (nama_kasir, tanggal_diterima, status) VALUES ('"+ nama_kasir +"', '" + tanggal_diterima + "', '" + status + "')";
    con.query(sqlQueryToUse, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(400).json({ msg: "Gagal. Error tidak diketahui.", success: 1 });
        }
        else {
            res.status(200).json({ msg: "Data kasir telah disimpan.", success: 2 });
        }
    });
});

app.post('/editcashierdata', authenticateToken, (req, res) => {
    
    const nama_kasir = req.body.nama_kasir;
    const tanggal_diterima = req.body.tanggal_diterima;
    const status = req.body.status;

    let sqlQueryToUse = "UPDATE kasir SET nama_kasir = '"+ nama_kasir +"', tanggal_diterima = '" + tanggal_diterima + "', status = '" + status + "' WHERE id_kasir = " + req.query.id + "";
    con.query(sqlQueryToUse, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(400).json({ msg: "Gagal. Error tidak diketahui.", success: 1 });
        }
        else {
            res.status(200).json({ msg: "Data kasir telah diedit.", success: 2 });
        }
    });
});

app.post('/edituserdata', authenticateToken, (req, res) => {
    
    userdata = {
        peran: req.body.peran,
        id_karyawan: req.body.id_karyawan,
        email: req.body.email,
        status: req.body.status,
        password: req.body.password
    };

    let hashedPassword = crypto.createHash('md5').update(userdata.password).digest('hex');
    let sqlQueryToUse = "";
    switch(userdata.peran) {
        case "pelayan":
            sqlQueryToUse = "UPDATE user SET id_pelayan = '"+ userdata.id_karyawan +"', id_kasir = null, id_koki = null, email = '" + userdata.email + "', status = '" + userdata.status + "', password = '" + hashedPassword + "' WHERE id_user = " + req.query.id + "";
            break;
        case "koki":
            sqlQueryToUse = "UPDATE user SET id_koki = '"+ userdata.id_karyawan +"', id_kasir = null, id_pelayan = null, email = '" + userdata.email + "', status = '" + userdata.status + "', password = '" + hashedPassword + "' WHERE id_user = " + req.query.id + "";
            break;
        case "kasir":
            sqlQueryToUse = "UPDATE user SET id_kasir = '"+ userdata.id_karyawan +"', id_pelayan = null, id_koki = null, email = '" + userdata.email + "', status = '" + userdata.status + "', password = '" + hashedPassword + "' WHERE id_user = " + req.query.id + "";
            break;
        case "administrator":
            sqlQueryToUse = "UPDATE user SET id_kasir = null, id_pelayan = null, id_koki = null, email = '" + userdata.email + "', status = '" + userdata.status + "', password = '" + hashedPassword + "' WHERE id_user = " + req.query.id + "";
            break;
        default:
            sqlQueryToUse = "";
            break;
    }
    
    con.query(sqlQueryToUse, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(400).json({ msg: "Email sudah dipakai, atau karyawan sudah memiliki akun user.", success: 1 });
        }
        else {
            res.status(200).json({ msg: "Data user telah diedit.", success: 2 });
        }
    });
});

app.post('/adduserdata', (req, res) => {
    userdata = {
        peran: req.body.peran,
        id_karyawan: req.body.id_karyawan,
        email: req.body.email,
        status: req.body.status,
        password: req.body.password
    };
    //console.log("Detected POST request at /register");
    //console.log(userdata.password);
    let hashedPassword = crypto.createHash('md5').update(userdata.password).digest('hex');
    //console.log(hashedPassword);
    if(userdata.peran && userdata.id_karyawan && userdata.email && userdata.status && userdata.password) {
        if(userdata.peran == "administrator") {
            sqlQueryInsertUser = "INSERT INTO user (email, password, status) VALUES ('" + userdata.email + "', '" + hashedPassword + "' + 'ADMINISTRATOR')";
        }
        else {
            sqlQueryInsertUser = "INSERT INTO user (id_" + userdata.peran + ", email, status, password) VALUES ('" + userdata.id_karyawan + "', '" + userdata.email + "', '" + userdata.status + "', '" + hashedPassword + "')";
        }
        
        con.query(sqlQueryInsertUser, (err) => {
            if (err) {
                //console.log(err);
                res.status(400).json({
                    msg: "Email sudah dipakai, atau karyawan sudah memiliki email.",
                    success: 1
                });
            }
            else {
                res.status(200).json({
                    msg: "Sukses. User sekarang dapat login.",
                    success: 2
                    //token: token
                });
            }
        });
    // let token = jwt.sign(userdata, global.config.secretKey, {
    //     algorithm: global.config.algorithm,
    //     expiresIn: '1h'
    // });
    }
    else {
        
        res.status(400).json({
            msg: "Error tidak diketahui.",
            registersuccess: false
            //token: token
        });
    }
});

app.get('/adduserdata', (req, res) => {
    //console.log("Detected GET request at /register");
    res.status(200).json({
        message: "Gunakan post method disini",
        registersuccess: false
        //token: token
    });
});

app.listen(port, () => {
    console.log("Backend SMPRU berjalan!");
});