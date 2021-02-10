const express = require("express");
const connection = require("../database"); // import connection object from database.js

// create a Router object to define URI mappings.
router = express.Router();

// URI mapping to display all transactions
router.get("/all", (request, response) => {
  // in the callback function, use mysql connection to execute select query
  connection.query(`select * from transactions`, (errors, results) => {
    if (errors) {
      console.log(errors);
      response.status(400).send("Server error");
    } else {
      // populate the response object with the results received from mysql server.
      response.send(results);
    }
  });
});

// URI mapping to display transactions with an id specified in the request
router.get("/id", (request, response) => {
  // add validation checks
  if (request.body.transactions_id == null || request.body.transactions_id == "") {
    response.status(400).send("Invalid ID");
    return;
  }

  // in the callback function, use mysql connection to execute select query
  connection.query(
    `select * from transactions where transactions_id = ${request.body.transactions_id}`,
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

// URI mapping to display transaction with an id specified in the URI
router.get("/id/:transactions_id", (request, response) => {
  // in the callback function, use mysql connection to execute select query
  connection.query(
    `select * from transactions where transactions_id = ${request.params.transactions_id}`,
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

// URI mapping to display all transactions
router.get("/test/:id", (request, response) => {
  // in the callback function, use mysql connection to execute select query
  connection.query(
    `select a.* from accounts a left join users u on a.owner_id=u.user_id where a.owner_id = ${request.params.id}`, 
    (errors, results) => {
      if (errors) {
        console.log(errors);
        response.status(400).send("Server error");
      } else {
        // populate the response object with the results received from mysql server.
        response.send(results);
      }
  });
});

// URI mapping to display transactions of a specified user id
router.get("/user/:id", (request, response) => {
  // add validation checks
  if (request.params.id == null || request.params.id == "") {
    response.status(400).send("Invalid ID");
    return;
  }

  // in the callback function, use mysql connection to execute select query
  connection.query(
    //`select * from transactions where account_id = ${request.params.id}`,
    `select t.*, a.account_type 
    from 
      transactions t
      join 
        accounts a 
        left join users u on a.owner_id=u.user_id
      on t.account_id=a.account_id where a.owner_id = ${request.params.id}`,
    (errors, results) => {
      if (errors) {
        response.send(errors);
        return;
      } else {
        //populate the response object with the results received from mysql server.
        response.send(results);
      }
    }
  );
});

// URI mapping to delete an existing transaction
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

module.exports = router;
