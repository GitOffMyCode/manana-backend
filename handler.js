const express = require("express");
const serverlessHttp = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const process = require('process');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "Manana"
})

// handler.js - lambda function (serverless) - connects API to database
// if changed needs to be redeployed "serverless deploy"

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/tasks", (request, response) => {
  // get all the tasks from the database
  connection.query("SELECT * FROM Task", (err, data) => {
    if (err) {
      response.status(500).json({error: err});
    } else {
      response.status(200).json(data);
    }
  });
})

app.post("/tasks", (request, response) => {
  // create new task in the database
  const task = request.body;
  const q = "INSERT INTO Task SET ?";
  connection.query(q, task, err => {
    if (err) {
      response.status(500).json({error: err});
    } else {
      response.status(201).json(task);
    }
  });
})

app.delete("/tasks/:taskId", (request, response) => {
  // delete the task with the given ID from the database
  const taskId = request.params.taskId;
  // Escape user-provided values (sql injection attack)
  connection.query("DELETE from Task WHERE taskId = ?", [taskId], err => {
    if (err) {
      response.status(500).json({error: err});
    } else {
      response.sendStatus(200);
    }
  });
})

app.put("/tasks/:taskId", (request, response) => {
  // update a task with the given ID from the database
  const taskId = request.params.taskId;
  const q = "UPDATE Task SET completed = true WHERE taskId = ?";   
  connection.query(q, [taskId], err => {
    if (err) {
      response.status(500).json({error: err});
    } else {
      response.status(200).json({message: "Task Updated" });
    }
  })
})

module.exports.tasks = serverlessHttp(app); 