////@ts-nocheck

import React, { useState, useContext } from "react";
import Draggable from "react-draggable";
// import MaterialIcon from "material-icons-react";
import TextField from "@material-ui/core/TextField";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import CheckIcon from "@material-ui/icons/Check";
import SaveIcon from "@material-ui/icons/Save";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import Popup from "reactjs-popup";
import { matchFields, actionsFields } from "../components/aclsFields";
import { CanvasContext, flowEntryType, flowEntryDetailsType } from "../SwitchView";
import { BoxType } from "../components/Box";
import { isEqual, flow } from "lodash";

const ModBoxWindow = ({ flow }: { flow: flowEntryType }) => {
  const c = useContext(CanvasContext);
  if (!flow.box.modData) flow.box.modData = { match: {}, actions: {} };

  const [matchDetails, setMatchDetails] = useState({ ...flow.box.modData.match });
  const [actionsDetails, setActionsDetails] = useState({ ...flow.box.modData.actions });

  const modDetails = { match: { ...matchDetails }, actions: { ...actionsDetails } };

  const handleSaveChanges = () => {
    // console.log("handleSaveChanges");
    // let newBox = boxProp;
    // newBox.modData = modDetails;
    c.updateBox({ ...flow.box, modData: modDetails });
    // setModDetailsBackup(modDetails);
    // c.switchSelf
    // c.setBoxes((boxes) => {
    //   const newBoxes = [...boxes];
    //   let newBox = newBoxes.find((box) => box.id === boxProp.id);
    //   newBox.modData = modDetails;
    //   return newBoxes;
    // });
  };

  // const [modDetailsBackup, setModDetailsBackup] = useState({ ...modDetails });
  // const handleRestoreChanges = () => {
  //   setActionsDetails(modDetailsBackup.actions);
  //   setMatchDetails(modDetailsBackup.match);
  // };

  const handleClose = () => {
    c.updateBox({ ...flow.box, menuWindowOpened: false });
    // c.setBoxes((boxes) =>
    //   boxes.map((box) =>
    //     box.id === boxProp.id
    //       ? {
    //           ...box,
    //           menuWindowOpened: false,
    //         }
    //       : box
    //   )
    // );
  };

  const handleConfirmFlow = () => {
    //here we should add this flow to the the vSwitch
    console.log("handleConfirmFlow");
    // const flow:flowEntryDetailsType = {match:matchDetails, actions: actionsDetails,priority:1}
    c.addFlowToServer(flow, modDetails, handleSaveChanges);
  };

  console.log("ModBoxWindow render", flow);

  return (
    <Draggable enableUserSelectHack={false} defaultPosition={{ x: flow.box.x, y: flow.box.y - 100 }}>
      <div className="menuWindowContainer" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignSelf: "flex-end" }}>
          {isEqual(modDetails, flow.box.modData) === false && flow.isSynced ? (
            <>
              <SaveIcon
                titleAccess="Update changes of this flow entry on the vSwitch"
                className="button"
                fontSize={"large"}
                style={{ position: "relative" }}
                onClick={() => handleSaveChanges()}
              />
              {/* <SettingsBackupRestoreIcon
                titleAccess="Update changes of this flow entry on the vSwitch"
                className="button"
                fontSize={"large"}
                style={{ position: "relative" }}
                onClick={() => handleRestoreChanges()}
              /> */}
            </>
          ) : null}
          <CloseOutlinedIcon
            fontSize={"large"}
            className="button closeButton"
            onClick={handleClose}
            titleAccess="Close"
          />
          {flow.isSynced ? null : (
            <CheckIcon
              fontSize={"large"}
              className="button closeButton"
              onClick={handleConfirmFlow}
              titleAccess="Confirm new flow"
            />
          )}
        </div>

        <div className={"header"}>{`${flow.box.name}`}</div>
        <hr style={{ width: "90%" }} />
        <div className="propsContainer">
          <SectionMenu sectionName="match" fields={matchFields} details={matchDetails} setDetails={setMatchDetails} />
          <SectionMenu
            sectionName="actions"
            fields={actionsFields}
            details={actionsDetails}
            setDetails={setActionsDetails}
          />
        </div>
      </div>
    </Draggable>
  );
};

