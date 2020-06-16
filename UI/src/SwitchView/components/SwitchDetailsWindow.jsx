import React, { useState, useContext } from "react";
import { CanvasContext } from "./../SwitchView";
import Draggable from "react-draggable";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";

const SwitchDetailsWindow = ({ setSwitchDetailsWindow, flowEnteries = [] }) => {
  //   console.log(flowEnteries);
  return (
    <Draggable enableUserSelectHack={false}>
      <div className="switchDetailsWindow" onClick={(e) => e.stopPropagation()}>
        <CloseOutlinedIcon
          fontSize={"large"}
          className="button closeButton"
          onClick={() => setSwitchDetailsWindow(false)}
        />
        <div className={"header"}>{`Flow Enteries`}</div>
        <hr style={{ width: "90%" }} />
        {flowEnteries.map((f, i) => (
          <div className="propBoxEnteryPreview" style={{}} key={i}>
            <div style={{ width: 20 }}>{i}:</div>
            <div style={{ flex: 0.9 }}>{JSON.stringify(f.match, null, 2)}</div>
            <div style={{ width: 30 }}>--></div>
            <div style={{ flex: 0.9 }}>{JSON.stringify(f.actions, null, 2)}</div>
          </div>
        ))}
      </div>
    </Draggable>
  );
};

export default React.memo(SwitchDetailsWindow);
