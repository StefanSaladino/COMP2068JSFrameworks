//Author: Stefan Saladino
//Course: Javascript frameworks
//Date: June 21/24
//Description: URL parsing calculator that takes parameters from a url and outputs a result 

//importing connect and url packages
const connect = require('connect');
const url = require('url');

//connect the server
const app = connect();

//calculate function
const calculate = (req, res, next) => {
    //parsing url for values
    const queryObject = url.parse(req.url, true).query;
    const method = queryObject.method;
    const x = parseFloat(queryObject.x);
    const y = parseFloat(queryObject.y);

    let result;
    let operationString;

    //switch cases for various methods
    switch (method){
        case 'add':
            result = x + y;
            operationString = `${x} + ${y} = ${result}`;
            break;
        case 'subtract':
            result = x - y;
            operationString = `${x} - ${y} = ${result}`;
            break;
        case 'multiply':
            result = x * y;
            operationString = `${x} * ${y} = ${result}`;
            break;
        case 'divide':
            if(y!==0){
            result = x + y;
            operationString = `${x} / ${y} = ${result}`;
            break;
            }
            else{
                res.writeHead(400, {'Content-type': 'text/plain'});
                res.end('Error: Cannot divide by 0');
                return;
            }
        //anything other than +,-,*,/ will return an error
        default: 
        res.writeHead(400, {'Content-type': 'text/plain'});
        res.end('Error: invalid method');
        return;
    }

    //returning results
    res.writeHead(200, {'Content-type': 'text/plain'});
    res.end(`${operationString}`);
};



//calculate function being used as middleware
app.use('/lab3', calculate);

app.listen(3000);

console.log("Server is running on http://localhost:3000");