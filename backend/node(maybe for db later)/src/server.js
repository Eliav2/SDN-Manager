const Joi = require("joi");
const express = require("express");
const ovsdb = require("ovsdb-client");

// const app = express();

// const serverPort = process.env.PORT || 3162;

// app.listen(serverPort, () => console.log(`Listening on port ${serverPort}...\nhttp://localhost:${serverPort}/`));

// app.get("/", (req, res) => res.send("yup. SDN Manager server is running."));

// app.get("/api/:resource", (req, res) => {
//   let r = resources[req.params.resource];
//   if (!r) res.sendStatus(404);
//   res.send(JSON.stringify(r));
// });

// app.get("/api/:resource/:index", (req, res) => {
//   let { resource, index } = req.params;
//   let r = resources[resource][index];
//   if (!r) res.sendStatus(404);
//   res.send(JSON.stringify(r));
// });

// const validateSchema = (schema, req, res) => {
//   const validate = Joi.validate(req.body, schema);
//   if (validate.error) return res.status(400).send(validate.error.details[0].message);
// };

// app.post("/api/:resource", (req, res) => {
//   const r = resources[req.params.resource];
//   if (!r) res.sendStatus(404);
//   validateSchema({ name: Joi.string().required() }, req, res);
//   const newResource = {
//     id: r.length() + 1,
//     name: req.body.name,
//   };
//   r[newResource.id] = newResource;
//   res.send(newResource);
//   console.log(`POST: resources:`, resources);
// });

// Array.prototype.clear = function () {
//   this.length = 0;
// };

// list of available tables
// Controller
// Bridge
// Queue
// IPFIX
// NetFlow
// Open_vSwitch
// QoS
// Port
// sFlow
// SSL
// Flow_Sample_Collector_Set
// Mirror
// Flow_Table
// Interface
// AutoAttach
// Manager

const parseArray = (arr) => arr.map((val) => parseValue(val));

const parsePair = (pair) => {
  switch (pair[0]) {
    case "set":
      return Array.isArray(pair[1]) ? parseArray(pair[1]) : parseValue(pair[1]);
    case "map":
      return Object.assign({}, ...pair[1].map((arr) => ({ [arr[0]]: arr[1] })));
    case "uuid":
      return pair[1];
  }
};

const parseValue = (value) => {
  if (Array.isArray(value)) return parsePair(value);
  else return value;
};

const parseObject = (obj) => {
  for (let key in obj) obj[key] = parseValue(obj[key]);
  return obj;
};

const parseOVSDBrowsLikeIlikeIt = (rows) => {
  // each row is object
  // each value of a key in each of this objects is a <value> which is one of <atom>, <set>, <map>.
  // see https://tools.ietf.org/html/rfc7047#Notation (section 5.1)
  // <row>
  //    A JSON object that describes a table row or a subset of a table
  //    row.  Each member is the name of a table column paired with the
  //    <value> of that column.

  // let new_rows = JSON.parse(JSON.stringify(rows)); // deep clone
  return rows.map((row) => parseObject(row));
};

