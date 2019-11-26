const express = require("express");
const serverlessHttp = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/tasks", function (request, response) {
// get all the tasks from the database
response.status(200).send("You requested all the tasks!!!")
})

app.delete("/tasks/:taskId", function (request, response) {
  // delete the task with the given ID from the database
  const taskId = request.params.taskId;
  response.status(200).send(`Successfully deleted task ${taskId}`)
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
    response.status(205).send(`Successfully updated task ${taskId}`)
  })

module.exports.tasks = serverlessHttp(app); 