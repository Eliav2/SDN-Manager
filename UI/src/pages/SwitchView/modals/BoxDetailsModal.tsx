import React, { useState, useContext } from "react";
import Draggable from "react-draggable";
// import MaterialIcon from "material-icons-react";
import TextField from "@material-ui/core/TextField";
import InputBase from "@material-ui/core/InputBase";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import CheckIcon from "@material-ui/icons/Check";
import SaveIcon from "@material-ui/icons/Save";
// import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import Popup from "reactjs-popup";
import { matchFields, actionsFields } from "../components/aclsFields";
import { CanvasContext, flowEntryType, flowEntryDetailsType } from "../SwitchView";
import { BoxType } from "../components/Box";
import { isEqual } from "lodash";

const BoxDetailsModal = ({ flow }: { flow: flowEntryType }) => {
  const c = useContext(CanvasContext);
  // if (!flow.details) flow.details = { match: {}, actions: {}, priority: 1 };

  const [matchDetails, setMatchDetails] = useState({ ...flow.details.match });
  const [actionsDetails, setActionsDetails] = useState({ ...flow.details.actions });

  const modDetails: flowEntryDetailsType = {
    match: { ...matchDetails },
    actions: { ...actionsDetails },
    priority: flow.details.priority = 1,
  };

  const handleSaveChanges = (flowDetails?: flowEntryDetailsType) => {
    // const newBox = { ...flow.box, modData: modDetails }
    // c.updateFlowOnServer(modDetails,()=> c.updateBox({ ...flow.box, modData: modDetails }));
    const updatedFlow = { ...flow, details: flowDetails ? flowDetails : modDetails, isSynced: true };
    c.updateFlowOnServer(updatedFlow.details, () => c.updateFlow(updatedFlow));

    // c.updateBox({ ...flow.box });
  };

  const handleClose = () => {
    c.updateBox({ ...flow.box, menuWindowOpened: false });
  };

  const handleConfirmFlow = () => {
    //here we should add this flow to the the vSwitch
    // c.addFlowToServer(flow, modDetails, handleSaveChanges);
    // c.addFlowToServer({ ...flow, details: modDetails });
    c.addFlowToServer({ ...flow, details: modDetails }, (flowDetails) => handleSaveChanges(flowDetails));
  };

  // console.log("ModBoxWindow render", flow);

  return (
    <Draggable enableUserSelectHack={false} defaultPosition={{ x: flow.box.x, y: flow.box.y - 100 }}>
      <div className="menuWindowContainer" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignSelf: "flex-end" }}>
          {isEqual(flow.details, { ...flow.details, ...modDetails }) === false && flow.isSynced ? (
            <>
              <SaveIcon
                titleAccess="Update changes of this flow entry on the vSwitch"
                className="button"
                fontSize={"large"}
                style={{ position: "relative" }}
                onClick={() => handleSaveChanges()}
              />
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

        {/* <div className={"header"}>{`${flow.box.name}`}</div> */}
        <div className="header">
          <InputBase
            defaultValue={flow.box.name}
            inputProps={{ "aria-label": "naked", style: { textAlign: "center" } }}
            style={{ fontSize: "1.4em" }}
            onChange={(e) => c.updateFlowName(flow.box.id, e.target.value)}
          />
        </div>
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

type sectionNameType = "actions" | "match";
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
  // details: BoxType["modData"][SecName];
  details: flowEntryDetailsType[SecName];
  setDetails: React.Dispatch<React.SetStateAction<flowEntryDetailsType[SecName]>>;
}) => {
  const c = useContext(CanvasContext);

  type fieldName = fieldsNameType<SecName>;

  const handleAddField = (key: fieldName) => {
    setDetails({ ...Object.assign(details, { [key]: "" }) });
  };

  const handleDelField = (key: fieldName) => {
    setDetails((details) => {
      // key = "OUTPUT";
      // newDetails.
      const newDetails = { ...details };
      // newDetails.
      delete (newDetails as any)[key];
      return newDetails;
    });
  };

  const handleSaveFieldChange = (value: string, key: fieldName) => {
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
  handleDelField: (key: fieldsNameType<SecName>) => void;
  handleSaveFieldChange: (value: string, key: fieldsNameType<SecName>) => void;
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
          onChange={(e) => handleSaveFieldChange(e.target.value, name as any)}
          style={{ fontSize: "0.9em" }}
        />
      </div>
      <DeleteOutlinedIcon
        titleAccess="Delete this field"
        fontSize={"large"}
        className="button addButton"
        onClick={() => handleDelField(name as fieldsNameType<SecName>)}
      />
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

export default BoxDetailsModal;
