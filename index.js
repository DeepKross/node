const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const readline = require("readline");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 3000;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function isValidData(data, requiredKeys) {

    for (const key of requiredKeys) {
        if (!data.hasOwnProperty(key)) {
            return false;
        }
    }
}

function promptForTemplatePath(callback) {
    rl.question('Please enter absolute path to EJS template file: ', (input) => {
        if (fs.existsSync(input)) {
            console.log('Template path:', input);
            callback(input);
        } else {
            console.log('Template not found. Please try again.');
            promptForTemplatePath(callback);
        }
    });
}

function getTemplateVariables(templatePath) {
    const ejsVariableRegex = /<%[=-]\s*([\w$]+)\s*%>/g;
    const templateContent = fs.readFileSync(templatePath, "utf8");
    const variables = [];
    let match;

    while ((match = ejsVariableRegex.exec(templateContent)) !== null) {
        variables.push(match[1]);
    }

    return variables;
}

function getJsonPath(callback) {
    function promptForPath() {
        rl.question('Please enter absolute path to json file: ', (input) => {
            if (fs.existsSync(input)) {
                console.log('File path:', input);
                callback(input);
            } else {
                console.log('File not found. Please try again.');
                promptForPath();
            }
        });
    }

    promptForPath();
}

function getJsonData(path) {
    let raw_data = fs.readFileSync(path, "utf8");
    console.log("Get Json Data");
    return JSON.parse(raw_data);

}

getJsonPath((jsonPath) => {
    promptForTemplatePath((templatePath) => {
        const requiredKeys = getTemplateVariables(templatePath);
        const jsonData = getJsonData(jsonPath);

        console.log(requiredKeys);
        console.log(jsonData);

        if (isValidData(jsonData, requiredKeys)) {
            app.get("/", (req, res) => {
                res.render(templatePath, jsonData);
            });

            app.listen(PORT, () => {
                console.log(`server started on port ${PORT}`);
            });
            rl.close();
        } else {
            console.log('The provided JSON data does not match the required variables in the template.');
            rl.close();
            console.log('Please restart the application and try again.');
        }
    });
});
