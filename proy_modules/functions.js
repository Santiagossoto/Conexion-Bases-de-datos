import mysql from 'mysql2'

const getMySQLConnection = () =>{
    return mysql.createConnection({
        host            : 'localhost',
        port            :  3306,
        user            : 'root',
        password        : '1234', //  define your password
        database        : 'clientes', // define your database
        insecureAuth    : true
    });
}

export{
    getMySQLConnection
}