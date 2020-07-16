import React, { useState, useContext, useRef } from "react";
import ConnectPointsWrapper from "./ConnectPointsWrapper";
import { CanvasContext, lineType } from "../SwitchView";
import { portPolarityType } from "./PortsBar";
import Tooltip from "@material-ui/core/Tooltip";
import { portDetailsType } from "../../../utils/serverRequests";

export type PortType = {
  id: string;
  name: string;
  port: portDetailsType;
  ref: React.MutableRefObject<any>;
  shape: "portBox";
};

const Port = ({ port, portPolarity, lines }: { port: PortType; portPolarity: portPolarityType; lines: lineType[] }) => {
  const c = useContext(CanvasContext);
  const [wasDragged, setWasDragged] = useState(false);
  let background = c.chooseBoxBackground(port);
  port.ref = useRef();

  return (
    <div>
      <Tooltip
        interactive
        arrow
        enterDelay={800}
        title={(Object.keys(port.port) as Array<keyof portDetailsType>).map((detail, i) => {
          return (
            <div key={detail} style={{ fontSize: 13, marginBottom: 2 }}>
              {detail}: {port.port[detail]}
              <br />
            </div>
          );
        })}
      >
        <div>
          <div
            ref={port.ref}
            className={`portBox hoverMarker`}
            style={{ background }}
            onClick={(e) => {
              if (wasDragged === false) c.handleBoxClick(e, port);
              setWasDragged(false);
            }}
            id={port.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              if (e.dataTransfer.getData("arrow") !== port.id) {
                if (portPolarity === "output")
                  c.addLine({ startBoxId: e.dataTransfer.getData("arrow"), endBoxId: port.id });
              }
            }}
          >
            <ConnectPointsWrapper element={port} handlers={portPolarity === "input" ? ["right"] : []} />
            <div>
              {port.name}
              <br />
              (...{port.port.hw_addr.slice(-5)})
              <br />({port.port.port_no})
            </div>
          </div>

          {/* {lines
            .filter((line) => line.props.start === port.id)
            .map((line, i) => (
              <XarrowWrapper key={line.props.start + "-" + line.props.end + i} {...{ line, selected: c.selected }} />
            ))} */}
        </div>
      </Tooltip>
    </div>
    // <div>
    //   <Popup
    //     trigger={
    //       // <AttachXarrow>

    //       <div
    //         ref={port.ref}
    //         className={`portBox hoverMarker`}
    //         style={{ background }}
    //         onClick={(e) => {
    //           if (wasDragged === false) c.handleBoxClick(e, port);
    //           setWasDragged(false);
    //         }}
    //         id={port.id}
    //         onDragOver={(e) => e.preventDefault()}
    //         onDrop={(e) => {
    //           if (e.dataTransfer.getData("arrow") !== port.id) {
    //             if (portPolarity === "output")
    //               c.addLine({ startBoxId: e.dataTransfer.getData("arrow"), endBoxId: port.id });
    //           }
    //         }}
    //       >
    //         <ConnectPointsWrapper element={port} handlers={portPolarity === "input" ? ["right"] : []} />
    //         <div>
    //           {port.name}
    //           <br />
    //           (...{port.port.hw_addr.slice(-5)})
    //           <br />({port.port.port_no})
    //         </div>
    //       </div>
    //       // {/* </AttachXarrow> */}
    //     }
    //     position="left center"
    //     on="hover"
    //     closeOnDocumentClick
    //     mouseLeaveDelay={100}
    //     mouseEnterDelay={500}
    //     contentStyle={{ width: "max-content" }}
    //     arrow={true}
    //   >
    //     <div>
    //       {(Object.keys(port.port) as Array<keyof portDetailsType>).map((detail, i) => {
    //         detail = detail;
    //         let s = detail;
    //         return (
    //           <div key={detail}>
    //             {detail}: {port.port[detail]}
    //             <br />
    //           </div>
    //         );
    //       })}
    //       {/* {lines
    //         .filter((line) => line.props.start === port.id)
    //         .map((line, i) => (
    //           <XarrowWrapper key={line.props.start + "-" + line.props.end + i} {...{ line, selected: c.selected }} />
    //         ))} */}
    //     </div>
    //   </Popup>
    // </div>
  );
};

export default React.memo(Port);
