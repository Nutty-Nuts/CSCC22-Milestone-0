const express = require("express");
const pool = require("./database.js");

const port = 3000;
const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({ message: "Server received a GET request" });
});

app.get("/todos", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM todos");
    res.status(200).send(data.rows);
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

app.post("/", async (req, res) => {
  res.status(200).send({ message: "Server received a POST request" });
});

app.post("/add", async (req, res) => {
  try {
    const { title, description } = req.body;
    await pool.query(
      "INSERT INTO todos ( title, description, status ) VALUES ($1, $2, $3)",
      [title, description, false],
    );
    console.log(`Received: {title: ${title}, description: ${description}}`);
    res.status(200).send({ message: "Created a Task." });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

app.post("/init", async (req, res) => {
  try {
    await pool.query(
      "CREATE TABLE IF NOT EXISTS todos (id SERIAL PRIMARY KEY, title VARCHAR(255), description VARCHAR(255), status BOOLEAN)",
    );
    res.status(200).send({ message: "Server received a POST request" });
  } catch (error) {
    res.status(500).send({ error: error, message: "Cannot create table." });
  }
});

app.put("/", async (req, res) => {
  res.status(200).send({ message: "Server received a PUT request" });
});

app.delete("/", async (req, res) => {
  res.status(200).send({ message: "Server received a DELETE request" });
});

app.listen(port, () => console.log(`Server is listening in port ${port}`));
