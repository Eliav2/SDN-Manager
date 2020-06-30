////@ts-nocheck

import React, { useState, useContext } from "react";
import Draggable from "react-draggable";
// import MaterialIcon from "material-icons-react";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import Popup from "reactjs-popup";
import { matchFields, actionsFields } from "../components/aclsFields";
import { CanvasContext } from "../SwitchView";
import { BoxType } from "../components/Box";
import { union } from "lodash";

const ModBoxWindow = ({ box: boxProp }: { box: BoxType }) => {
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

  console.log(boxProp);

  return (
    <Draggable enableUserSelectHack={false} defaultPosition={{ x: boxProp.x, y: boxProp.y - 100 }}>
      <div className="menuWindowContainer" onClick={(e) => e.stopPropagation()}>
        <CloseOutlinedIcon fontSize={"large"} className="button closeButton" onClick={handleClose} />
        <div className={"header"}>{`${boxProp.name}`}</div>
        <hr style={{ width: "90%" }} />
        <div className="propsContainer">
          <SectionMenu sectionName="match" box={boxProp} fields={matchFields} />
          <SectionMenu sectionName="actions" box={boxProp} fields={actionsFields} />
        </div>
      </div>
    </Draggable>
  );
};

// type fieldsType = typeof matchFields | typeof actionsFields;
type sectionNameType = keyof BoxType["modData"];
type fieldsType<secName extends sectionNameType> = secName extends "match" ? typeof matchFields : typeof actionsFields;
type fieldsNameType<secName extends sectionNameType> = fieldsType<secName>[number][0];

// const tmp: fieldsNameType<"actions"> = matchFields[0][0];
// type fieldsNameType<secName extends sectionNameType> = secName extends {match:matchFieldsType,action:actionsFieldsType};

// type AllUnionMemberKeys<T> = T extends any ? keyof T : never;
// type BoxedValue<T, U> = keyof T[U];
// type test = BoxedValue<BoxType["modData"], {}>;

// type type1 = BoxType["modData"]["actions"];
// type type2 = BoxType["modData"]["match"];
// type type3<T> =T extends type1|type2;
// type type4 = keyof type3

const SectionMenu = <SecName extends sectionNameType>({
  sectionName,
  box,
  fields,
}: {
  sectionName: SecName;
  box: BoxType;
  fields: fieldsType<SecName>;
}) => {
  const c = useContext(CanvasContext);

  type fieldName = keyof BoxType["modData"][SecName];
  // let tmp: fieldsNameType<SecName>;
  // let tmp2: keyof BoxType["modData"][SecName];
  // tmp2 = "OUTPUT";
  // tmp = "OUTPUT";

  // const handleAddField = <Sec extends sectionNameType, K extends keyof BoxType["modData"][Sec]>(
  //   sec: sectionName,
  //   key: K
  // ) => {
  //   let newBox = { ...box };
  //   newBox.modData[sec] = Object.assign(newBox.modData[sec], { [key]: "" });
  //   c.setBoxes((boxes) => boxes.map((box) => (box.id === newBox.id ? newBox : box)));
  // };

  const handleAddField = (key: fieldsNameType<SecName>) => {
    let newBox = { ...box };
    newBox.modData[sectionName] = Object.assign(newBox.modData[sectionName], { [key]: "" });
    c.setBoxes((boxes) => boxes.map((box) => (box.id === newBox.id ? newBox : box)));
  };

  const handleDelField = (key: fieldName) => {
    let newBox = { ...box };
    let tmp = key;
    // key = "eliav";
    delete newBox.modData[sectionName][key];
    c.setBoxes((boxes) => boxes.map((box) => (box.id === newBox.id ? newBox : box)));
  };

  const handleInputChange = (value: string, key: fieldName) => {
    let newBox = { ...box };
    newBox.modData[sectionName] = Object.assign(newBox.modData[sectionName], { [key]: value });
    c.setBoxes((boxes) => boxes.map((box) => (box.id === newBox.id ? newBox : box)));
  };

  // fields[5][2]
  // fields.find<fieldsType>(f=>Array.isArray(f))
  let tmp1: ["1", "2", "3"] | [1, 2, 3] = ["1", "2", "3"];

  // tmp1.find((f) => f[1] === "3");
  // (fields as typeof fields).map((f) => f);
  // (fields as any).map((f) => f);
  return (
    <div className="section">
      <PopUpMenu handleAddField={handleAddField} fields={fields} secName={sectionName} />
      <div className="sectionHeader">{sectionName}:</div>
      {Object.keys(box.modData[sectionName]).map((key) => (
        <div className="propBox" key={key}>
          <div className="propField propKey">
            <Popup
              trigger={<div>{key}</div>}
              position="left center"
              on="hover"
              mouseLeaveDelay={0}
              mouseEnterDelay={400}
              contentStyle={{ border: "none", width: 200 }}
              arrow={true}
            >
              {(fields as any).find((f: typeof fields[number]) => f[0] === key)[2]}
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
              value={(box as any).modData[sectionName][key]}
              className="inputField"
              placeholder="Enter Value..."
              onChange={({ target: { value } }) => handleInputChange(value, key as fieldName)}
              style={{ fontSize: "0.9em" }}
            />
          </div>
          <DeleteOutlinedIcon
            fontSize={"large"}
            // icon="delete"
            className="button addButton"
            onClick={() => handleDelField(key as fieldName)}
          />
        </div>
      ))}
    </div>
  );
};

const PopUpMenu = <SecName extends sectionNameType>({
  handleAddField,
  fields,
  secName,
}: {
  fields: fieldsType<SecName>;
  handleAddField: (key: fieldsNameType<SecName>) => void;
  secName: SecName;
}) => {
  const [filterField, setFilterField] = useState("");

  // type fieldName = keyof BoxType["modData"][SecName];

  fields = fields
    ? filterField
      ? (fields as any).filter((f: fieldsType<SecName>[number]) => f[0].includes(filterField))
      : fields
    : [];

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
          {(fields as any).map((field: fieldsType<SecName>[number]) => (
            <Popup
              key={field[0]}
              // {()=>{
              //   let tmp = field[0];

              // }}
              trigger={
                <div key={field[0]} className="menu-item" onClick={() => handleAddField(field[0])}>
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
                {field[2] as any}
              </Popup>
            </Popup>
          ))}
        </div>
      </div>
    </Popup>
  );
};

// export default React.memo(({ box: boxProp }) => {
//   const c = useContext(CanvasContext);
//   if (!boxProp.modData) boxProp.modData = { match: {}, actions: {} };
//   const handleClose = () => {
//     c.setBoxes((boxes) =>
//       boxes.map((box) =>
//         box.id === boxProp.id
//           ? {
//               ...box,
//               menuWindowOpened: false,
//             }
//           : box
//       )
//     );
//   };

//   return (
//     <Draggable enableUserSelectHack={false} defaultPosition={{ x: boxProp.x, y: boxProp.y - 100 }}>
//       <div className="menuWindowContainer" onClick={(e) => e.stopPropagation()}>
//         <CloseOutlinedIcon fontSize={"large"} className="button closeButton" onClick={handleClose} />
//         <div className={"header"}>{`${boxProp.id}`}</div>
//         <hr style={{ width: "90%" }} />
//         <div className="propsContainer">
//           <SectionMenu sectionName="match" box={boxProp} fields={matchFields} />
//           <SectionMenu sectionName="actions" box={boxProp} fields={actionsFields} />
//         </div>
//       </div>
//     </Draggable>
//   );
// });

export default React.memo(ModBoxWindow);
