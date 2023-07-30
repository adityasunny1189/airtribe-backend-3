const fs = require('fs');
const taskRouter = require('express').Router();
const tasksData = require('../data.json');
const taskValidator = require('../utils/validators/task-validator');

const validator = new taskValidator;

// [Status: ✅]
taskRouter.get('/', (req, res) => {
    res.status(200).json(tasksData);
})

taskRouter.get('/:id', (req, res) => {
    const id = req.params.id;
    if(!validator.checkId(id)) {
        res.status(400).json({
            "message": "Id can't be negative"
        });
    } else {
        const task = tasksData.filter((task) => task.id == id);
        if(task !== undefined || task.length !== 0) {
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

taskRouter.put('/:id', (req, res) => {

})

taskRouter.delete('/:id', (req, res) => {
    const id = req.params.id;
    if(!validator.checkId(id)) {
        res.status(400).json({
            "message": "Id can't be negative"
        })
    } else {
        const task = tasksData.filter((task) => task.id == id);
        if(task !== undefined || task.length !== 0) {
            const taskIndex = tasksData.indexOf(task[0]);
            tasksData.splice(taskIndex, 1);
            fs.writeFileSync('./data.json', JSON.stringify(tasksData));
            res.status(204).json({
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
