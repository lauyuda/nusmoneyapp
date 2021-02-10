//Install d3.js:   npm install d3 --save
import React from "react";
import logo from "./brand-logo.png";
import * as d3 from 'd3' 

//importing css styling guides
import "./css/App.css";
import "./css/form.css";
import "./css/button.css";
import "./css/table.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { accounts: [], users: [], transactions: [],
                    show: "nothing", search: "", id: "", login: 'Log In'};
  }

  callAPIServerAccounts() {
    // when component mounted, start a GET request
    // to specified URL
    //fetch("https://f92c6b35-d121-4c8a-987b-81217155297f.mock.pstmn.io/accounts")
    fetch("http://localhost:8000/account/user/" + this.state.id)
      .then(res => res.text())
      .then(res => this.setState({ accounts: JSON.parse(res) }))
      .catch(err => err);
  }

  callAPIServerUsers() {
      //fetch("https://f92c6b35-d121-4c8a-987b-81217155297f.mock.pstmn.io/customers")
    fetch("http://localhost:8000/user/id/" + this.state.id)
      //fetch("http://localhost:8000/user/all")
      .then(res => res.text())
      .then(res => this.setState({ users: JSON.parse(res) }))
      .catch(err => err);
  }

  callAPIServerTransactions() {
      //fetch("https://f92c6b35-d121-4c8a-987b-81217155297f.mock.pstmn.io/transactions")
    fetch("http://localhost:8000/transaction/user/" + this.state.id)
      .then(res => res.text())
      .then(res => this.setState({ transactions: JSON.parse(res) }))
      .catch(err => err);
  }
  
  /*
  componentDidMount() {
    this.callAPIServerAccounts();
    this.callAPIServerUsers();
    this.callAPIServerTransactions();
  }
  */
  
 componentDidUpdate(prevState) {
  if (this.state.accounts !== prevState.accounts) {
    this.callAPIServerAccounts();
    this.showChartAccounts();
  }

  if (this.state.users !== prevState.users) {
    this.callAPIServerUsers();
    
  }

  if (this.state.transactions !== prevState.transactions) {
    this.callAPIServerTransactions();
    this.showChartTransactions();
  }
}


toggleViewAccounts() {
  if(this.state.show === "accounts") {
    this.setState({ show: "nothing"});
  } else {
    this.setState({ show: "accounts"});
  }
}

toggleViewUsers() {
  if(this.state.show === "users") {
    this.setState({ show: "nothing"});
  } else {
    this.setState({ show: "users"});
  }
}

toggleViewTransactions() {
  if(this.state.show === "transactions") {
    this.setState({ show: "nothing"});
  } else {
    this.setState({ show: "transactions"});
  }
}

showChartAccounts() {
  var amount =
  d3.rollups(
      this.state.accounts,
      xs => d3.sum(xs, x => x.balance),
      d => d.account_type
    )
    .map(([k, v]) => ({ type: k, balance: v }))

  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  var width = 1000 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;
  var svg = d3.select("#barChartAccounts")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  
  svg.selectAll("*").remove();

  var x = d3.scaleBand().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  x.domain(amount.map(details => details.type));
  y.domain([0, d3.max(amount.map(details => parseFloat(details.balance)))]);

  svg.selectAll(".bar")
    .data(amount)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.type))
    .attr("width", x.bandwidth() - 10)
    .attr("y", d => y(d.balance))
    .attr("height", d => height - y(d.balance));

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  svg.append("g")
    .call(d3.axisLeft(y));
}

