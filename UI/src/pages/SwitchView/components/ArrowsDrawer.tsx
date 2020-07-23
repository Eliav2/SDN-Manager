import React from "react";
import XarrowWrapper, { XarrowWrapperType } from "./XarrowWrapper";
import { flowUIType } from "../SwitchView";
import { PortType } from "./Port";

export default ({ flowEntries, ports }: { flowEntries: flowUIType[]; ports: PortType[] }) => {
  const visibleFlowBoxes = flowEntries.filter((f) => f.box.visible);
  const inputPortsToFlowBoxesArrows = visibleFlowBoxes.filter((f) => f.details.match && f.details.match.in_port);
  let flowBoxesToOutputPortsArrows: any[] = [];
  visibleFlowBoxes
    .filter((f) => f.details.actions)
    .forEach((f) => {
      f.details.actions
        .filter((ac) => ac && ports.map((p) => String(p.id)).includes(ac.port))
        .forEach((ac) => flowBoxesToOutputPortsArrows.push({ start: f.box.id, end: ac.port + ":<output>" }));
    });

  return (
    <>
      {inputPortsToFlowBoxesArrows.map((f) => (
        <XarrowWrapper
          line={{
            start: f.details.match.in_port + ":<input>",
            end: f.box.id,
          }}
          key={f.details.match.in_port + ":<input>" + "--" + "f.box.id"}
        />
      ))}
      {flowBoxesToOutputPortsArrows.map((f) => (
        <XarrowWrapper
          line={{
            start: f.start,
            end: f.end,
          }}
          key={f.start + "--" + f.end}
        />
      ))}
    </>
  );
};
