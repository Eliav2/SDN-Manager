import React, { useState, useContext } from "react";
import Draggable from "react-draggable";
// import MaterialIcon from "material-icons-react";
import TextField from "@material-ui/core/TextField";
import InputBase from "@material-ui/core/InputBase";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import CheckIcon from "@material-ui/icons/Check";
import SaveIcon from "@material-ui/icons/Save";
// import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import { matchFields, actionsFields } from "../../components/aclsFields";
import { CanvasContext, flowUIType } from "../../SwitchView";
import { isEqual } from "lodash";
import { flowType } from "../../../../utils/serverRequests";
import { Grid } from "@material-ui/core";
import SectionMenu from "./SectionMenu";

export default ({ flow }: { flow: flowUIType }) => {
  const c = useContext(CanvasContext);
  // if (!flow.details) flow.details = { match: {}, actions: {}, priority: 1 };

  const [matchDetails, setMatchDetails] = useState({ ...flow.details.match });
  const [actionsDetails, setActionsDetails] = useState([...flow.details.actions]);
  const [priority, setPriority] = useState(flow.details.priority || 1);

  const modDetails: flowType = {
    match: { ...matchDetails },
    actions: { ...actionsDetails },
    priority: priority,
  };

  const handleSaveChanges = (flowDetails?: flowType, checkExistence: boolean = true) => {
    const updatedFlow: flowUIType = {
      ...flow,
      details: flowDetails || modDetails,
      isSynced: true,
      box: { ...flow.box, flowDetailsModalOpen: false },
    };
    c.updateFlow({ boxID: flow.box.id, updatedFlow, checkExistence });
  };

  const handleClose = () => {
    c.updateBoxOnUi({ ...flow.box, flowDetailsModalOpen: false });
  };

  const handleConfirmFlow = () => {
    //here we should add this flow to the the vSwitch
    c.addFlowToServer({
      flow: { ...flow, details: modDetails },
      callback: (flowDetails) => handleSaveChanges(flowDetails, false),
    });
  };

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
          <CloseOutlinedIcon fontSize={"large"} className="button closeButton" onClick={handleClose} titleAccess="Close" />
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
          <Grid container justify="center">
            <TextField
              type="text"
              label="priority"
              placeholder="Enter Value..."
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              style={{ fontSize: "0.9em", margin: "8px 0" }}
            />
          </Grid>

          <SectionMenu sectionName="match" fields={matchFields} details={matchDetails} setDetails={setMatchDetails} />
          <SectionMenu sectionName="actions" fields={actionsFields} details={actionsDetails} setDetails={setActionsDetails} />
        </div>
      </div>
    </Draggable>
  );
};
