const express = require("express");
const BodyParser = require("body-parser");
const Date = require(__dirname + "/date.js");
const _ = require("lodash");

const mongoose = require("mongoose");

const app = express();
const port = 3000;
mongoose.connect("mongodb://localhost:27017/toDoDB");

app.set("view engine", "ejs");
app.use(BodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
const ListSchema = new mongoose.Schema({
  name: String,
  tasks: [taskSchema],
});

// Database
const Task = mongoose.model("Task", taskSchema);
const List = mongoose.model("List", ListSchema);

const Task1 = new Task({
  name: "Welcome to The To-Do List",
});

const Task2 = new Task({
  name: "Hit + to Create a new Task.",
});

const Task3 = new Task({
  name: "Hit the Check Box to mark it completed.",
});
const defTask = [Task1, Task2, Task3];

// Routes //
app.get("/", function (req, res) {
  let day = Date.getDate();
  Task.find(function (err, tasks) {
    if (err) {
      console.log(err);
    } else if (tasks.length == 0) {
      Task.insertMany(defTask, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Added Default Items");
        }
      });
    } else {
      res.render("list", { listTitle: "Today", AllTask: tasks });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/:listName", function (req, res) {
  const ListName = _.capitalize(req.params.listName);
  List.findOne({ name: ListName }, function (err, results) {
    if (!err) {
      if (!results) {
        const list = new List({
          name: ListName,
          tasks: defTask,
        });
        list.save();
        res.redirect("/" + ListName);
      } else {
        res.render("list", { listTitle: ListName, AllTask: results.tasks });
      }
    } else {
      console.log(err);
    }
  });
});

//Post Requests
app.post("/", function (req, res) {
  const task = req.body.TaskDesc;
  const listName = req.body.submit;

  const newTask = new Task({ name: task });

  if (listName == "Today") {
    console.log("Default List");
    newTask.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      if (err) {
        console.log(err);
      } else {
        foundList.tasks.push(newTask);
        foundList.save();
        res.redirect("/" + listName);
      }
    });
  }
});

app.post("/delete", function (req, res) {
  const checkedTask = req.body.checkbox;
  const listName = req.body.listName;
  console.log(req.body);

  if (listName === "Today") 
  {
    Task.findByIdAndDelete(checkedTask, function (err) {
      if (err) 
      {
        console.log(err);
      } else 
      {
        console.log("deleted Task" + checkedTask);
        res.redirect("/");
      }
    });
  }
  else
  {
    List.findOneAndUpdate({name:listName} , {$pull: {tasks: {_id:checkedTask}}} , function(err,foundList)
    {
      if (!err)
      {
        res.redirect("/"+listName);
      }
      else
      {
        console.log("Got an err"+err);
      }
    });
  }
});

//Choose Port
app.listen(port, function () {
  console.log("Server Running on " + port);
});

// mongoose.connection.close()
