const fs = require('fs');
const taskRouter = require('express').Router();
const tasksData = require('../data.json');
const taskValidator = require('../utils/validators/task-validator');

const validator = new taskValidator;

taskRouter.get('/', (req, res) => {
    res.status(200).json(tasksData);
})

taskRouter.get('/:id', (req, res) => {
    const id = req.params.id;
    if(!validator.checkId(id)) {
        res.json({
            "message": "Id can't be negative"
        });
    }
    const task = tasksData.filter((task) => task.id == id);
    if(task.length > 0) {
        res.status(200).json(task);
    } else {
        res.status(404).json({
            "message": "Task not found for this ID"
        })
    }
})

taskRouter.post('/', (req, res) => {
    const reqData = req.body;
    console.log(reqData);
    res.status(201).send('received');
})

taskRouter.put('/:id', (req, res) => {

})

taskRouter.delete('/:id', (req, res) => {

})

module.exports = taskRouter;
