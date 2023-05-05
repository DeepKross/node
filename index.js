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

//check if the data and required keys are valid
function isValidData(data, requiredKeys) {

    for (let i = 0; i < requiredKeys.length; i++) {
        if (!(requiredKeys[i] in data)) {
            return false;
        }
    }
    // If all elements in the array are keys in the object, return true
    return true;
}

//function for getting template path
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

//function for getting template variables
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

//function for getting json path
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

//funct for getting json data
function getJsonData(path) {
    let raw_data = fs.readFileSync(path, "utf8");
    console.log("Get Json Data");
    return JSON.parse(raw_data);

}

getJsonPath((jsonPath) => {
    promptForTemplatePath((templatePath) => {
        const requiredKeys = getTemplateVariables(templatePath); // keys of the template
        const jsonData = getJsonData(jsonPath); // data from the json file

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
