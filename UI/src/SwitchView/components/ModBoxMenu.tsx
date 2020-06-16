//@ts-nocheck

import React, { useState, useContext } from "react";
import Draggable from "react-draggable";
// import MaterialIcon from "material-icons-react";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import Popup from "reactjs-popup";
import "./ModBoxMenu.css";
import { matchFields, actionsFields } from "./aclsFields";
import { CanvasContext } from "./../SwitchView";

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
          <AddOutlinedIcon fontSize={"large"} />
        </div>
      }
      position="right top"
      on="hover"
      closeOnDocumentClick
      mouseLeaveDelay={400}
      mouseEnterDelay={0}
      contentStyle={{ border: "none", width: 200, transition: "all 1s ease-out" }}
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
              contentStyle={{ border: "none", width: 200 }}
              arrow={true}
            >
              <Popup
                key={field[0]}
                trigger={<div>{field[1]}</div>}
                position="top center"
                on="hover"
                mouseLeaveDelay={0}
                mouseEnterDelay={0}
                contentStyle={{ border: "none", width: 200 }}
                arrow={true}
              >
                {field[2]}
              </Popup>
            </Popup>
          ))}
        </div>
      </div>
    </Popup>
  );
};

//represents the UI of "actions" and "match" sections
const SectionMenu = ({ sectionName, box, fields }) => {
  // fields = [...[<fieldName>,<fieldDescription>,<exampleForValue>]]
  const c = useContext(CanvasContext);

  const handleAddField = (key) => {
    let newBox = { ...box };
    newBox.modData[sectionName][key] = "";
    c.setBoxes((boxes) => boxes.map((box) => (box.id === newBox.id ? newBox : box)));
  };

  const handleDelField = (key) => {
    let newBox = { ...box };
    delete newBox.modData[sectionName][key];
    c.setBoxes((boxes) => boxes.map((box) => (box.id === newBox.id ? newBox : box)));
  };

  const handleInputChange = (value, key) => {
    let newBox = { ...box };
    newBox.modData[sectionName][key] = value;
    c.setBoxes((boxes) => boxes.map((box) => (box.id === newBox.id ? newBox : box)));
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
              contentStyle={{ border: "none", width: 200 }}
              arrow={true}
            >
              {fields.find((f) => f[0] === key)[2]}
            </Popup>
          </div>
          <div
            className="propField propValue"
            onMouseDown={
              (e) => e.stopPropagation() // prevent the draging whan selecting text
            }
          >
            <input
              type="text"
              value={box.modData[sectionName][key]}
              className="inputField"
              placeholder="Enter Value..."
              onChange={({ target: { value } }) => handleInputChange(value, key)}
              style={{ fontSize: "0.9em" }}
            />
          </div>
          <DeleteOutlinedIcon
            fontSize={"large"}
            // icon="delete"
            className="button addButton"
            onClick={() => handleDelField(key)}
          />
        </div>
      ))}
    </div>
  );
};

export default React.memo(({ box: boxProp }) => {
  const c = useContext(CanvasContext);
  if (!boxProp.modData) boxProp.modData = { match: {}, actions: {} };
  const handleClose = () => {
    c.setBoxes((boxes) =>
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

  return (
    <Draggable enableUserSelectHack={false} defaultPosition={{ x: boxProp.x, y: boxProp.y - 100 }}>
      <div className="menuWindowContainer" onClick={(e) => e.stopPropagation()}>
        <CloseOutlinedIcon fontSize={"large"} className="button closeButton" onClick={handleClose} />
        <div className={"header"}>{`${boxProp.id}`}</div>
        <hr style={{ width: "90%" }} />
        <div className="propsContainer">
          <SectionMenu sectionName="match" box={boxProp} fields={matchFields} />
          <SectionMenu sectionName="actions" box={boxProp} fields={actionsFields} />
        </div>
      </div>
    </Draggable>
  );
});
