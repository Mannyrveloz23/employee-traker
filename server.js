const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');



const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: 'password',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

const mainMenu = [{
  name: "responses",
  type: "list",
  message: "Hi, what are you looking for?",
  choices: [
    "View Departments",
    "View Roles",
    "View Employees",
    "Add Deparment",
    "Add Role",
    "Add Employee",
    "Update Employee Role",
    "Finish"
  ]
}];
//initiate function prompts user and let use the database
function init() {
  inquirer.prompt(mainMenu).then(function(answers){
    switch (answers.responses) {
      case "View Departments":
        viewDepartments();
      break;

      case "View Roles":
        viewRoles();
      break;

      case "View Employees":
        ViewEmployees();
      break

      case "Add Department":
        addDepartment();
      break;

      case "Add Role":
        addRole();
      break;

      case "Add Employee":
        addEmployee();
      break;

      case "Update Employee Role":
        updateRole();
      break

      case "Finish":
        db.end();
      break;
    }
  })
}

function viewDepartments() {
  db.query(
  "SELECT department.id AS ID, department.name AS Department FROM department",
  function(err, res) {
    if (err) throw err
    console.log("Departments");
    console.table(res);
    init();
  })
}

function viewRoles() {
  db.query(
  "SELECT role.id AS Department_ID, role.title AS Title FROM role",
  function(err, res) {
    if (err) throw err
    console.log("Roles");
    console.table(res);
    init();
  })
}

function ViewEmployees() {
  db.query(
    "SELECT employee.id AS Employee_ID, first_name AS First_Name, last_name AS Last_Name, role_id AS Role_ID, manager_id AS Manager_ID FROM employee",
    function(err, res) {
      if (err) throw err
      console.log("Employees");
      console.table(res);
      init();
    }
  )
}

const departmentArr = [];
function selectDept() {
  db.query(
    "SELECT * FROM deparment",
    function(err, res) {
      if (err) throw err
      for (let i=0; i < res.length; i++) {
        departmentArr.push(res[i].name)
      }
    }
  )
  return departmentArr;
}

function addDepartment() {
  inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "What department would you like to add?",
      validate: (value) => {
        if(value) {
          return true
        } else {
          console.log("Type a Department name to continue.")
          return false
        }
      }
    }
  ]).then(function(answers) {
    db.query(
      "INSERT INTO department (name) VALUES(?)",
      answers.name,
      function(err, res) {
        if(err) throw err;
        console.table(res);
        init();
      }
    )
  })
};

