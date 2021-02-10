const express = require("express");
const connection = require("./database"); // import connection object from database.js

// create a Router object to define URI mappings.
router = express.Router();

// URI mapping to display all users
router.get("/test/all", (request, response) => {
  // in the callback function, use mysql connection to execute select query
  connection.query(`select * from users`, (errors, results) => {
    // populate the response object with the results received from mysql server.
    response.send(results);
  });
});

// URI mapping to display customer with an id specified in the request
router.get("/test/id", (request, response) => {
  // add validation checks
  /*
  if (request.body.user_id == null || request.body.user_id == "") {
    response.status(400).send("Invalid ID");
    return;
  }
  */

  // in the callback function, use mysql connection to execute select query
  connection.query(
    `select * from users where user_id = ${request.body.user_id}`,
    (errors, results) => {
      // populate the response object with the results received from mysql server.
      response.send(results);
    }
  );
});


// export router object so that other files could import it.
module.exports = router;

/*
// URI mapping to display all products
router.get("/product/all", (request, response) => {
  // in the callback function, use mysql connection to execute select query
  connection.query(`select * from product`, (errors, results) => {
    // populate the response object with the results received from mysql server.
    response.send(results);
  });
});

// URI mapping to display product with an id specified in the request
router.get("/product/id", (request, response) => {
  // in the callback function, use mysql connection to execute select query
  connection.query(
    `select * from product where product_id = ${request.body.id}`,
    (errors, results) => {
      // populate the response object with the results received from mysql server.
      response.send(results);
    }
  );
});

// Define a URI mapping to add a new product into the Product table
router.post("/product/add", (request, response) => {
  // in the callback function, use mysql connection to execute select query
  connection.query(
    `insert into product (product_name, product_market_price) values ('${request.body.name}', ${request.body.price})`,
    (errors, results) => {
      // Populate the response with a success message
      response.send("Data inserted successfully");
    }
  );
});
*/


