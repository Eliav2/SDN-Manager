const Joi = require("joi");
const express = require("express");
const app = express();
app.use(express.json());

Object.prototype.length = function () {
  return Object.keys(this).length;
};

const serverPort = process.env.PORT || 3162;

const resources = { switches: { 1: { id: 1, name: "s1" } } };

app.listen(serverPort, () => console.log(`Listening on port ${serverPort}...\nhttp://localhost:${serverPort}/`));

app.get("/", (req, res) => res.send("SDN Manager server is running."));

app.get("/api/:resource", (req, res) => {
  let r = resources[req.params.resource];
  if (!r) res.sendStatus(404);
  res.send(JSON.stringify(r));
});

app.get("/api/:resource/:index", (req, res) => {
  let { resource, index } = req.params;
  let r = resources[resource][index];
  if (!r) res.sendStatus(404);
  res.send(JSON.stringify(r));
});

const validateSchema = (schema, req, res) => {
  const validate = Joi.validate(req.body, schema);
  if (validate.error) return res.status(400).send(validate.error.details[0].message);
};

app.post("/api/:resource", (req, res) => {
  const r = resources[req.params.resource];
  if (!r) res.sendStatus(404);
  validateSchema({ name: Joi.string().required() }, req, res);
  const newResource = {
    id: r.length() + 1,
    name: req.body.name,
  };
  r[newResource.id] = newResource;
  res.send(newResource);
  console.log(`POST: resources:`, resources);
});

var client = require("ovsdb-client");
var db_name = "Open_vSwitch";
var table_name = "port";
// retrieve 'Port' table schema from OVS Database
// new_client = client.createClient("ptcp:6640", "127.0.0.1");
// console.log(new_client);
// var table = client.db_schema(db_name).tables[table_name];
// console.log(json.stringify(table));
