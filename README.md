# Movie Info Display App

This is a simple Node.js application that uses Express and EJS to create a dynamic template handler. The application takes an absolute path to a JSON 
file containing movie information and displays it on a webpage.

## Features

- Input validation: The application checks if the provided path is valid and if the JSON file exists at the given path.
- JSON format validation: The application checks if the JSON file contains all the necessary properties, which are:
"title", "director", "actors", "year", "plot", "poster".
- No databases: The application does not use any databases to store or retrieve data.

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm (version 6 or later)

### Installation

1. Clone the repository to your local machine:
`git clone https://github.com/DeepKross/node.git`

2. Navigate to the project directory


3. Install the required dependencies:

`npm install`

## Usage

1. Run the application:

2. The application will ask for the path to the HTML template file and the data file via the console. Provide the absolute paths to the template and the data files.

3. If both files are found and valid, open a web browser and go to https://localhost:3000 to see the displayed movie information.

## Error Handling

The application handles the following errors:

- Invalid path: If the provided path is not valid or doesn't exist, an error message will be displayed in the console.
- Incorrect JSON format: If the JSON file doesn't contain all the necessary properties, an error message will be displayed in the console.

## Built With

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [EJS](https://ejs.co/)