showChartTransactions() {
  var expenditure =
  d3.rollups(
      this.state.transactions,
      xs => d3.sum(xs, x => x.amount),
      d => d.account_type
    )
    .map(([k, v]) => ({ type: k, amount: v }))

  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  var width = 1000 - margin.left - margin.right;
  var height = 700 - margin.top - margin.bottom;
  var svg = d3.select("#barChartTransactions")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  
  svg.selectAll("*").remove();

  var x = d3.scaleBand().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  x.domain(expenditure.map(details => details.type));
  y.domain([0, d3.max(expenditure.map(details => Math.abs(details.amount)))]); //finding absolute since biggest negative may be "bigger"

  svg.selectAll(".bar")
    .data(expenditure)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("fill", d => d.amount>0 ? 'green' : 'red' )
    .attr("x", d => x(d.type))
    .attr("width", x.bandwidth() - 10)
    .attr("y", d => y(d.amount>0 ? d.amount: d.amount*-1))
    .attr("height", d => height - y(d.amount>0 ? d.amount: d.amount*-1));
  
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
  
  svg.append("g")
    .call(d3.axisLeft(y));  
}

searchHandler = e=> {
  this.setState({search: e.target.value});
}

clickHandler = () => {
  if (this.state.login === 'Log In') {
    this.setState({login: 'Log Off', id: this.state.search});
    this.callAPIServerUsers();
  this.callAPIServerAccounts();
  this.callAPIServerTransactions();
  } else {
    window.location.reload();
  }
}

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div class="water"/>
          <h1 className="App-title">NUSmoney App by Ducky Bank</h1>
          <br/>
          <div className="wrapper" style={{visibility: this.state.login === 'Log In' ? 'visible' : 'hidden'}}>
            <div className="input-data"> 
              <input 
              type="number"
              pattern="[0-9]*" 
              required
              onChange={this.searchHandler}/>
                <label>User ID</label>
            </div>
          </div>
          <button
              className="a"
              onClick={() => this.clickHandler()}
              disabled={!this.state.search.length}
            >
              {this.state.login}
          </button>
        </header>

        <button
            className="add-btnU"
            onClick={() => this.toggleViewUsers()}
          >
            User
        </button>

        <button
            className="add-btnA"
            onClick={() => this.toggleViewAccounts()}
          >
            Account
        </button>

        <button
            className="add-btnT"
            onClick={() => this.toggleViewTransactions()}
          >
            Transaction
        </button>

        <table className="myTableUser" style={{visibility: this.state.show === "users" ? 'visible' : 'collapse' }}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>NRIC</th>
              <th>Mobile</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
          {this.state.users.map((user) => {
            return (
              <tr key={user.user_id}>
                <td> {user.user_id} </td>
                <td> {user.first_name} </td>
                <td> {user.last_name} </td>
                <td> {user.email} </td>
                <td> {user.nric} </td>
                <td> {user.mobile} </td>
                <td> {user.address} </td>
              </tr>
            );
          })}
          </tbody>
        </table>

        <table className="myTableAccount" style={{visibility: this.state.show === "accounts" ? 'visible' : 'collapse' }}>
          <thead>
            <tr>
              <th>Account Type</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
          {this.state.accounts.map((acc) => {
            return (
              <tr key={acc.account_id}>
                <td> {acc.account_type} </td>
                <td> ${acc.balance} </td>
              </tr>
            );
          })}
          </tbody>
        </table>
        
        <table className="myTableTransaction" style={{visibility: this.state.show === "transactions" ? 'visible' : 'collapse' }}>
          <thead>
            <tr>
              <th>Transaction Type</th>
              <th>Transaction Date</th>
              <th>Transaction Time</th>
              <th>Account</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
          {this.state.transactions.map((trans) => {
            return (
              <tr key={trans.transaction_id}>
                <td> {trans.transaction_type} </td>
                <td> {trans.transaction_date} </td>
                <td> {trans.transaction_time} </td>
                <td> {trans.account_type} </td>
                <td> {('$' + trans.amount.toString()).replace('$-','-$')} </td>
              </tr>
            );
          })}
          </tbody>
        </table>
        
        <h2 style={{display: this.state.show === "accounts" || this.state.show === "transactions" ? 'inline' : 'none' }}>Visualisation of Data</h2>
        <div id="visualisation">
            <svg id="barChartAccounts" style={{display: this.state.show === "accounts" ? 'inline' : 'none' }}>
            </svg>
            <svg id="barChartTransactions" style={{display: this.state.show === "transactions" ? 'inline' : 'none' }}>
            </svg>
        </div>
      </div>
    );
  }
}

export default App;
