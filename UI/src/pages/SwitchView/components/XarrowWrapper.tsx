import React, { useState, useContext } from "react";
import Xarrow, { xarrowPropsType } from "react-xarrows";
import { CanvasContext, lineType, selectedType } from "../SwitchView";

//{props: {line, setSelected, selected}}

type Optional<T> = { [P in keyof T]?: T[P] };
type Required<T> = { [K in keyof T]?: T[K] };

export type XarrowWrapperType = {
  id: { start: string; end: string };
  shape?: "arrow";
};

const XarrowWrapper = ({ line }: { line: lineType }) => {
  const c = useContext(CanvasContext);

  const [state, setState] = useState({ color: line.color });
  // console.log(props);
  // console.log("Xarrow renderd");

  const defProps: Optional<xarrowPropsType> = {
    consoleWarning: false,
    passProps: {
      onMouseEnter: () => setState({ color: "IndianRed" }),
      onMouseLeave: () => setState({ color: line.color }),
      onClick: (e) => {
        e.stopPropagation(); //so only the click event on the arrow will fire on not on the conainer itself
        c.setSelected({
          id: { start: line.start as string, end: line.end as string },
          shape: "arrow",
        });
        c.setActionState("Normal");
      },
      cursor: "pointer",
    },
  };
  let color = state.color;
  let startAnchor = (line.start as string).includes(":<input>") ? ("right" as const) : ("auto" as const);
  let endAnchor = (line.end as string).includes(":<output>") ? ("left" as const) : ("auto" as const);
  if (
    c.selected &&
    c.selected.shape === "arrow" &&
    c.selected.id.start === line.start &&
    c.selected.id.end === line.end
  ) {
    color = "red";
  }
  return <Xarrow startAnchor={startAnchor} endAnchor={endAnchor} {...{ ...defProps, ...line, ...state, color }} />;
};

export default React.memo(XarrowWrapper, () => false);
