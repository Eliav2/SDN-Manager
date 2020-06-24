import React, { useState, useRef, createContext, useEffect, useCallback, useMemo } from "react";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import "./SwitchView.css";
import Box, { BoxType } from "./components/Box";
import TopBar, { actionsTypes } from "./components/TopBar";
import XarrowWrapper, { XarrowWrapperType } from "./components/XarrowWrapper";
import ModBoxWindow from "./windows/ModBoxWindow";
import { useParams } from "react-router";
import { proxyAddress, switchesType, portType } from "../../App";
import PortsBar from "./components/PortsBar";
import TestComponent from "./components/TestComponent";
import BounceLoader from "react-spinners/BounceLoader";
import SwitchDetailsWindow from "./windows/SwitchDetailsWindow";
import _ from "lodash";
import { PortType } from "./components/Port";
import { xarrowPropsType, refType } from "react-xarrows";

// import MaterialIcon from "material-icons-react";

// const shapes = ["wideBox", "tallBox", "portBox"];

type CanvasContextType = {
  setPorts: React.Dispatch<
    React.SetStateAction<
      {
        shape: string;
        id: string;
        name: string;
        port: portType;
        ref: any;
      }[]
    >
  >;
  setBoxes: React.Dispatch<React.SetStateAction<BoxType[]>>;
  setLines: React.Dispatch<React.SetStateAction<any[]>>;
  selected: selectedType;
  setSelected: React.Dispatch<React.SetStateAction<selectedType>>;
  actionState: actionsTypes;
  setActionState: React.Dispatch<React.SetStateAction<actionsTypes>>;
  handleBoxClick: (e: any, box: any) => void;
  chooseBoxBackground: (box: any) => string;
  addBox: (x: any, y: any, shape: any) => void;
  addLine: ({ startBoxId, endBoxId }: { startBoxId: string; endBoxId: string }) => void;
  removeSelectedBox: () => void;
  addLineToSelectedBox: (box: any) => void;
  removeSelectedLine: () => void;
  openModsWindowOfSelected: () => void;
  handleSelect: (e: any, box?: any) => void;
  toggleFlowVisibility: (flow: any) => void;
};

export const CanvasContext = createContext<CanvasContextType>(null);
export const constants = { draggingGrid: [1, 1] };
export const dndTypes = {
  toolBoxItem: "toolBoxItem",
};

const boxShapes = ["modBox"] as const;

export type boxShapesType = typeof boxShapes[number];
export type selectedType = BoxType | PortType | XarrowWrapperType;

type flowEntryType = {
  actions: string[];
  byte_count: number;
  cookie: number;
  duration_nsec: number;
  duration_sec: number;
  flags: number;
  hard_timeout: number;
  idle_timeout: number;
  length: number;
  match: { [key: string]: string | number };
  packet_count: number;
  priority: number;
  table_id: number;
};

export type switchSelfType = switchesType[string] & {
  flowEntries: {
    details: flowEntryType;
    visible: boolean;
  }[];
};

export type modXarrowPropsType = Omit<xarrowPropsType, "start" | "end"> & { start: string; end: string };

export type lineType = {
  // props: { [P in keyof xarrowPropsType]: xarrowPropsType[P] };
  props: modXarrowPropsType;
};

