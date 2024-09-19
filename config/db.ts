import mysql from 'mysql2';

// Configura tus credenciales de base de datos
const connection = mysql.createConnection({
  host: 'localhost',    
  user: 'root',         
  password: 'root', 
  database: 'salex-db'  
});

// Conéctate a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos como id ' + connection.threadId);
});

export default connection;
