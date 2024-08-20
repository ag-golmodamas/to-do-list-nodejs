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

function Task(day, time, activity, group){
    this.day = day;
    this.time = time;
    this.activity = activity;
    this.group = group;
    this.completed = false;
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.get("/", (req, res) => {
    res.render("index.ejs", {
        work: tasks["work"],
        day: tasks["day"]
    });
});

app.get("/index.ejs", (req, res) => {
    res.render("index.ejs", {
        work: tasks["work"],
        day: tasks["day"]
    });
})

app.post("/submit", (req, res) => {
    var taskName = req.body.taskName;
    var taskDay = req.body.taskDay;
    var taskTime = req.body.taskTime;
    var submitGroup = req.body.submitGroup; 

    var task = new Task(taskDay, taskTime, taskName, submitGroup);
    
    tasks[submitGroup].push(task);

    res.render("index.ejs", {
        work: tasks["work"],
        day: tasks["day"]
    });
});

app.post("/checkActivity", (req, res) => {
    console.log("POST is working")
    var group = req.body.submitGroup;

    for(var i = 0; i < tasks[group].length; i++){
        if(req.body[tasks[group][i].activity] == "on"){
            tasks[group][i].completed = true;
        }
        else {
            tasks[group][i].completed = false;
        }
    }

    res.render("index.ejs", {
        work: tasks["work"],
        day: tasks["day"]
    });

})