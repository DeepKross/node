const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const readline = require("readline");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 3000;

const url_to_test_data = `D:\\LookingForJob\\TMacademy\\node\\data\\data.json`;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getJsonPath() {
    let path;
    rl.question('Please enter url to json file: ', (input) => {
        path = input
        console.log(input);
        rl.close();
    });
    return path;
}

function getJsonData() {
    let path = getJsonPath();

    let raw_data = fs.readFileSync(path, "utf8");
    return JSON.parse(raw_data);
}

app.get("/", (req, res) => {
    let data = getJsonData();

    res.render("index", data);
});

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});

