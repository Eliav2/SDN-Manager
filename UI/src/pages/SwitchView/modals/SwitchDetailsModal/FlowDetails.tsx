import React, { useContext } from "react";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Tooltip from "@material-ui/core/Tooltip";
import { CanvasContext, switchSelfType, flowUIType } from "../../SwitchView";

type FlowDetailsProps = {
  i: number;
  flowEntry: flowUIType;
};

export default ({ flowEntry, i }: FlowDetailsProps) => {
  const c = useContext(CanvasContext);
  const { details } = flowEntry;
  // details.
  const background = flowEntry.box.visible ? "LemonChiffon" : undefined;

  return (
    <Tooltip
      arrow
      enterDelay={800}
      title={Object.keys(details)
        .filter((k) => k !== "actions" && k !== "match")
        .map((detailKey) => (
          <div key={detailKey} style={{ fontSize: 12 }}>
            {/* hey */}
            {detailKey}: {(details as any)[detailKey]}
          </div>
        ))}
    >
      <div className="propBoxEntryPreview grayHover" style={{ background }} onClick={() => c.toggleFlowVisibility(flowEntry)}>
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
            c.updateBoxOnUi({ ...flowEntry.box, flowDetailsModalOpen: !flowEntry.box.flowDetailsModalOpen });
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
            c.delFlow(flowEntry);
          }}
        />
      </div>
    </Tooltip>
  );
};