const SwitchView = (props: { switches: switchesType }) => {
  // console.log(props.switches);
  const { dpid } = useParams<{ dpid: string }>();
  const [switchSelf, setSwitchSelf] = useState<switchSelfType>({ ...props.switches[dpid], flowEntries: [] });
  const [ports, setPorts] = useState(
    switchSelf.ports.map((p) => ({
      shape: "portBox" as const,
      id: p.port_no,
      name: p.name,
      port: p,
      ref: null,
    }))
  );
  const [dataFetched, setDataFetched] = useState(false);

  const [switchDetailsWindow, setSwitchDetailsWindow] = useState(false);
  useEffect(() => {
    fetch(proxyAddress + "http://localhost:8080/stats/flow/" + dpid)
      .then((res) => res.json())
      .then((result: { [dpid: string]: flowEntryType[] }) => {
        setDataFetched(true);
        setSwitchSelf({ ...switchSelf, flowEntries: result[dpid].map((f) => ({ details: f, visible: false })) });
      });
  }, []);

  const toggleFlowVisibility = useCallback(
    (flow) => {
      setSwitchSelf((switchSelf) => {
        let newFlow = switchSelf.flowEntries.find((f) => _.isEqual(f, flow));
        newFlow.visible = !newFlow.visible;
        return { ...switchSelf };
      });
    },
    [switchSelf]
  );

  // const focusedWindow

  // const drawFlow = useCallback((flow) => {});

  const [boxes, setBoxes] = useState<BoxType[]>([
    { id: "box1", x: 50, y: 50 },
    // { id: "box2", ...boxDefaultProps },
    // {
    //   id: "box1",
    //   // x: 0,
    //   // y: 30,
    //   // type: "middleBox",
    //   // modData: { match: {}, actions: {} },
    // },
    // {
    //   id: "box2",
    //   // x: 10x`0,
    //   // y: 300,
    //   // type: "middleBox",
    //   // modData: { match: {}, actions: {} },
    // },
  ]);
  // console.log("boxes", boxes);
  const [lines, setLines] = useState<lineType[]>([
    // {
    //   props: {
    //     start: "box1",
    //     end: "box2",
    //     // endAnchor: "middle",
    //     strokeWidth: 10,
    //     label: {
    //       middle: { text: "clickMe!", extra: { alignmentBaseline: "text-after-edge" } },
    //     },
    //   },
    // },
  ]);

  // selected:{id:string,type:"arrow"|"box"}
  const [selected, setSelected] = useState<selectedType>(null);
  const [actionState, setActionState] = useState<actionsTypes>("Normal");

  const handleSelect = useCallback(
    (e, box?) => {
      if (e === null) {
        setSelected(null);
        setActionState("Normal");
      } else {
        setSelected(box);
      }
    },
    // [selected, actionState]
    []
  );

  const checkExistence = useCallback(
    (id) => {
      return [...boxes, ...ports].map((b) => b.id).includes(id);
    },
    [boxes, ports]
  );

  const addBox = useCallback(
    (x, y, shape) => {
      x -= x % constants.draggingGrid[0];
      y -= y % constants.draggingGrid[1];
      let l = boxes.length;
      while (checkExistence("box" + l)) l++;
      var newName = prompt("Enter box name: ", "box" + l);
      while (checkExistence(newName)) newName = prompt("name taken,choose other: ");
      if (newName) {
        let newBox = { id: newName, x, y, shape };
        setBoxes([...boxes, newBox]);
      }
    },
    [boxes.length, JSON.stringify(boxes.map((b) => b.menuWindowOpened))]
  );

  const handleDropBox = useCallback(
    (e) => {
      let shape = e.dataTransfer.getData("shape");
      if (boxShapes.includes(shape)) {
        let { x, y } = e.target.getBoundingClientRect();
        x = e.clientX - x;
        y = e.clientY - y;
        addBox(x, y, shape);
      }
    },
    [boxes.length, JSON.stringify(boxes.map((b) => b.menuWindowOpened)), selected, addBox]
  );

  const handleBoxClick = useCallback(
    (e, box) => {
      e.stopPropagation(); //so only the click event on the box will fire on not on the container itself
      if (actionState === "Normal") {
        handleSelect(e, box);
      } else if (actionState === "Add Connections" && selected.id !== box.id && !box.id.includes(":<input>")) {
        addLineToSelectedBox(box);
      } else if (actionState === "Remove Connections") {
        setLines((lines) => lines.filter((line) => !(line.props.start === selected.id && line.props.end === box.id)));
      }
    },
    [actionState, selected]
  );

  const chooseBoxBackground = useCallback(
    (box) => {
      let background = null;
      if (selected && selected.id === box.id) {
        background = "rgb(200, 200, 200)";
      } else if (
        (actionState === "Add Connections" &&
          lines.filter((line) => line.props.start === selected.id && line.props.end === box.id).length === 0 &&
          !box.id.includes(":<input>")) ||
        (actionState === "Remove Connections" &&
          lines.filter((line) => line.props.start === selected.id && line.props.end === box.id).length > 0)
      ) {
        background = "LemonChiffon";
      }
      return background;
    },
    [actionState, selected]
  );

  // const handleAddPort = (e) => {
  //   let l = ports.length;
  //   while (checkExistence("static" + l)) l++;
  //   let newName = prompt("Enter port name: ", "static" + l);
  //   while (checkExistence(newName)) newName = prompt("name taken,choose other: ");
  //   let d = { portsInputsBar: "input", portsOutputsBar: "output" };
  //   if (newName) {
  //     let newItr = { id: newName, shape: "portBox", type: d[e.target.id] };
  //     setPorts([...ports, newItr]);
  //   }
  // };

  const addLine = useCallback(
    ({ startBoxId, endBoxId }: { startBoxId: string; endBoxId: string }) => {
      // add line from selected box to passed 'box'
      setLines((lines) => [
        ...lines,
        {
          props: { start: startBoxId, end: endBoxId },
        },
      ]);
    },
    [lines.length, selected]
  );

  const removeSelectedBox = useCallback(() => {
    if (window.confirm(`are you sure you want to delete ${selected.id}?`)) {
      // first remove any lines connected to the node.
      setLines((lines) => {
        return lines.filter((line) => !(line.props.start === selected.id || line.props.end === selected.id));
      });
      // remove box
      setBoxes((boxes) => boxes.filter((box) => !(box.id === selected.id)));
      handleSelect(null);
    }
  }, [boxes.length, selected]);

  const addLineToSelectedBox = useCallback(
    (box: BoxType) => {
      // add line from selected box to passed 'box'
      setLines((lines) => [
        ...lines,
        {
          props: { start: selected.id as string, end: box.id },
        },
      ]);
    },
    [lines.length, selected]
  );

  const removeSelectedLine = useCallback(() => {
    setLines((lines: lineType[]) =>
      lines.filter(
        (line) =>
          !(
            line.props.start === (selected as XarrowWrapperType).id.start &&
            line.props.end === (selected as XarrowWrapperType).id.end
          )
      )
    );
  }, [lines.length, selected]);

  const openModsWindowOfSelected = useCallback(() => {
    setBoxes((boxes) =>
      boxes.map((box) => {
        return box.id === selected.id
          ? {
              ...box,
              menuWindowOpened: true,
            }
          : box;
      })
    );
  }, [selected]);

  // const ca
  //

  const canvasProps = useMemo(
    () => ({
      setPorts,
      setBoxes,
      setLines,
      selected,
      setSelected,
      actionState,
      setActionState,
      handleBoxClick,
      chooseBoxBackground,
      addBox,
      addLine,
      removeSelectedBox,
      addLineToSelectedBox,
      removeSelectedLine,
      openModsWindowOfSelected,
      handleSelect,
      toggleFlowVisibility,
    }),
    [
      setPorts,
      setBoxes,
      setLines,
      selected,
      setSelected,
      actionState,
      setActionState,
      handleBoxClick,
      chooseBoxBackground,
      addBox,
      addLine,
      removeSelectedBox,
      addLineToSelectedBox,
      removeSelectedLine,
      openModsWindowOfSelected,
      handleSelect,
      toggleFlowVisibility,
    ]
  );
  console.log("SwitchView rendered");

  return (
    <div>
      <div className="canvasStyle" id="canvas" onClick={() => handleSelect(null)}>
        {dataFetched ? (
          <CanvasContext.Provider value={canvasProps}>
            <TestComponent {...{ canvasProps }} />

            <div className="switchTopBar">
              <div className="switchTitle">{switchSelf.name}</div>
              <InfoOutlinedIcon
                fontSize={"large"}
                // color="black"
                className="infoButton"
                onClick={() => setSwitchDetailsWindow(true)}
              />
            </div>
            <div className="innerCanvas">
              <div className="toolboxMenu">
                <div className="toolboxTitle">Drag & drop me!</div>
                <hr />
                <div className="toolboxContainer">
                  {boxShapes.map((shapeName) => (
                    <div
                      key={shapeName}
                      className={shapeName + " grabble"}
                      onDragStart={(e) => e.dataTransfer.setData("shape", shapeName)}
                      draggable
                    >
                      {shapeName}
                    </div>
                  ))}
                </div>
              </div>
              {/* <PortsBar ports={ports} portPolarity={"input"} /> */}
              <PortsBar {...{ ports, portPolarity: "input" }} />
              <div
                id="boxesContainer"
                className="boxesContainer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDropBox}
              >
                <TopBar />

                {boxes.map((box) => (
                  <Box key={box.id} {...({ box, boxes } as const)} />
                ))}
              </div>
              {/* <PortsBar ports={ports} portPolarity={"output"} /> */}
              <PortsBar {...{ ports, portPolarity: "output" }} />
              {/* xarrow connections*/}
              {lines.map((line, i) => (
                <XarrowWrapper key={line.props.start + "-" + line.props.end + i} {...{ line, selected }} />
              ))}
              {/* boxes menu that may be opened */}
              {boxes.map((box) => {
                return box.menuWindowOpened ? <ModBoxWindow key={box.id} {...{ box }} /> : null;
              })}
            </div>
            {switchDetailsWindow ? (
              <SwitchDetailsWindow {...{ setSwitchDetailsWindow, flowEntries: switchSelf.flowEntries }} />
            ) : null}
          </CanvasContext.Provider>
        ) : (
          <div className="mainWindow">
            <h3>fetching switch data...</h3>
            <BounceLoader size={150} color={"#123abc"} loading={true} />
          </div>
        )}
      </div>
      {/* {console.log("//////////////////////////////////////////////////////")} */}
    </div>
  );
};
export default SwitchView;
// export default DragDropContext(HTML5Backend)(SwitchView);
