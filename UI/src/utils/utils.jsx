import moment from "moment";
const faker = require("faker");
// const faker = require("faker/locale/en");

export const obj2cUrl = (obj) =>
  Object.keys(obj)
    .map((key) => `${key}=${obj[key]}`)
    .join("&");

export const parentUrl = (url) => {
  let parentUrl = url.split("/");
  parentUrl.splice(-1, 1);
  return parentUrl.join("/");
};
