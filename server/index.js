const express = require('express');
const app = express();
const { Pool } = require('pg');
const cors = require('cors');
const port = 3001;

app.use(cors({
    origin: 'https://crud-empleados-sand.vercel.app'
  }));

  
app.use(express.json());

const db = new Pool({
    host: 'db-empleados-crud.cz2wiggog8ns.us-east-2.rds.amazonaws.com',
    user: 'postgres',
    password: 'postgres',
    database: 'empleados_crud',
    port: 5432,
    ssl: { // Habilitar SSL para que se establezca la conexión segura con la base de datos
        rejectUnauthorized: false
      }
  });

db.connect((err) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
      return;
    }
    console.log('Conexión a la base de datos establecida');
  });  

app.post('/create', (req, res) => {
    const { nombre, edad, pais, cargo, anios } = req.body;
    db.query('INSERT INTO empleados (nombre, edad, pais, cargo, anios) VALUES ($1, $2, $3, $4, $5)', [nombre, edad, pais, cargo, anios],
        (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});


app.get('/empleados', (req, res) => {
    db.query('SELECT * FROM empleados', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows);
        }
    });
});

app.put('/update', (req, res) => {
    const { id, nombre, edad, pais, cargo, anios } = req.body;

    db.query('UPDATE empleados SET nombre = $2, edad = $3, pais = $4, cargo = $5, anios = $6 WHERE id = $1', [id, nombre, edad, pais, cargo, anios],
        (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM empleados WHERE id = $1', [id],
        (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});