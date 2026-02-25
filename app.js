const { MongoClient } = require('mongodb');
const readline = require('readline');

const uri = "mongodb+srv://kirtisharma:Kirti123@cluster0.rkjhltf.mongodb.net/employeeDB?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let collection;

async function connectDB() {
    await client.connect();
    const db = client.db("employeeDB");
    collection = db.collection("employees");
    console.log("Connected to MongoDB!");
    showMenu();
}

// MENU
function showMenu() {
    console.log(`
1. Add Employee
2. View Employees
3. Update Employee
4. Delete Employee
5. Exit
`);

    rl.question("Choose option: ", async (choice) => {

        if (choice === '1') await addEmployee();
        else if (choice === '2') await viewEmployees();
        else if (choice === '3') await updateEmployee();
        else if (choice === '4') await deleteEmployee();
        else if (choice === '5') {
            console.log("Exiting...");
            await client.close();
            rl.close();
        }
        else {
            console.log("Invalid choice");
            showMenu();
        }
    });
}

// ADD
async function addEmployee() {
    rl.question("Enter ID: ", (id) => {
        rl.question("Enter Name: ", (name) => {
            rl.question("Enter Salary: ", async (salary) => {

                if (isNaN(salary) || salary <= 0) {
                    console.log("Invalid salary!");
                    return showMenu();
                }

                await collection.insertOne({
                    id,
                    name,
                    salary: Number(salary)
                });

                console.log("Employee Added!");
                showMenu();
            });
        });
    });
}

// VIEW
async function viewEmployees() {
    const employees = await collection.find().toArray();
    console.table(employees);
    showMenu();
}

// UPDATE
async function updateEmployee() {
    rl.question("Enter ID to update: ", (id) => {
        rl.question("Enter New Name: ", (name) => {
            rl.question("Enter New Salary: ", async (salary) => {

                if (isNaN(salary) || salary <= 0) {
                    console.log("Invalid salary!");
                    return showMenu();
                }

                await collection.updateOne(
                    { id },
                    { $set: { name, salary: Number(salary) } }
                );

                console.log("Employee Updated!");
                showMenu();
            });
        });
    });
}

// DELETE
async function deleteEmployee() {
    rl.question("Enter ID to delete: ", async (id) => {

        await collection.deleteOne({ id });

        console.log("Employee Deleted!");
        showMenu();
    });
}

connectDB();