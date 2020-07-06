import React, { useContext } from "react";
import "./TopBar.css";
import KeyboardArrowUpOutlinedIcon from "@material-ui/icons/KeyboardArrowUpOutlined";
// import MaterialIcon from "material-icons-react";
import { CanvasContext } from "../SwitchView";
import { PortType } from "./Port";
import { BoxType } from "./Box";
import { Container } from "@material-ui/core";

const actions = {
  modBox: ["Edit Mods", "Add Connections", "Remove Connections", "Hide", "Delete"],
  portBox: ["Add Connections", "Remove Connections"],
  portBoxOut: [],
  arrow: ["Remove Connection"],
} as const;

type Writeable<T> = { -readonly [P in keyof T]: Writeable<T[P]> };
type ArrayElem<A> = A extends Array<infer Elem> ? Elem : never;
function elemT<T>(array: T): Array<ArrayElem<T>> {
  return array as any;
}

type actionsType = typeof actions;
type actionsKeysType = keyof actionsType;
export type actionsTypes = actionsType[actionsKeysType][number] | "Normal";

const TopBar = () => {
  const c = useContext(CanvasContext);

  // console.log("Topbar renderd");

  const handleEditAction = (action: actionsTypes) => {
    switch (action) {
      case "Add Connections":
        c.setActionState("Add Connections");
        break;
      case "Remove Connections":
        // remove connections of one arrows from box based on box that was selected
        c.setActionState("Remove Connections");
        break;
      case "Remove Connection":
        // remove connection of one arrow based on arrow that is currently selected
        c.removeSelectedLine();
        break;
      case "Edit Mods":
        c.openModsWindowOfSelected();
        break;
      case "Hide":
        console.log("asdasdasdas");
        c.toggleFlowVisibilityOfSelected();
        break;
      case "Delete":
        c.removeSelectedBox();

        break;
      default:
    }
  };

  var returnTopBarAppearance = () => {
    let allowedActions: actionsType[actionsKeysType] = [];

    if (c.selected) {
      allowedActions = actions[c.selected.shape];
      if (c.selected.shape.includes("Box") && (c.selected as BoxType | PortType).id.includes(":<output>"))
        allowedActions = actions.portBoxOut;
    }
    switch (c.actionState) {
      case "Normal":
        return (
          <div className="actionBubblesContainer">
            {elemT(allowedActions).map((action: actionsTypes, i: number) => (
              <div className="actionBubble" key={i} onClick={() => handleEditAction(action)}>
                {action}
              </div>
            ))}
          </div>
        );
      case "Add Connections":
        return (
          <div className="actionBubblesContainer">
            <p>To where connect new connection?</p>
            <div className="actionBubble" onClick={() => c.setActionState("Normal")}>
              finish
            </div>
          </div>
        );

      case "Remove Connections":
        return (
          <div className="actionBubblesContainer">
            <p>Which connection to remove?</p>
          </div>
        );
      default:
    }
  };

  return (
    <div
      className="topBarStyle"
      style={{ height: c.selected === null ? "0" : "60px" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="topBarLabel" onClick={() => c.handleSelect(null)}>
        <KeyboardArrowUpOutlinedIcon fontSize={"large"} className=" topBarToggleIcon" />
      </div>
      {returnTopBarAppearance()}
    </div>
  );
};

export default React.memo(TopBar);
