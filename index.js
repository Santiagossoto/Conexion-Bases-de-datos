// index.js

// required external modules

import express from 'express'
import { getMySQLConnection } from './proy_modules/functions.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'


// app variables

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.PORT || "8001";

// app configuration

app.set("view engine","pug");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname, "public")));

// routes definitions

app.get("/", (req, res)=> {
    res.status(200).send("tienda CBA: Contactenos")
});

//server activaciob

app.listen(port, () =>{
    console.log(`El servidor esta Funcionanado en http://localhost:${port}`);
});


// to get collection of person saved in MySQL database

app.get('/contacto', function(req, res){
    var contactList = [];

    // connect to MySQL database 
    const connection = getMySQLConnection();
    connection.connect(function(err){
        if (err) {
            console.error('error connecting:  ' + err.stack);
            return;
        }
        console.log('connected as id: ' + connection.threadId);
    });
    
    // do the query to get data.
    connection.query('SELECT * FROM contactos ', function(err, rows, fields){
        if (err){
            res.status(500).json({"status_code" : 500, "status_message": "internal_server error"});
        } else{
            // loop check on each row
            for(var i = 0; i < rows.length; i++){

                // create un object to save current row¨s data
                var contact = {
                    'name':rows[i].name,
                    'address':rows[i].address,
                    'phone':rows[i].phone,
                    'id':rows[i].id,
                }
                // ad object intro array
                contactList.push(contact);

            }
            // render index.pug page using array
            res.render('index', {"contactList": contactList});
        }
    });

    // close the MySQL connection
    connection.end();
});


// to get specific data of person based on their identifier.
app.get('/contacto/:id',  function(req, res){
    // contact to MySQL database.
    var connection = getMySQLConnection();
    connection.connect();

    // do the querry to get data
    connection.query('SELECT * FROM contactos WHERE id =' + req.params.id, function(err, rows, fields){
        var contact;

        if (err) {
            res.status(500).json({"status_code": 500,"statusa_message":"internal server error"});
        } else {
            // check if the result is found or not
            if (rows.length==1) {
                // create the objet to save the data
                var contact = {
                   'name':rows[0].name,
                    'address':rows[0].address,
                    'phone':rows[0].phone,
                    'id':rows[0].id, 
                }
                // render the details.plug page
                res.render('details',{"contact":contact});
            } else {
             res.status(404).json({"status_code":404, "status_message": "Not found"}); 
            }
        }
    });

    // close MySQL connection
    connection.end();
})