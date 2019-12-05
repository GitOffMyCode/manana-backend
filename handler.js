const express = require("express");
const serverlessHttp = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

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

app.get("/tasks", function (request, response) {
  // get all the tasks from the database
  connection.query("SELECT * FROM Task", function (err, data) {
    if (err) {
      response.status(500).json({error: err});
    } else {
      response.status(200).json(data);
    }
  });
})

app.delete("/tasks/:taskId", function (request, response) {
  // delete the task with the given ID from the database
  const taskId = request.params.taskId;
  // Escape user-provided values (sql injection attack)
  connection.query("DELETE from Task WHERE taskId = ?", [taskId], function (err) {
    if (err) {
      response.status(500).json({error: err});
    } else {
      response.sendStatus(200);
    }
  });
})

app.post("/tasks", function (request, response) {
  // create new task in the database
  const task = request.body;
  task.completed = false;
  const q = "INSERT INTO Task SET ?";
  connection.query(q, task, function (err, data) {
    if (err) {
      response.status(500).json({error: err});
    } else {
      task.taskId = data.insertId;
      response.status(201).json(task);
    }
  });
})

app.put("/tasks/:taskId", function (request, response) {
  // update a task with the given ID from the database
  const taskId = request.params.taskId;
  const q = "UPDATE Task SET completed = true WHERE taskId = ?";   
  connection.query(q, [taskId], function (err, data) {
    if (err) {
      response.status(500).json({error: err});
    } else {
      response.status(200).json({message: "Task Updated" });
    }
  })
})

module.exports.tasks = serverlessHttp(app); 