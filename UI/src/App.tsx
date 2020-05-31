import React from "react";
import Playground from "./Playground/Playground";
var client = require("ovsdb-client");
var new_client = client.createClient("ptcp:6640", "tcp:127.0.0.1:6640");
console.log(new_client);
// // console.log(client.createClient("s1"));

// var db_name = "Open_vSwitch";
// var table_name = "s1";
// // retrieve 'Port' table schema from OVS Database
// var table = client.db_schema(db_name).tables[table_name];
// console.log(JSON.stringify(table));

// const http = require("http");
// const server = http.createServer();

const titleStyle = {
  fontSize: "40px",
  margin: "20px 0 0 20px",
};

const App: React.FC = () => {
  return (
    <div>
      <header style={titleStyle}>SDN Manager</header>
      <hr />
      <Playground />
    </div>
  );
};

export default App;
