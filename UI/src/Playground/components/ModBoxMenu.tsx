//@ts-nocheck

import React, { useState } from "react";
import Draggable from "react-draggable";
import MaterialIcon from "material-icons-react";
import Popup from "reactjs-popup";
import "./ModBoxMenu.css";
import { matchFields } from "./aclsFields";

// const matchNames = ["in_port", "hw_addr"];

// destructre example: obj1={box1:{shape:"tallBox",data:{actions:"click",fields:{field1:"field1",field2:"field2"}}},box2:{}}
// {...obj1,...{box1:{data:{fields:{field1:"CHANGED"}}}}} => {box1:{shape:"tallBox",data:{actions:"click",fields:{field1:"CHANGED",field2:"field2"}}},box2:{}}

const PopUpMenu = ({ handleAddMatch, fields }) => {
  const [filterField, setFilterField] = useState("");
  fields = fields ? (filterField ? fields.filter((f) => f[0].includes(filterField)) : fields) : [];

  return (
    <Popup
      trigger={
        <div className="button addButton">
          <MaterialIcon size={30} icon="add" className="material-icons" />
        </div>
      }
      position="right top"
      on="hover"
      closeOnDocumentClick
      mouseLeaveDelay={400}
      mouseEnterDelay={0}
      contentStyle={{ border: "none", width: 150 }}
      arrow={true}
    >
      <div>
        <input
          value={filterField}
          type="text"
          style={{ width: 100, border: "none", fontSize: "0.9em" }}
          placeholder="filter..."
          onChange={(e) => setFilterField(e.target.value)}
        />
        <div className="popupMenu">
          {fields.map((field) => (
            <Popup
              key={field[0]}
              trigger={
                <div key={field[0]} className="menu-item" onClick={() => handleAddMatch(field[0])}>
                  {field[0]}
                </div>
              }
              position="right top"
              on="hover"
              mouseLeaveDelay={200}
              mouseEnterDelay={200}
              contentStyle={{ border: "none", width: 150 }}
              arrow={true}
            >
              <Popup
                key={field[0]}
                trigger={<div>{field[2]}</div>}
                position="top center"
                on="hover"
                mouseLeaveDelay={0}
                mouseEnterDelay={0}
                contentStyle={{ border: "none", width: 150 }}
                arrow={true}
              >
                {field[1]}
              </Popup>
            </Popup>
          ))}
        </div>
      </div>
    </Popup>
  );
};

//represents the UI of "actions" and "match" sections
const SectionMenu = ({ sectionName, box, setBoxes, boxes, fields }) => {
  // fields = [...[<fieldName>,<valueType>,<fieldDescription>]]

  const handleAddField = (key) => {
    let newBox = { ...box };
    newBox.modData[sectionName][key] = "";
    setBoxes((boxes) => boxes.map((box) => (box.id === newBox.id ? newBox : box)));
  };

  const handleDelField = (key) => {
    let newBox = { ...box };
    delete newBox.modData[sectionName][key];
    setBoxes((boxes) => boxes.map((box) => (box.id === newBox.id ? newBox : box)));
  };

  const handleInputChange = (value, key) => {
    let newBox = { ...box };
    newBox.modData[sectionName][key] = value;
    setBoxes((boxes) => boxes.map((box) => (box.id === newBox.id ? newBox : box)));
  };

  return (
    <div className="section">
      <PopUpMenu handleAddMatch={handleAddField} fields={fields} />
      <div className="sectionHeader">{sectionName}:</div>
      {Object.keys(box.modData[sectionName]).map((key) => (
        <div className="propBox" key={key}>
          <div className="propField propKey">
            {/* {key} */}
            <Popup
              trigger={<div>{key}</div>}
              position="left center"
              on="hover"
              mouseLeaveDelay={0}
              mouseEnterDelay={400}
              contentStyle={{ border: "none", width: 150 }}
              arrow={true}
            >
              {fields.find((f) => f[0] === key)[2]}
            </Popup>
          </div>
          <div className="propField propValue">
            <input
              type="text"
              value={box.modData[sectionName][key]}
              className="inputField"
              placeholder="Enter Value..."
              onChange={({ target: { value } }) => handleInputChange(value, key)}
              style={{ fontSize: "0.9em" }}
            />
          </div>
          <MaterialIcon
            size={30}
            icon="delete"
            className="material-icons button addButton"
            onClick={() => handleDelField(key)}
          />
        </div>
      ))}
    </div>
  );
};

export default ({ setBoxes, box: boxProp, boxes }) => {
  if (!boxProp.modData) boxProp.modData = { match: {}, actions: {} };
  const handleClose = () => {
    setBoxes((boxes) =>
      boxes.map((box) =>
        box.id === boxProp.id
          ? {
              ...box,
              menuWindowOpened: false,
            }
          : box
      )
    );
  };

  // console.log(newBoxes[i]);

  return (
    <Draggable enableUserSelectHack={false} defaultPosition={{ x: boxProp.x, y: boxProp.y - 100 }}>
      <div className="menuWindowContainer" onClick={(e) => e.stopPropagation()}>
        <MaterialIcon size={30} icon="close" className="material-icons button closeButton" onClick={handleClose} />
        <div className={"header"}>{`${boxProp.id}`}</div>
        <hr style={{ width: "90%" }} />
        <div className="propsContainer">
          <SectionMenu sectionName="match" box={boxProp} setBoxes={setBoxes} fields={matchFields} boxes={boxes} />
          <SectionMenu sectionName="actions" box={boxProp} setBoxes={setBoxes} />
        </div>
      </div>
    </Draggable>
  );
};
