import React, { useState, useContext, useReducer } from "react";
import "./Playground.css";
import Box from "./components/Box";
import TopBar from "./components/TopBar";
import Xarrow from "./components/Xarrow";
import MenuWindow from "./components/ModBoxMenu";
import MaterialIcon from "material-icons-react";

// const shapes = ["wideBox", "tallBox", "intefaceBox"];
const shapes = ["modBox"];

const boxDefaultProps = {
  shape: "wideBox",
  type: "middleBox",
  menuWindowOpened: false,
  x: 0,
  y: 0,
};

const PlayGround = () => {
  const [interfaces, setInterfaces] = useState([
    {
      id: "ens33",
      shape: "intefaceBox",
    },
    {
      id: "ens88",
      shape: "intefaceBox",
    },
    {
      id: "lo",
      shape: "intefaceBox",
    },
  ]);

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
    //   // x: 100,
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

  // selected:{id:string,type:"arrow"|"box"}
  const [selected, setSelected] = useState(null);
  const [actionState, setActionState] = useState("Normal");

  const handleSelect = (e) => {
    if (e === null) {
      setSelected(null);
      setActionState("Normal");
    } else setSelected({ id: e.target.id, type: "box" });
  };

  const checkExsitence = (id) => {
    return [...boxes, ...interfaces].map((b) => b.id).includes(id);
  };

  const handleDropDynamic = (e) => {
    let shape = e.dataTransfer.getData("shape");
    if (shapes.includes(shape)) {
      let l = boxes.length;
      while (checkExsitence("box" + l)) l++;
      let { x, y } = e.target.getBoundingClientRect();
      var newName = prompt("Enter box name: ", "box" + l);
      while (checkExsitence(newName)) newName = prompt("name taken,choose other: ");
      if (newName) {
        let newBox = { ...boxDefaultProps, id: newName, x: e.clientX - x, y: e.clientY - y, shape };
        setBoxes([...boxes, newBox]);
      }
    }
  };

  const handleAddInterface = (e) => {
    let l = interfaces.length;
    while (checkExsitence("static" + l)) l++;
    let newName = prompt("Enter interface name: ", "static" + l);
    while (checkExsitence(newName)) newName = prompt("name taken,choose other: ");
    let d = { interfacesInputsBar: "input", interfacesOutputsBar: "output" };
    if (newName) {
      let newItr = { id: newName, shape: "intefaceBox", type: d[e.target.id] };
      setInterfaces([...interfaces, newItr]);
    }
  };

  const props = {
    interfaces,
    setInterfaces,
    boxes,
    setBoxes,
    selected,
    handleSelect,
    actionState,
    setActionState,
    lines,
    setLines,
  };

  const boxProps = {
    boxes,
    setBoxes,
    selected,
    handleSelect,
    actionState,
    setLines,
    lines,
    boxDefaultProps,
  };

  // console.log(boxes);

  return (
    <div>
      <div className="canvasStyle" id="canvas" onClick={() => handleSelect(null)}>
        <div className="toolboxMenu">
          <div className="toolboxTitle">Drag & drop me!</div>
          <hr />
          <div className="toolboxContainer">
            {shapes.map((shapeName) => (
              <div
                key={shapeName}
                className={shapeName}
                onDragStart={(e) => e.dataTransfer.setData("shape", shapeName)}
                draggable
              >
                {shapeName}
                {/* <div style={{ textAlign: "center" }}> {shapeName}</div>
                  <img src={shapeName2Icon[shapeName]} alt="SwitchIcon" className={"switchIcon"} /> */}
              </div>
            ))}
          </div>
        </div>
        <div className="interfacesBarStyle" id="interfacesInputsBar">
          <u className="interfaceTitleStyle">inputs</u>
          {interfaces.map((itr) => {
            const id = itr.id + ":<input>";
            return <Box {...boxProps} key={id} box={{ ...itr, id, name: itr.id }} position="static" sidePos="left" />;
          })}
          <div className="button" style={{ position: "absolute", bottom: 5 }} onClick={handleAddInterface}>
            <MaterialIcon size={30} icon="add" className="material-icons" />
          </div>
        </div>
        <div
          id="boxesContainer"
          className="boxesContainer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropDynamic}
        >
          <TopBar {...props} />

          {boxes.map((box) => (
            <Box {...boxProps} key={box.id} box={box} position="absolute" sidePos="middle" />
          ))}
        </div>
        <div className="interfacesBarStyle" id="interfacesOutputsBar">
          <u className="interfaceTitleStyle">outputs</u>
          {interfaces.map((itr) => {
            const id = itr.id + ":<output>";
            return <Box {...boxProps} key={id} box={{ ...itr, id, name: itr.id }} position="static" sidePos="left" />;
          })}
          <div className="button" style={{ position: "absolute", bottom: 5 }}>
            <MaterialIcon size={30} icon="add" className="material-icons" />
          </div>
        </div>

        {/* xarrow connections*/}
        {lines.map((line, i) => (
          <Xarrow
            key={line.props.start + "-" + line.props.end + i}
            line={line}
            selected={selected}
            setSelected={setSelected}
          />
        ))}

        {/* boxes menu that may be opened */}
        {boxes.map((box, i) => {
          return box.menuWindowOpened ? <MenuWindow key={box.id} setBoxes={setBoxes} box={box} boxes={boxes} /> : null;
        })}
      </div>
    </div>
  );
};
export default PlayGround;
