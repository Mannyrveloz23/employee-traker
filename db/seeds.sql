INSERT INTO department (department_name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");


INSERT INTO role (department_id, title, salary)
VALUES (1, "Salesperson", 80000),
       (2, "LeadEngineer", 150000),
       (2, "Software Engineer", 120000),
       (3, "Account Manager", 160000),
       (3, "Accountant", 125000),
       (4, "Legal Team Lead", 250000),
       (4, "Lawyer", 190000);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Michael", "Lantigua", 1, 0),
       ("Violeta", "Tineo", 2, 0),
       ("Antonio", "Rodriguez", 3, 2),
       ("Elias", "Brens", 4, 0),
       ("Jesus", "Nunez", 5, 4),
       ("Angel", "Ramos", 6, 0),
       ("Manuel", "Rodriguez", 7, 6);