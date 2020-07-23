import React from "react";
import { switchSelfType } from "../../SwitchView";
import Draggable from "react-draggable";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
// import { matchFieldsType } from "../components/aclsFields";
import FlowDetails from "./FlowDetails";

type SwitchDetailsWindowProps = {
  setSwitchDetailsWindow: (value: React.SetStateAction<boolean>) => void;
  flowEntries: switchSelfType["flowEntries"];
};

export default ({ setSwitchDetailsWindow, flowEntries = [] }: SwitchDetailsWindowProps) => {
  return (
    <Draggable enableUserSelectHack={false}>
      <div className="switchDetailsWindow" onClick={(e) => e.stopPropagation()}>
        <CloseOutlinedIcon fontSize={"large"} className="button closeButton" onClick={() => setSwitchDetailsWindow(false)} />
        <div className={"header"}>{`Flow Entries`}</div>
        <hr style={{ width: "90%" }} />
        {flowEntries.map((flowEntry, i) =>
          flowEntry.isSynced ? (
            <FlowDetails key={JSON.stringify(flowEntry.details.match)} {...{ flowEntry, i }}></FlowDetails>
          ) : null
        )}
        {/* <h3>unconfirmed flows</h3>
        {flowEntries.map((flowEntry, i) =>
          flowEntry.isSynced ? null : (
            <FlowDetails key={JSON.stringify(flowEntry.details.match)} {...{ flowEntry, i }}></FlowDetails>
          )
        )} */}
      </div>
      {/* </Rnd> */}
    </Draggable>
  );
};
