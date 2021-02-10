const express = require("express");
const connection = require("../database"); // import connection object from database.js

// create a Router object to define URI mappings.
router = express.Router();

// URI mapping to display all users
router.get("/all", (request, response) => {
  // in the callback function, use mysql connection to execute select query
  connection.query(`select * from users`, (errors, results) => {
    if (errors) {
      console.log(errors);
      response.status(400).send("Server error");
    } else {
      // populate the response object with the results received from mysql server.
      response.send(results);
    }
  });
});

// URI mapping to display customer with an id specified in the request
router.get("/id", (request, response) => {
  // add validation checks
  if (request.body.user_id == null || request.body.user_id == "") {
    response.status(400).send("Invalid ID");
    return;
  }

  // in the callback function, use mysql connection to execute select query
  connection.query(
    `select * from users where user_id = ${request.body.user_id}`,
    (errors, results) => {
      if (errors) {
        console.log(errors);
        response.status(400).send("Server error");
      } else {
        // populate the response object with the results received from mysql server.
        response.send(results);
      } 
    }
  );
});

// URI mapping to display customer with an id specified in the URI
router.get("/id/:user_id", (request, response) => {
  //Error checking
  if (!Number.isInteger(request.params.user_id)) {
    response.status(400).send("ID has to be int");
    return;
  }
  // in the callback function, use mysql connection to execute select query
  connection.query(
    `select * from users where user_id = ${request.params.user_id}`,
    (errors, results) => {
      if (errors) {
        console.log(errors);
        response.status(400).send("Server error");
      } else {
        // populate the response object with the results received from mysql server.
        response.send(results);
      }
    }
  );
});

// URI mapping to add a new user
router.post("/add", (request, response) => {
  // Error checking
  if (request.body.first_name == null || request.body.first_name === "") {
    response.status(400).send("Invalid first name");
    return;
  }
  if (request.body.last_name == null || request.body.last_name === "") {
    response.status(400).send("Invalid last name");
    return;
  }
  if (request.body.email == null || request.body.email === "") {
    response.status(400).send("Invalid email");
    return;
  }
  if (request.body.password == null || request.body.password === "") {
    response.status(400).send("Invalid password");
    return;
  }
  if (!Number.isInteger(request.body.mobile)) {
    response.status(400).send("Mobile has to be int");
    return;
  }
  if (request.body.password == null || request.body.password === "") {
    response.status(400).send("Invalid password");
    return;
  }
  
  // in the callback function, use mysql connection to execute select query
  connection.query(
    `insert into users (first_name, last_name, email, nric, mobile, address, password) 
    values ('${request.body.first_name}', '${request.body.last_name}', '${request.body.email}', '${request.body.nric}',
    ${request.body.mobile}, '${request.body.address}', '${request.body.password}')`,
    (errors, results) => {
      if (errors) {
        console.log(errors);
        response.status(400).send("Server error");
      } else {
        // populate the response object with success message.
        response.send("Data inserted successfully");
      }
    }
  );
});

// URI mapping to delete an existing user
router.delete("/del", (request, response) => {
  // in the callback function, use mysql connection to execute select query
  connection.query(
    `DELETE FROM users WHERE user_id = '${request.body.user_id}'`,
    (errors, results) => {
      if (errors) {
        console.log(errors);
        response.status(400).send("Server error");
      } else {
        // populate the response object with delete message.
        response.send("Data deleted successfully");
      }
    }
  );
});

/*
router.put("/customer/update/wallet", (request, response) => {
  // in the callback function, use mysql connection to execute select query
  connection.query(
    `update customer set customer_wallet = ${request.body.wallet} where customer_id = ${request.body.id}`,
    (errors, results) => {
      // Populate the response with a success message
      response.send("Data inserted successfully");
    }
  );
});
*/

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


