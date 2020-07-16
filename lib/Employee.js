//creating Employee class which takes 3 parameters name, id and email
class Employee {
    constructor(name,id,email) {
        this.name = name;
        this.id = id;
        this.email = email;
    }
    getName () {
        return this.name;
    }
    getId () {
        return this.id;
    }
    getEmail () {
        return this.email;
    }
    getRole () {
        return "Employee";
    }
}

//exporting Employee class
module.exports = Employee;