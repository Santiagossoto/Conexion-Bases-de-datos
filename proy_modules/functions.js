import mysql from 'mysql2'; // Importa el módulo mysql2 para conectarse a bases de datos MySQL

// Función para crear una conexión MySQL
const getMySQLConnection = () => {
    return mysql.createConnection({
        host            : 'localhost',  // El host donde está alojada la base de datos (localhost para local)
        port            :  3306,        // El puerto en el que se ejecuta MySQL (3306 es el puerto predeterminado)
        user            : 'root',       // El usuario de la base de datos (aquí 'root' es el usuario predeterminado)
        password        : '1234',       // La contraseña para el usuario de la base de datos (debes cambiarla por la real)
        database        : 'clientes2',  // El nombre de la base de datos con la que te vas a conectar
        insecureAuth    : true          // Opción para permitir conexiones con autenticación insegura (no recomendada)
    });
}

export {
    getMySQLConnection // Exporta la función para poder usarla en otros módulos
};
