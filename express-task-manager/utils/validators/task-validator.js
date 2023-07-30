class TaskValidator {
    checkId(id) {
        if(id < 0) {
            return false;
        } 
        return true;
    }

    checkTaskReqBody(task) {

    }
}

module.exports = TaskValidator;
