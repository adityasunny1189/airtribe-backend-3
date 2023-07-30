class TaskValidator {
    checkId(id) {
        if(id < 0) {
            return false;
        } 
        return true;
    }

    checkTaskReqBody(task) {
        const requiredProperties = ['id', 'title', 'description', 'flag'];
        const actualProperties = Object.keys(task);

        requiredProperties.forEach(prop => {
            if(!actualProperties.includes(prop)) {
                return false;
            }
        });

        if(
            typeof task.id !== 'number' || 
            typeof task.title !== 'string' || 
            typeof task.description !== 'string' || 
            typeof task.flag !== 'string'
        ) {
            return false;
        }
        return true;
    }

    checkTaskDuplicateId(task, tasks) {
        return tasks.filter((t) => t.id == task.id).length == 0;
    }
}

module.exports = TaskValidator;