const getBridges = (remote, callback) => {
  // see section 4.2 here http://arthurchiao.art/blog/ovs-deep-dive-2 for list of valid request("get_schema","list_dbs" ,etc).
  // see here https://tools.ietf.org/html/rfc7047 too full documatation to see how to play with ovsdb

  // first get from ovsdb-server all data we will need
  // select columns you want to take from ovsdb by passing it to 'columns' to the right tables.
  // in order to see all available tables use:
  //    sudo ovsdb-client list-tables
  // in order to see all available columns use:
  //    sudo ovsdb-client list-columns

  // requset the data
  remote.call(
    "transact",
    "Open_vSwitch",
    {
      op: "select",
      table: "Bridge",
      where: [],
      columns: ["_uuid", "name", "ports", "fail_mode", "datapath_id", "controller"],
    },
    { op: "select", table: "Port", where: [], columns: ["_uuid", "name", "interfaces"] },
    {
      op: "select",
      table: "Interface",
      where: [],
      columns: ["_uuid", "name", "mac_in_use", "link_state", "statistics", "status", "type", "admin_state", "ofport"],
      // columns: undefined, // use this to recive all available columns
    },
    {
      op: "select",
      table: "Controller",
      where: [],
      columns: ["_uuid", "target", "is_connected"],
    },
    {
      op: "select",
      table: "Manager",
      where: [],
      // columns: ["_uuid", "ovs_version"],
    },
    {
      op: "select",
      table: "Open_vSwitch",
      where: [],
      columns: ["_uuid", "ovs_version"],
    },

    (err, replay) => {
      if (err) throw err;

      // now parse the data:
      let parsed_replay = replay.map((replay) => parseOVSDBrowsLikeIlikeIt(replay.rows));
      let bridges = parsed_replay[0];

      // replace each port uuid in Bridge table(replay[0]) with the same port object from Port table(replay[1])
      for (let i = 0; i < bridges.length; i++)
        bridges[i].ports = bridges[i].ports.map((pr_uuid) => parsed_replay[1].find((pr) => pr._uuid === pr_uuid));

      // replace each interface uuid in the current 'bridges' object with the same inteface object from Inteface table(replay[2])
      // @NOTE - support only single interface per port this way (means that assuming 'interfaces' recived from db is string and not array)
      for (let i = 0; i < bridges.length; i++) {
        for (let j = 0; j < bridges[i].ports.length; j++)
          bridges[i].ports[j].interfaces = parsed_replay[2].find((itr) => itr._uuid === bridges[i].ports[j].interfaces);
      }

      // add data about the controllers to the 'bridges' object
      for (let i = 0; i < bridges.length; i++)
        bridges[i].controller = parsed_replay[3].find((ctl) => ctl._uuid === bridges[i].controller);

      // compine all parsed bridges data to the main Open_vSwitch data object
      let data = parsed_replay[5][0];
      data.bridges = bridges;

      // return parsed data
      // the parsed data contains all data `ovs-vsctl show` shows and more.
      callback(data);
    }
  );
};

const ovsdb_server = ovsdb.createClient("6640", "localhost");
ovsdb_server.connect(function (err, remote) {
  if (err) {
    console.log("connection failed");
  } else {
    console.log("connection succeeded");
    getBridges(remote, (bridges) => console.log(bridges));
  }
});

// var management_server = ovsdb.createClient("6632", "127.0.0.1");
// management_server.connect(function (err, remote) {
//   if (err) {
//     console.log("connection failed");
//   } else {
//     console.log("connection succeeded");
//     getBridges(remote, (bridges) => console.log(bridges));
//   }
// });

//
//
// let db = new_client.database("Open_vSwitch");
// console.log(db);
// remote.call("transact", "Open_vSwitch", { op: "select", table: "Bridge", where: [] }, (err, replay) => {
// console.log("replay", JSON.stringify(replay));
// console.log("err", err);
// console.log("err", err);
// if (callback) {
//   callback(err);
// }
// console.log("connection succeded");
// let ovsDB = new_client.database();
// console.log(ovsDB);
// console.log(ovsDB.list_tables(,(err,)));
// bridges.find_by_name("s1", (err, port) => console.log(port));
// ovsDB.Interfaces().list(["name"], (err, itrs) => {
//   console.log(itrs);
// });
// bridges.list(["name"], function (err, bridges) {
//   if (err) throw err;
// console.log(bridges);
// var extra_opts = {
//   databases: new_client.databases(),
//   selected_db: db_name,
//   bridges: bridges,
// };
// console.log("client.authorized", new_client.authorized);
// if (client.authorized === true) {
//   extra_opts.authorized = true;
// } else if (client.authorized === false) {
//   extra_opts.authorized = false;
//   extra_opts.auth_error = client.auth_error;
// }
// // if client.authorized is not specified then we have simple (nonsecure) connection
// opts = extend(defaults, opts, extra_opts);
// res.render(viewName, opts);
// });
// console.log(bridges);

// console.log(new_client);

// retrieve 'Port' table schema from OVS Database
// new_client = client.createClient("ptcp:6640", "127.0.0.1");
// console.log(new_client);
// var table = client.db_schema(db_name).tables[table_name];
// console.log(json.stringify(table));
