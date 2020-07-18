const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Array to hold the team members
const team = [];
//These are the choices displayed in CLI
const choices = ['Manager', 'Engineer', 'Intern', '-Done-'];

//This function is to validate that user added something when prompted
const validateInput = function(input){
    if(input === ''){
        return "Please add text to this field"
    }
    return true
};

//Prompts to add new team member
const questions = [
    {
        type: 'list',
        message: 'To add employee please select a value from the list',
        name: 'type',
        choices: choices
    },
    {
        type: 'input',
        message: "What is the name of the employee?",
        name: 'name',
        default: 'First Name Last Name',
        when: response => response.type !== '-Done-',
        validate: validateInput
    },
    {
        type: 'input',
        message: 'Please enter employee ID:',
        name: 'id',
        when: response => response.type !== '-Done-',
        validate: validateInput
    },
    {
        type: 'input',
        message: "Please enter employee's email:",
        name: 'email',
        default: 'employee@email.com',
        when: response => response.type !== '-Done-',
        validate: validateInput
    },
    {
        type: 'input',
        message: 'Please enter office number:',
        name: 'office',
        when: response => response.type !== '-Done-' && response.type === 'Manager',
        validate: validateInput
    },
    {
        type: 'input',
        message: 'Please enter GitHub username:',
        name: 'github',
        default: 'Username',
        when: response => response.type !== '-Done-' && response.type === 'Engineer',
        validate: validateInput
    },
    {
        type: 'input',
        message: 'Please enter school name:',
        name: 'school',
        default: 'School Name',
        when: response => response.type !== '-Done-' && response.type === 'Intern',
        validate: validateInput
    }
];

// If response is not '-Done-' logic will enter the if/else if blocks and call the prompt function again. If response= '-Done-' the output file will be generated. Once Manager is added the option will be deleted.
const renderQuestions = () => inquirer.prompt(questions).then(response => {
    if (response.type !== '-Done-') {
        if (response.type === 'Manager') {
            team.push(new Manager(response.name, response.id, response.email, response.office));
            choices.splice(0, 1)
        } else if (response.type === 'Engineer') {
            team.push(new Engineer(response.name, response.id, response.email, response.github));
        } else if (response.type === 'Intern') {
            team.push(new Intern(response.name, response.id, response.email, response.school));
        }
        renderQuestions();
        // render the team html and output to a file(if there is no output dir,then new one will be created, if output dir is present, then team.html will be updated.)
    } else {
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR);
        }
        fs.writeFile(outputPath, render(team), err => err ? console.log(err) : console.log(`Generated ${outputPath}`));
    }
});

// calling function prompt
renderQuestions();