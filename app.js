const express = require('express');
const app = express();
PORT = 3000;
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());

const { Client } = require('pg');

// configure database
const client = new Client({
  host: 'localhost',
  user: process.env.USER,
  port: 5432,
  password: process.env.PASSWORD,
  database: process.env.DBNAME,
});

try {
  client.connect();
  console.log('Connected to PostgreSQL');
} catch (error) {
  console.log('Error While Connecting' + error);
}

// READ
app.get('/read', (req, res) => {
  try {
    client.query(`SELECT * FROM employees`, (err, result) => {
      if (!err) {
        res.status(200).send({ data: result.rows });
        console.log(result.rows);
      } else {
        res.status(404).send({ Error: err.message });
        console.log(err.message);
      }
    });
  } catch (error) {
    res.send({
      msg: `Error While Reading / Viewing Data ${error}`,
    });
  }
});

// ADD
app.post('/add', (req, res) => {
  const { name, email } = req.body;
  try {
    client.query(
      'INSERT INTO employees (name, email) VALUES ($1,$2) RETURNING * ',
      [name, email],
      (err, result) => {
        if (err) res.status(404).send({ error: err });
        else
          res
            .status(200)
            .send({ msg: 'Insertion Successful', data: result.rows[0] });
      }
    );
  } catch (error) {
    res.status(404).send({
      msg: `Error While Inserting Data - ${error}`,
    });
  }
});

// DELETE
app.delete('/delete', (req, res) => {
  const { name } = req.body;
  try {
    client.query(
      'DELETE FROM employees WHERE name=$1',
      [name],
      (err, result) => {
        if (err) res.status(404).send({ error: err });
        else res.status(200).send({ msg: 'Delete Successful' });
      }
    );
  } catch (error) {
    res.status(404).send({
      msg: `Error While Deleting Data - ${error}`,
    });
  }
});

// UPDATE
app.put('/update', (req, res) => {
  const { name, email } = req.body;
  try {
    client.query(
      'UPDATE employees SET email=$2 WHERE name=$1 ',
      [name, email],
      (err, result) => {
        if (err) res.status(404).send({ error: err });
        else
          res
            .status(200)
            .send({ msg: 'Update Successful Using PUT', data: result.rows[0] });
      }
    );
  } catch (error) {
    res.status(404).send({
      msg: `Error While Updating Data - ${error}`,
    });
  }
});

// UPDATE USING PATCH
app.patch('/update', (req, res) => {
  const { name, email } = req.body;
  try {
    client.query(
      'UPDATE employees SET email=$2 WHERE name=$1 ',
      [name, email],
      (err, result) => {
        if (err) res.status(404).send({ error: err });
        else
          res.status(200).send({
            msg: 'Update Successful Using PATCH ',
            data: result.rows[0],
          });
      }
    );
  } catch (error) {
    res.status(404).send({
      msg: `Error While Updating Data - ${error}`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`server is started on ${PORT}`);
});
