const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');



const PORT = process.env.PORT || 3001;
const app = express();



// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: '',
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
  "SELECT department.id AS ID, department.department_name AS Department FROM department",
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

const roleArr = [];
function selectRole() {
  db.query(
    "SELECT * FROM role",
    function(err, res) {
      if (err) throw err
      for (let i = 0; i < res.length; i++) {
        roleArr.push(res[i].title);
      }
    }
  )
  return roleArr;
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the new role?",
        name: "roleName"
      },
      {
        type: "input",
        message: "What is the salary of the role?",
        name: "roleSalary"
      },
      {
        type: "input",
        message: "What is the department id number?",
        name: "deptId"
      }
    ])
    .then(function(answers){
      db.query(
        "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
        [
          answers.roleName,
          answers.roleSalary,
          answers.deptId
        ],
        function(err, res) {
          if (err) throw err;
          console.table(res);
          init();
        }
      );
    });
};


//updating database

const employeeChoices = async() => {
  const employees = await db.query(`SELECT id AS value, last_name from employee;`);
  return employees[0];
};

//add employers
function addEmployee() {
  inquirer.prompt([
    {
      type: "input",
      name: "firstName",
      message: "Type the employee's first name"
    },
    {
      type: "input",
      name: "lastName",
      message: "Type the employee's last name"
    },
    {
      type: "input",
      name: "managerId",
      message: "Type the employee's manager ID number"
    },
  ]).then(function(answers) {
    db.query(
      "INSERT INTO employee (first_name, last_name, manager_id) VALUES (?, ?, ?)",
      [answers.firstName, answers.lastName, answers.managerId],
      function(err, res) {
        if(err) throw err;
        console.table(res);
        init();
      }
    )
  })
}

function updateRole() {
  inquirer.prompt([
    {
      type: "input",
      message: "Which employee would you like to update?",
      name: "employeeName"
    },
    {
      type: "input",
      message: "What is their new roleID?",
      name: "newRole"
    },
  ])
  ,then(function(answers) {
    db.query(
      "UPDATE employee SET role_id=? WHERE first_name= ?",
      [answers.newRole, answers.employeeName],
      function(err, res) {
        if(err) throw err;
        console.table(res);
        init();
      }
    );
  });
};

init();