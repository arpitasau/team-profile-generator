const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
const team = [];
const choices = ['Manager', 'Engineer', 'Intern', '-Done-'];

const questions = [
    {
        type: 'list',
        message: 'Add Employee as-',
        name: 'type',
        choices: choices
    },
    {
        type: 'input',
        message: "Enter Employee's Name:",
        name: 'name',
        default: 'First Name Last Name',
        when: response => response.type !== '-Done-',
        validate: response => (response.length > 0) || "Name can't be blank"
    },
    {
        type: 'input',
        message: 'Enter employee ID:',
        name: 'id',
        when: response => response.type !== '-Done-',
        validate: response => (parseInt(response) > 0) || 'Please enter a valid ID'
    },
    {
        type: 'input',
        message: "Enter employee's email:",
        name: 'email',
        default: 'email@email.com',
        when: response => response.type !== '-Done-',
        validate: response => (/\S+@\S+\.\S+/.test(response)) || 'Please enter a valid email'
    },
    {
        type: 'input',
        message: 'Enter office number:',
        name: 'office',
        when: response => response.type !== '-Done-' && response.type === 'Manager',
        validate: response => (parseInt(response) > 0) || 'Please enter a valid number'
    },
    {
        type: 'input',
        message: 'Enter GitHub username:',
        name: 'github',
        default: 'Username',
        when: response => response.type !== '-Done-' && response.type === 'Engineer',
        validate: response => (response.length > 0) || "Name can't be blank"
    },
    {
        type: 'input',
        message: 'Enter school name:',
        name: 'school',
        default: 'School Name',
        when: response => response.type !== '-Done-' && response.type === 'Intern',
        validate: response => (response.length > 0) || "School name can't be blank"
    }
];

// function to prompt user
const prompt = () => inquirer.prompt(questions).then(response => {
    if (response.type !== '-Done-') {
        if (response.type === 'Manager') {
            team.push(new Manager(response.name, response.id, response.email, response.office));
            choices.splice(0, 1)
        } else if (response.type === 'Engineer') {
            team.push(new Engineer(response.name, response.id, response.email, response.github));
        } else if (response.type === 'Intern') {
            team.push(new Intern(response.name, response.id, response.email, response.school));
        }
        prompt();
        // render the team html and output to a file
    } else {
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR);
        }
        fs.writeFile(outputPath, render(team), err => err ? console.log(err) : console.log(`Generated ${outputPath}`));
    }
});

// calling function prompt
prompt();
