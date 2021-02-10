const express = require("express");
const connection = require("../database"); // import connection object from database.js

// create a Router object to define URI mappings.
router = express.Router();

// URI mapping to display all accounts
router.get("/all", (request, response) => {
  // in the callback function, use mysql connection to execute select query
  connection.query(`select * from accounts`, (errors, results) => {
    if (errors) {
      console.log(errors);
      response.status(400).send("Server error");
    } else {
      // populate the response object with the results received from mysql server.
      response.send(results);
    }
  });
});

// URI mapping to display account with an id specified in the request
router.get("/id", (request, response) => {
  // add validation checks
  if (request.body.accounts_id == null || request.body.accounts_id == "") {
    response.status(400).send("Invalid ID");
    return;
  }

  // in the callback function, use mysql connection to execute select query
  connection.query(
    `select * from accounts where account_id = ${request.body.account_id}`,
    (errors, results) => {
      if (errors) {
        response.send(errors);
        return;
      } else {
        // populate the response object with the results received from mysql server.
        response.send(results);
      }
    }
  );
});

// URI mapping to display account with an id specified in the URI
router.get("/id/:account_id", (request, response) => {
  // in the callback function, use mysql connection to execute select query
  connection.query(
    `select * from accounts where account_id = ${request.params.account_id}`,
    (errors, results) => {
      if (errors) {
        response.send(errors);
        return;
      }
      // populate the response object with the results received from mysql server.
      response.send(results);
    }
  );
});

// URI mapping to display accounts of a specified user id
router.get("/user/:id", (request, response) => {
  // add validation checks
  if (request.params.id == null || request.params.id == "") {
    response.status(400).send("Invalid ID");
    return;
  }

  // in the callback function, use mysql connection to execute select query
  connection.query(
    `select * from accounts where owner_id = ${request.params.id}`,
    (errors, results) => {
      if (errors) {
        response.send(errors);
        return;
      } else {
      // populate the response object with the results received from mysql server.
      response.send(results);
      }
    }
  );
});

// URI mapping to delete an existing account
router.delete("/del", (request, response) => {
  // in the callback function, use mysql connection to execute select query
  connection.query(
    `DELETE FROM users WHERE account_id = '${request.body.account_id}'`,
    (errors, results) => {
      // populate the response object with delete message.
      response.send("Data deleted successfully");
    }
  );
});

// export router object so that other files could import it.
module.exports = router;