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
});

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
  })
  
})

app.post("/tasks", function (request, response) {
  // create new task in the database
  const task = request.body;
  // {text: "do something", completed: false, dueDate: "2019-12-25"}
  response.status(201).send(`Successfully created ${task.text}`)
})

app.put("/tasks/:taskId", function (request, response) {
  // update a task with the given ID from the database
  const taskId = request.params.taskId;
  const task = request.body;
  // response.status(205).send(`Successfully updated task ${taskId} with "${task.text}"`);
  response.status(205).send(`Successfully updated task ${taskId} with ${JSON.stringify(task)}`);
})

module.exports.tasks = serverlessHttp(app); 