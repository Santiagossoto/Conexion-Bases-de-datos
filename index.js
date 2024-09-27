// index.js

// Requerir módulos externos
import express from 'express'; // Importa el módulo Express para crear la aplicación web
import { getMySQLConnection } from './proy_modules/functions.js'; // Importa una función para obtener la conexión a la base de datos MySQL
import path from 'path'; // Importa el módulo path para manejar rutas de archivos
import { fileURLToPath } from 'url'; // Importa fileURLToPath para convertir URL a ruta de archivo
import { dirname } from 'path'; // Importa dirname para obtener el directorio de un archivo

// Variables de la aplicación
const __filename = fileURLToPath(import.meta.url); // Obtiene el nombre del archivo actual
const __dirname = dirname(__filename); // Obtiene el directorio del archivo actual
const app = express(); // Crea una instancia de la aplicación Express
const port = process.env.PORT || "8001"; // Define el puerto en el que se ejecutará la aplicación, usando el valor de la variable de entorno o 8001

// Configuración de la aplicación
app.set("view engine", "pug"); // Configura Pug como motor de plantillas
app.set("views", path.join(__dirname, "views")); // Define la ruta de las vistas
app.use(express.static(path.join(__dirname, "public"))); // Sirve archivos estáticos desde la carpeta "public"

// Definición de rutas
app.get("/", (req, res) => { // Define la ruta raíz
    res.status(200).send("tienda CBA: Contactenos"); // Responde con un mensaje
});

// Activación del servidor
app.listen(port, () => { // Inicia el servidor en el puerto definido
    console.log(`El servidor esta Funcionanado en http://localhost:${port}`); // Imprime un mensaje en la consola
});

// Para obtener una colección de personas guardadas en la base de datos MySQL
app.get('/contacto', function(req, res) { // Define la ruta para obtener contactos
    var contactList = []; // Inicializa un arreglo para almacenar contactos

    // Conectar a la base de datos MySQL 
    const connection = getMySQLConnection(); // Obtiene la conexión a la base de datos
    connection.connect(function(err) { // Conecta a la base de datos
        if (err) { // Si hay un error al conectar
            console.error('error connecting:  ' + err.stack); // Imprime el error en la consola
            return; // Sale de la función
        }
        console.log('connected as id: ' + connection.threadId); // Imprime el ID de conexión
    });

    // Realiza la consulta para obtener los datos.
    connection.query('SELECT * FROM contactos', function(err, rows, fields) { // Realiza una consulta para seleccionar todos los contactos
        if (err) { // Si hay un error en la consulta
            res.status(500).json({"status_code" : 500, "status_message": "internal_server error"}); // Envía un error 500
        } else { // Si la consulta es exitosa
            // Bucle para verificar cada fila
            for (var i = 0; i < rows.length; i++) { // Itera sobre cada fila de resultados

                // Crea un objeto para guardar los datos de la fila actual
                var contact = {
                    'name': rows[i].nombre, // Asigna el nombre
                    'address': rows[i].direccion, // Asigna la dirección
                    'phone': rows[i].telefono, // Asigna el teléfono
                    'id': rows[i].id, // Asigna el ID
                }
                // Agrega el objeto al arreglo
                contactList.push(contact); // Añade el contacto al arreglo
            }
            // Renderiza la página index.pug utilizando el arreglo
            res.render('index', {"contactList": contactList}); // Envía la lista de contactos a la vista
        }
    });

    // Cierra la conexión a MySQL
    connection.end(); // Termina la conexión a la base de datos
});

// Para obtener datos específicos de una persona según su identificador.
app.get('/contacto/:id', function(req, res) { // Define la ruta para obtener un contacto específico por ID
    // Conectar a la base de datos MySQL.
    var connection = getMySQLConnection(); // Obtiene la conexión a la base de datos
    connection.connect(); // Conecta a la base de datos

    // Realiza la consulta para obtener datos
    connection.query('SELECT * FROM contactos WHERE id =' + req.params.id, function(err, rows, fields) { // Consulta para seleccionar un contacto por ID
        var contact; // Inicializa una variable para el contacto

        if (err) { // Si hay un error en la consulta
            res.status(500).json({"status_code": 500, "statusa_message": "internal server error"}); // Envía un error 500
        } else { // Si la consulta es exitosa
            // Verifica si se encontró el resultado o no
            if (rows.length == 1) { // Si se encontró un contacto
                // Crea el objeto para guardar los datos
                var contact = {
                    'name': rows[0].nombre, // Asigna el nombre
                    'address': rows[0].direccion, // Asigna la dirección
                    'phone': rows[0].telefono, // Asigna el teléfono
                    'id': rows[0].id, // Asigna el ID
                }
                // Renderiza la página details.pug
                res.render('details', {"contact": contact}); // Envía el contacto a la vista
            } else { // Si no se encontró el contacto
                res.status(404).json({"status_code": 404, "status_message": "Not found"}); // Envía un error 404
            }
        }
    });

    // Cierra la conexión a MySQL
    connection.end(); // Termina la conexión a la base de datos
});