type sectionNameType = keyof BoxType["modData"];
type fieldsType<secName extends sectionNameType> = secName extends "match" ? typeof matchFields : typeof actionsFields;
type fieldsNameType<secName extends sectionNameType> = fieldsType<secName>[number][0];

const SectionMenu = <SecName extends sectionNameType>({
  sectionName,
  fields,
  details,
  setDetails,
}: {
  sectionName: SecName;
  fields: fieldsType<SecName>;
  details: BoxType["modData"][SecName];
  setDetails: React.Dispatch<React.SetStateAction<BoxType["modData"][SecName]>>;
}) => {
  const c = useContext(CanvasContext);

  type fieldName = keyof BoxType["modData"][SecName];

  const handleAddField = (key: fieldsNameType<SecName>) => {
    // let newBox = { ...box };
    // newBox.modData[sectionName] = Object.assign(newBox.modData[sectionName], { [key]: "" });
    // c.setBoxes((boxes) => boxes.map((box) => (box.id === newBox.id ? newBox : box)));
    console.log("handleAddField details", details);

    setDetails({ ...Object.assign(details, { [key]: "" }) });
  };

  const handleDelField = (key: fieldName) => {
    // let newBox = { ...box };
    // delete newBox.modData[sectionName][key];
    // c.setBoxes((boxes) => boxes.map((box) => (box.id === newBox.id ? newBox : box)));
    setDetails((details) => {
      const newDetails = { ...details };
      delete newDetails[key];
      return newDetails;
    });
  };

  const handleSaveFieldChange = (value: string, key: fieldName) => {
    // let newBox = { ...box };
    // newBox.modData[sectionName] = Object.assign(newBox.modData[sectionName], { [key]: value });
    // c.setBoxes((boxes) => boxes.map((box) => (box.id === newBox.id ? newBox : box)));
    setDetails({ ...Object.assign(details, { [key]: value }) });
  };

  return (
    <div className="section">
      <PopUpMenu handleAddField={handleAddField} fields={fields} secName={sectionName} />
      <div className="sectionHeader">{sectionName}:</div>
      {Object.keys(details).map((key) => (
        <InputField
          {...{
            key,
            name: key,
            value: (details as any)[key],
            handleDelField,
            handleSaveFieldChange,
          }}
        />
      ))}
    </div>
  );
};

const InputField = <SecName extends sectionNameType>({
  name,
  value,
  handleDelField,
  handleSaveFieldChange,
}: {
  name: string;
  value: string;
  handleDelField: (key: keyof BoxType["modData"][SecName]) => void;
  handleSaveFieldChange: (value: string, key: keyof BoxType["modData"][SecName]) => void;
}) => {
  // const [value, setValue] = useState(initialValue);

  return (
    <div className="propBox" key={name}>
      <div className="propField propKey">
        <div>{name}</div>
      </div>
      <div
        className="propField propValue"
        onMouseDown={
          (e) => e.stopPropagation() // prevent the draging whan selecting text
        }
      >
        <TextField
          type="text"
          value={value}
          className="inputField"
          placeholder="Enter Value..."
          // onChange={(e) => setValue(e.target.value)}
          onChange={(e) => handleSaveFieldChange(e.target.value, name as any)}
          style={{ fontSize: "0.9em" }}
        />
      </div>
      <DeleteOutlinedIcon
        titleAccess="Delete this field"
        fontSize={"large"}
        className="button addButton"
        onClick={() => handleDelField(name as keyof BoxType["modData"][SecName])}
      />
      {/* {initialValue !== value ? (
        <SaveIcon
          titleAccess="Save changes on current field"
          fontSize={"large"}
          style={{ right: 60 }}
          className="button addButton"
          onClick={() => handleSaveFieldChange(value, name as any)}
        />
      ) : null} */}
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

export default ModBoxWindow;
