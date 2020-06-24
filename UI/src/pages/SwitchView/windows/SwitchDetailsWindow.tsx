import React, { useState, useContext } from "react";
import { CanvasContext, switchSelfType } from "../SwitchView";
import Draggable from "react-draggable";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";

import { BoxType } from "../components/Box";

type FlowDetailsProps = {
  i: number;
  flowEntry: switchSelfType["flowEntries"][number];
};

const FlowDetails = ({ flowEntry, i }: FlowDetailsProps) => {
  const c = useContext(CanvasContext);
  const { details } = flowEntry;
  const background = flowEntry.visible ? "LemonChiffon" : undefined;
  return (
    <div
      className="propBoxEntryPreview grayHover"
      style={{ background }}
      onClick={() => c.toggleFlowVisibility(flowEntry)}
    >
      <div style={{ width: 20 }}>{i}:</div>
      <div style={{ flex: 0.9 }}>
        {
          <ul>
            {Object.keys(details.match).map((matchKey) => (
              <li key={matchKey}>
                {matchKey}: {details.match[matchKey]}
              </li>
            ))}
          </ul>
        }
      </div>
      <div style={{ width: 30 }}>--{">"}</div>
      <div style={{ flex: 0.9 }}>{JSON.stringify(details.actions, null, 2)}</div>
      <EditOutlinedIcon fontSize={"large"} className="button" />
    </div>
  );
};

type SwitchDetailsWindowProps = {
  setSwitchDetailsWindow: (value: React.SetStateAction<boolean>) => void;
  flowEntries: switchSelfType["flowEntries"];
};

const SwitchDetailsWindow = ({ setSwitchDetailsWindow, flowEntries = [] }: SwitchDetailsWindowProps) => {
  return (
    <Draggable enableUserSelectHack={false}>
      <div className="switchDetailsWindow" onClick={(e) => e.stopPropagation()}>
        <CloseOutlinedIcon
          fontSize={"large"}
          className="button closeButton"
          onClick={() => setSwitchDetailsWindow(false)}
        />
        <div className={"header"}>{`Flow Entries`}</div>
        <hr style={{ width: "90%" }} />
        {flowEntries.map((flowEntry, i) => (
          <FlowDetails key={JSON.stringify(flowEntry.details.match)} {...{ flowEntry, i }}></FlowDetails>
        ))}
      </div>
    </Draggable>
  );
};

export default React.memo(SwitchDetailsWindow);
