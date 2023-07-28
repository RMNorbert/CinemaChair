const express = require("express");
const mysql = require('mysql2');

const app = express();
const PORT = 8080;

app.use(express.json());
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'postgres',
  password: 'postgres',
  database: 'homework',
});

app.post("/customer", async (req, res) => {
  const values = [req.body.username, req.body.password]
  const sql = 'SELECT * FROM customer WHERE username = ? AND password = ?';
  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return;
    }
    const details = results;
    return res.json(details);
  });
});

app.post("/customer/register", async (req, res) => {
  const values = [req.body.username, req.body.password]
  const sql = 'INSERT INTO customer (username, password) VALUES (?, ?)';
  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return;
    }
    const details = results;
    return res.json(details);
  });
});


app.get("/allchairs", async (req, res) => {
  const sql = 'SELECT * FROM room';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return;
    }
    const chairs = results;
    return res.json(chairs);
  });
});


app.get("/chairs", async (req, res) => {
  const sql = 'SELECT * FROM room WHERE status = "free"';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return;
    }
    const availableChairs = results;
    return res.json(availableChairs);
  });
});


app.patch("/chairs/reserve/:id", async (req, res, next) => {
  const chairToUpdate = req.params.id;
  const newStatus = req.body.status;
  const currentStatus = "free";
  const values = [newStatus, chairToUpdate, currentStatus];
  const sql = 'UPDATE room SET status = ? WHERE chair = ? AND status = ?';
  
  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Failed to update status.' });
    }  
    return res.json({ message: 'Status updated successfully.' });
  });
});

app.patch("/chairs/status/:id", async (req, res, next) => {
  const chairToUpdate = req.params.id;
  const newStatus = req.body.status;
  const currentStatus = "reserved";
  const values = [newStatus, chairToUpdate, currentStatus];
  const sql = 'UPDATE room SET status = ? WHERE chair = ? AND status = ?';
  
  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Failed to update status.' });
    }  
    return res.json({ message: 'Status updated successfully.' });
  });
});

app.post("/chairs/reserve/:id", async (req,res, next)=>{
  const values = [req.body.customer, req.body.chair, req.body.email];
  const sql = 'INSERT INTO bookings (customer_id, chair, email) VALUES (?, ?, ?)';
  try{
    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return;
      }
      console.log('New booking registered successfully!');
      return res.json('New booking registered successfully!');
    });
  } catch(err){
    return next(err);
  }

})

function main() {
  try {
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        connection.end();
        process.exit(1);
      } else {
        console.log('Connected to the database!');
        app.listen(PORT, () => {
          console.log("App is listening on 8080");
          console.log("Try /chairs route right now");
        });
      }
    });
  } catch (err) {
    console.error(err);
    connection.end();
    process.exit(1);
  }
}
main();