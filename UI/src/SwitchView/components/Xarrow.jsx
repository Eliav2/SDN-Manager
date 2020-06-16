import React, { useState, useContext } from "react";
import Xarrow from "react-xarrows";
import { CanvasContext } from "./../SwitchView";

//{props: {line, setSelected, selected}}
export default React.memo(
  ({ line: { props } }) => {
    const c = useContext(CanvasContext);

    const [state, setState] = useState({ color: props.color });
    // console.log(props);
    // console.log("Xarrow renderd");

    const defProps = {
      consoleWarning: false,
      passProps: {
        onMouseEnter: () => setState({ color: "IndianRed" }),
        onMouseLeave: () => setState({ color: props.color }),
        onClick: (e) => {
          e.stopPropagation(); //so only the click event on the arrow will fire on not on the conainer itself
          c.setSelected({
            id: { start: props.start, end: props.end },
            shape: "arrow",
          });
          c.setActionState("Normal");
        },
        cursor: "pointer",
      },
    };
    let color = state.color;
    let startAnchor = props.start.includes(":<input>") ? "right" : "auto";
    let endAnchor = props.end.includes(":<output>") ? "left" : "auto";
    if (
      c.selected &&
      c.selected.shape === "arrow" &&
      c.selected.id.start === props.start &&
      c.selected.id.end === props.end
    ) {
      color = "red";
    }
    return <Xarrow startAnchor={startAnchor} endAnchor={endAnchor} {...{ ...defProps, ...props, ...state, color }} />;
  },
  () => false
);
