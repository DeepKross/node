const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const readline = require("readline");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use('/assets', express.static('assets'));
const PORT = process.env.PORT || 3000;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function isValidData(data) {
    const requiredKeys = [
        'title',
        'year',
        'director',
        'actors',
        'poster',
        'plot'
    ];

    for (const key of requiredKeys) {
        if (!data.hasOwnProperty(key)) {
            return false;
        }
    }

    return Array.isArray(data.actors);


}

function getJsonPath(callback) {
    function promptForPath() {
        rl.question('Please enter absolute path to json file: ', (input) => {
            if (fs.existsSync(input)) {
                let data = getJsonData(input);
                if (isValidData(data)) {
                    console.log('File path:', input);
                    rl.close();
                    callback(input);
                } else {
                    console.log('Invalid data format. Please try again.');
                    promptForPath();
                }
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
    return JSON.parse(raw_data);
}

getJsonPath((path) => {
    app.get("/", (req, res) => {
        let data = getJsonData(path);



        res.render("index", data);
    });

    app.listen(PORT, () => {
        console.log(`server started on port ${PORT}`);
    });
});
