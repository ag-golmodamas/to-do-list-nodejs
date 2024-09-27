import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

var tasks = {
    "work" : [],
    "day" : []
};

function Task(time, duration, activity, group){
    this.time = time;
    this.duration = duration;
    this.activity = activity;
    this.group = group;
    this.completed = false;
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.get("/", (req, res) => {
    res.render("index.ejs", {
        tasks: tasks
    });
});

app.post("/submit", (req, res) => {
    var taskName = req.body.taskName;
    var taskTime = req.body.taskTime;
    if(taskTime.includes("am")){
        taskTime = taskTime.slice(0,5);
        if(taskTime.slice(0, 2) == "12"){
            taskTime = "00" + taskTime.slice(2);
        } 
    } else {
        var pmhour = Number(taskTime.slice(0, 2)) + 12;
        if(taskTime.slice(0, 2) == "12"){
            pmhour = 12;
        }  
        taskTime = pmhour + taskTime.slice(2);
    }
    var taskDuration = req.body.taskDuration;
    var submitGroup = req.body.submitGroup; 

    var task = new Task(taskTime, taskDuration, taskName, submitGroup);
    
    if(task.activity != ""){
        tasks[submitGroup].push(task);
    }
    res.redirect("/");
});


app.post("/checkActivity", (req, res) => {
    var group = req.body.submitGroup;

    for(var i = 0; i < tasks[group].length; i++){
        if(req.body[tasks[group][i].activity] == "on"){
            tasks[group][i].completed = true;
        }
        else {
            tasks[group][i].completed = false;
        }
    }

    res.redirect("/");
})