const express = require("express"); // import express package which will be used to create the backend service
const bodyParser = require("body-parser"); // import body-parser package which is used to parse the body's content from the request
const cors = require("cors");

const routerUsers = require("./routers/users"); // import router object from routers.js
const routerAccounts = require("./routers/accounts"); 
const routerTransactions = require("./routers/transactions"); 
const routerTest = require("./test"); 

// create an instance of express which will start the server.
application = express();
application.use(bodyParser.json()); // use body parser to specify how to convert body's content.
application.use(cors());

application.use("/user", routerUsers); // tell the application to use mappings from the router object
application.use("/account", routerAccounts);
application.use("/transaction", routerTransactions);
application.use("/", routerTest);

// start the application on port 3000
application.listen(8000, (error) => {
  if (!error) {
    console.log("Application started succesfully");
  }
});
