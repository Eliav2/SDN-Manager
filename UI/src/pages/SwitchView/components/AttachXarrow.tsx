import React, { useContext } from "react";
import { lineType } from "../SwitchView";
import XarrowWrapper from "./XarrowWrapper";
import { CanvasContext } from "../SwitchView";

const AttachXarrow = ({ lines = [], children }: { lines?: lineType[]; children: any }) => {
  const c = useContext(CanvasContext);

  console.log(children);
  return <>{children}</>;
};

export default AttachXarrow;
