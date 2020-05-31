import React, { useState } from "react";
import Xarrow from "react-xarrows";

//{props: {line, setSelected, selected}}
export default ({ setSelected, selected, line: { props } }) => {
  const [state, setState] = useState({ color: props.color });
  // console.log(props);
  const defProps = {
    consoleWarning: false,
    passProps: {
      onMouseEnter: () => setState({ color: "IndianRed" }),
      onMouseLeave: () => setState({ color: props.color }),
      onClick: (e) => {
        e.stopPropagation(); //so only the click event on the box will fire on not on the conainer itself
        setSelected({
          id: { start: props.start, end: props.end },
          type: "arrow",
        });
      },
      cursor: "pointer",
    },
  };
  let color = state.color;
  if (selected && selected.type === "arrow" && selected.id.start === props.start && selected.id.end === props.end)
    color = "red";
  return <Xarrow {...{ ...defProps, ...props, ...state, color }} />;
};
