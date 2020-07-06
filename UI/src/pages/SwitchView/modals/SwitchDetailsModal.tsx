import React, { useContext } from "react";
import { CanvasContext, switchSelfType, flowEntryType } from "../SwitchView";
import Draggable from "react-draggable";
import { Rnd } from "react-rnd";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
// import { matchFieldsType } from "../components/aclsFields";

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
        {flowEntries.map((flowEntry, i) =>
          flowEntry.isSynced ? (
            <FlowDetails key={JSON.stringify(flowEntry.details.match)} {...{ flowEntry, i }}></FlowDetails>
          ) : null
        )}
      </div>
      {/* </Rnd> */}
    </Draggable>
  );
};

type FlowDetailsProps = {
  i: number;
  flowEntry: flowEntryType;
};

const FlowDetails = ({ flowEntry, i }: FlowDetailsProps) => {
  const c = useContext(CanvasContext);
  const { details } = flowEntry;
  // details.
  const background = flowEntry.box.visible ? "LemonChiffon" : undefined;

  return (
    <div
      className="propBoxEntryPreview grayHover"
      style={{ background }}
      onClick={() => c.toggleFlowVisibility(flowEntry)}
    >
      <div style={{ width: 20 }}>{flowEntry.box.name}:</div>
      <div style={{ flex: 0.9 }}>
        {
          <ul>
            {(Object.keys(details.match) as Array<keyof typeof details.match>).map((matchKey) => (
              <li key={matchKey}>
                {matchKey}: {details.match[matchKey]}
              </li>
            ))}
          </ul>
        }
      </div>
      <div style={{ width: 30 }}>--{">"}</div>
      <div style={{ flex: 0.9 }}>{JSON.stringify(details.actions, null, 2)}</div>
      <EditOutlinedIcon
        fontSize={"large"}
        className={`button`}
        onClick={(e) => {
          e.stopPropagation();
          c.updateBox({ ...flowEntry.box, menuWindowOpened: !flowEntry.box.menuWindowOpened });
          // c.setBoxes((boxes) => {
          //   const newBoxes = [...boxes];
          //   const newBox = newBoxes.find((b) => b.id === JSON.stringify(flowEntry.details.match));
          //   newBox.menuWindowOpened = !newBox.menuWindowOpened;
          //   return newBoxes;
          // });
        }}
      />
      <DeleteOutlineIcon
        fontSize={"large"}
        className="button"
        onClick={(e) => {
          e.stopPropagation();
          c.delFlowFromServer(flowEntry);
        }}
      />
    </div>
  );
};

export default SwitchDetailsWindow;
