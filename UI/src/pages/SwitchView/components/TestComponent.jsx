import React, { useContext } from "react";
import { CanvasContext } from "../SwitchView";

const TestComponent = (props) => {
  //   const c = useContext(CanvasContext);
  console.log("!!!!!!!!!!!!!1TestComponent render!!!!!!!!!!!!");
  return null;
};

export default React.memo(TestComponent);