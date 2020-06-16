import React, { useContext } from "react";
import "./TopBar.css";
import KeyboardArrowUpOutlinedIcon from "@material-ui/icons/KeyboardArrowUpOutlined";
// import MaterialIcon from "material-icons-react";
import { CanvasContext } from "./../SwitchView";

const actions = {
  modBox: ["Edit Mods", "Add Connections", "Remove Connections", "Delete"],
  portBox: ["Add Connections", "Remove Connections"],
  portBoxOut: [],
  arrow: ["Remove Connection"],
};

const TopBar = () => {
  const c = useContext(CanvasContext);

  // console.log("Topbar renderd");

  const handleEditAction = (action) => {
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
      case "Delete":
        c.removeBox();

        break;
      default:
    }
  };

  var returnTopBarApearnce = () => {
    let allowedActions = [];

    if (c.selected) {
      allowedActions = actions[c.selected.shape];
      if (c.selected.shape.includes("Box") && c.selected.id.includes(":<output>")) allowedActions = actions.portBoxOut;
    }
    switch (c.actionState) {
      case "Normal":
        return (
          <div className="actionBubblesContainer">
            {allowedActions.map((action, i) => (
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
      {returnTopBarApearnce()}
    </div>
  );
};

export default React.memo(TopBar);
