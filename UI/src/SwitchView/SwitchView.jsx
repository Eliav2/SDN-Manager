import React, { useState, useRef, createContext, useEffect, useCallback, useMemo } from "react";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import "./SwitchView.css";
import Box from "./components/Box";
import TopBar from "./components/TopBar";
import Xarrow from "./components/Xarrow";
import ModBoxWindow from "./components/ModBoxWindow";
import { useParams } from "react-router";
import { proxyAddress } from "./../App";
import PortsBar from "./components/PortsBar";
import TestComponent from "./components/TestComponent";
import BounceLoader from "react-spinners/BounceLoader";
import SwitchDetailsWindow from "./components/SwitchDetailsWindow";
import { DragDropContext, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import _ from "lodash";

// import MaterialIcon from "material-icons-react";

// const shapes = ["wideBox", "tallBox", "portBox"];
export const CanvasContext = createContext();
export const constants = { draggingGrid: [1, 1] };
export const dndTypes = {
  toolBoxItem: "toolBoxItem",
};

const shapes = ["modBox"];

// const boxDefaultProps = {
//   shape: "wideBox",
//   type: "middleBox",
//   menuWindowOpened: false,
//   x: 0,
//   y: 0,
// };

const SwitchView = (props) => {
  const { dpid } = useParams();
  const [switchSelf, setSwitchSelf] = useState({ ...props.switches[dpid], flowEntries: [] });
  const [ports, setPorts] = useState(
    switchSelf.ports.map((p) => ({
      shape: "portBox",
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
      .then((result) => {
        setDataFetched(true);
        setSwitchSelf({ ...switchSelf, flowEntries: result[dpid].map((f) => ({ details: f, visible: false })) });
        // console.log("flowEntries", flowEntries);
        // console.log("?", result);
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

  const drawFlow = useCallback((flow) => {});

  const [boxes, setBoxes] = useState([
    // { id: "box1", menuWindowOpened: true },
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
  const [lines, setLines] = useState([
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
  console.log("boxes", boxes);

  // selected:{id:string,type:"arrow"|"box"}
  const [selected, setSelected] = useState(null);
  const [actionState, setActionState] = useState("Normal");

  const handleSelect = useCallback(
    (e, box) => {
      if (e === null) {
        setSelected(null);
        setActionState("Normal");
      } else {
        setSelected(box);
      }
    },
    [selected, actionState]
  );

  const checkExistence = useCallback(
    (id) => {
      return [...boxes, ...ports].map((b) => b.id).includes(id);
    },
    [boxes, ports]
  );

  const handleDropBox = useCallback(
    (e) => {
      let shape = e.dataTransfer.getData("shape");
      if (shapes.includes(shape)) {
        let { x, y } = e.target.getBoundingClientRect();
        x = e.clientX - x;
        y = e.clientY - y;
        // console.log(e.clientX, e.screenX, e.pageX);
        // console.log(e.target.offsetLeft);
        addBox(x, y, shape);
      }
    },
    [boxes.length, JSON.stringify(boxes.map((b) => b.menuWindowOpened)), selected]
  );

  const handleBoxClick = useCallback(
    (e, box) => {
      e.stopPropagation(); //so only the click event on the box will fire on not on the container itself
      if (actionState === "Normal") {
        handleSelect(e, box);
      } else if (actionState === "Add Connections" && selected.id !== box.id && !box.id.includes(":<input>")) {
        addLine(box);
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

  const removeBox = useCallback(() => {
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

  const addLine = useCallback(
    (box) => {
      // add line from selected box to passed 'box'
      setLines((lines) => [
        ...lines,
        {
          props: { start: selected.id, end: box.id },
        },
      ]);
    },
    [lines.length, selected]
  );

  const removeSelectedLine = useCallback(() => {
    setLines((lines) =>
      lines.filter((line) => !(line.props.start === selected.id.start && line.props.end === selected.id.end))
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
      // lines,
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
      removeBox,
      addLine,
      removeSelectedLine,
      openModsWindowOfSelected,
      handleSelect,
      toggleFlowVisibility,
    }),
    [
      // lines,
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
      removeBox,
      addLine,
      removeSelectedLine,
      openModsWindowOfSelected,
      handleSelect,
      toggleFlowVisibility,
    ]
  );

  // const canvasProps = {
  //   // ports,
  //   // boxes,
  //   // lines,
  //   setPorts,
  //   setBoxes,
  //   setLines,
  //   selected,
  //   setSelected,
  //   actionState,
  //   setActionState,
  //   handleBoxClick,
  //   chooseBoxBackground,
  //   addBox,
  //   removeBox,
  //   addLine,
  //   removeSelectedLine,
  //   openModsWindowOfSelected,
  // };

  // console.log("SwitchView rendered");

  // console.log("switchSelf", switchSelf);

  return (
    <div>
      <div className="canvasStyle" id="canvas" onClick={() => handleSelect(null)}>
        {dataFetched ? (
          <DndProvider backend={HTML5Backend}>
            <CanvasContext.Provider value={canvasProps}>
              <TestComponent canvasProps={canvasProps} />

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
                    {shapes.map((shapeName) => (
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
                <PortsBar ports={ports} portType={"input"} />
                {/* <PortsBar {...{ ports, portType: "input" }} /> */}
                <div
                  id="boxesContainer"
                  className="boxesContainer"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDropBox}
                >
                  <TopBar />

                  {boxes.map((box) => (
                    <Box key={box.id} {...{ box, boxes }} />
                  ))}
                </div>
                <PortsBar ports={ports} portType={"output"} />
                {/* <PortsBar {...{ ports, portType: "output" }} /> */}
                {/* xarrow connections*/}
                {lines.map((line, i) => (
                  <Xarrow key={line.props.start + "-" + line.props.end + i} {...{ line, selected }} />
                ))}
                {/* boxes menu that may be opened */}
                {boxes.map((box, i) => {
                  return box.menuWindowOpened ? <ModBoxWindow key={box.id} box={box} /> : null;
                })}
              </div>
              {switchDetailsWindow ? (
                <SwitchDetailsWindow {...{ setSwitchDetailsWindow, flowEntries: switchSelf.flowEntries }} />
              ) : null}
            </CanvasContext.Provider>
          </DndProvider>
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
