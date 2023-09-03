const fs = require('fs');
const taskRouter = require('express').Router();
const tasksData = require('../data.json');
const taskValidator = require('../utils/validators/task-validator');

const validator = new taskValidator;

// [Status: ✅]
taskRouter.get('/', (req, res) => {
    res.status(200).json(tasksData);
})

// [Status: ✅]
taskRouter.get('/:id', (req, res) => {
    const id = req.params.id;
    if(!validator.checkId(id)) {
        res.status(400).json({
            "message": "Id can't be negative"
        });
    } else {
        const task = tasksData.filter((task) => task.id == id);
        const taskIndex = tasksData.indexOf(task[0]);
        if(taskIndex !== -1) {
            res.status(200).json(task);
        } else {
            res.status(404).json({
                "message": "Task not found for this ID"
            })
        }
    }
})

// [Status: ✅]
taskRouter.post('/', (req, res) => {
    const newTask = req.body;
    if(!validator.checkTaskReqBody(newTask)) {
        res.status(400).json({
            "message": "Invalid task body",
            "task": newTask
        });
    } else {
        if(!validator.checkTaskDuplicateId(newTask, tasksData)) {
            res.status(400).json({
                "message": "Task id already present",
                "task": newTask
            });
        } else {
            tasksData.push(newTask);
            fs.writeFileSync('./data.json', JSON.stringify(tasksData));
            res.status(201).json({
                "message": "Task created successfully",
                "task": newTask
            });
        }
    }
})

// [Status: ✅]
taskRouter.put('/:id', (req, res) => {
    const updatedTask = req.body;
    const updatedTaskId = req.params.id;
    if(!validator.checkId(updatedTaskId)) {
        res.status(404).json({
            "message": "Invalid task id"
        });
    } else if(!validator.checkTaskReqBody(updatedTask)) {
        res.status(404).json({
            "message": "Invalid task body"
        });
    } else {
        const oldTaskData = tasksData.filter((task) => task.id == updatedTaskId);
        const taskIndex = tasksData.indexOf(oldTaskData[0]);
        if(taskIndex !== -1) {
            
            tasksData[taskIndex] = updatedTask;
            fs.writeFileSync('./data.json', JSON.stringify(tasksData));
            res.status(200).json({
                "message": "updated task data",
                "task": updatedTask
            })
        } else {
            res.status(404).json({
                "message": "Task not found"
            })
        }
    }
})

// [Status: ✅]
taskRouter.delete('/:id', (req, res) => {
    const id = req.params.id;
    if(!validator.checkId(id)) {
        res.status(400).json({
            "message": "Id can't be negative"
        })
    } else {
        const task = tasksData.filter((task) => task.id == id);
        const taskIndex = tasksData.indexOf(task[0]);
        if(taskIndex !== -1) {
            tasksData.splice(taskIndex, 1);
            fs.writeFileSync('./data.json', JSON.stringify(tasksData));
            res.status(200).json({
                "message": "Task deleted successfully"
            })
        } else {
            res.status(404).json({
                "message": "Invalid Id"
            })
        }
    }
})

module.exports = taskRouter;
