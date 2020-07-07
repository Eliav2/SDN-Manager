import React, { useState, createContext, useEffect, useCallback, useMemo } from "react";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import "./SwitchView.css";
import Box, { BoxType } from "./components/Box";
import TopBar, { actionsTypes } from "./components/TopBar";
import XarrowWrapper, { XarrowWrapperType } from "./components/XarrowWrapper";
import BoxDetailsModal from "./modals/BoxDetailsModal";
import { useParams, match } from "react-router";
import { proxyAddress, switchesType, portDetailsType } from "../../App";
import PortsBar from "./components/PortsBar";
import TestComponent from "./components/TestComponent";
import BounceLoader from "react-spinners/BounceLoader";
import SwitchDetailsModal from "./modals/SwitchDetailsModal";
import _ from "lodash";
import { PortType } from "./components/Port";
import { xarrowPropsType } from "react-xarrows";
import { fieldsNameType } from "./components/aclsFields";
import ToolboxMenu from "./components/ToolboxMenu";
import BoxesContainer from "./components/BoxesContainer";
// import { matchFieldsType, actionsFieldsType } from "./components/aclsFields";

// import MaterialIcon from "material-icons-react";

// const shapes = ["wideBox", "tallBox", "portBox"];

type CanvasContextType = {
  setPorts: React.Dispatch<
    React.SetStateAction<
      {
        shape: "portBox";
        id: string;
        name: string;
        port: portDetailsType;
        ref: any;
      }[]
    >
  >;
  // setBoxes: React.Dispatch<React.SetStateAction<BoxType[]>>;
  updateBox: (updatedBox: BoxType) => void;
  updateFlow: (updatedFlow: flowEntryType) => void;
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
  toggleFlowVisibilityOfSelected: () => void;
  delFlowFromServer: (flow: flowEntryType, callback?: () => void) => void;
  addFlowToServer: (flow: flowEntryType, callback?: (updatedFlowDetails: flowEntryDetailsType) => void) => void;
  updateFlowOnServer: (updatedFlow: flowEntryDetailsType, callback?: () => void) => void;
  updateFlowName: (flowId: string, newName: string) => void;
};

export const CanvasContext = createContext<CanvasContextType>(null);
export const constants = { draggingGrid: [1, 1] };

export const boxShapes = ["modBox"] as const;

export type boxShapesType = typeof boxShapes[number];
export type selectedType = BoxType | PortType | XarrowWrapperType;

export type serverSetFlowType = {
  dpid?: number;
  actions: { type: fieldsNameType<"actions">; port: number }[];
  byte_count?: number;
  cookie?: number;
  duration_nsec?: number;
  duration_sec?: number;
  flags?: number;
  hard_timeout?: number;
  idle_timeout?: number;
  length?: number;
  match: { [key in fieldsNameType<"match">]?: string };
  packet_count?: number;
  priority: number;
  table_id?: number;
};

export type serverGetFlowType = {
  actions: string[];
  byte_count?: number;
  cookie?: number;
  duration_nsec?: number;
  duration_sec?: number;
  flags?: number;
  hard_timeout?: number;
  idle_timeout?: number;
  length?: number;
  match: { [key in fieldsNameType<"match">]?: string };
  packet_count?: number;
  priority: number;
  table_id?: number;
};

// export type flowEntryDetailsUIType = {
//   match: { [key in fieldsNameType<"match">]?: string };
//   actions: { [key in fieldsNameType<"actions">]?: string };
//   byte_count?: number;
//   cookie?: number;
//   duration_nsec?: number;
//   duration_sec?: number;
//   flags?: number;
//   hard_timeout?: number;
//   idle_timeout?: number;
//   length?: number;
//   packet_count?: number;
//   priority: number;
//   table_id?: number;
// };

export type flowEntryDetailsGetType = {
  match: { [key in fieldsNameType<"match">]?: string };
  actions: string[];
  byte_count?: number;
  cookie?: number;
  duration_nsec?: number;
  duration_sec?: number;
  flags?: number;
  hard_timeout?: number;
  idle_timeout?: number;
  length?: number;
  packet_count?: number;
  priority: number;
  table_id?: number;
};

export type flowEntryDetailsType = {
  match?: { [key in fieldsNameType<"match">]?: string };
  actions?: { [key in fieldsNameType<"actions">]?: string };
  byte_count?: number;
  cookie?: number;
  duration_nsec?: number;
  duration_sec?: number;
  flags?: number;
  hard_timeout?: number;
  idle_timeout?: number;
  length?: number;
  packet_count?: number;
  priority?: number;
  table_id?: number;
};

export type flowEntryType = {
  details: flowEntryDetailsType;
  // visible: boolean;
  box: BoxType;
  isSynced: boolean;
  menuWindowOpened?: boolean;
};

export type switchSelfType = switchesType[string] & {
  flowEntries: flowEntryType[];
};

export type modXarrowPropsType = Omit<xarrowPropsType, "start" | "end"> & { start: string; end: string };

export type lineType = {
  // props: { [P in keyof xarrowPropsType]: xarrowPropsType[P] };
  props: modXarrowPropsType;
};

const SwitchView = (props: { switches: switchesType }) => {
  // console.log(props.switches);
  const { dpid } = useParams<{ dpid: string }>();
  const [switchSelf, setSwitchSelf] = useState<switchSelfType>({ ...props.switches[dpid], flowEntries: [], dpid });
  const [ports, setPorts] = useState(
    switchSelf.ports.map((p) => ({
      shape: "portBox" as const,
      id: p.port_no,
      name: p.name,
      port: p,
      ref: null,
    }))
  );
  // console.log("switchSelf", switchSelf);
  const [dataFetched, setDataFetched] = useState(false);

  const [switchDetailsWindow, setSwitchDetailsWindow] = useState(false);
  useEffect(() => {
    fetch(proxyAddress + "http://localhost:8080/stats/flow/" + dpid)
      .then((res) => {
        // console.log(res);
        if (res.status !== 200) alert(res.status);
        return res.json();
      })
      .then((result: { [dpid: string]: flowEntryDetailsGetType[] }) => {
        console.log(result);
        const parsedActions = setDataFetched(true);
        setSwitchSelf({
          ...switchSelf,
          flowEntries: result[dpid].map((f, i) => ({
            details: {
              ...f,
              actions: convertActionsFromServerGet2UI(f.actions), // parse actions because server return different format then state in UI
            },
            visible: false,
            isSynced: true,
            box: {
              x: 50,
              y: 100,
              visible: false,
              id: JSON.stringify(f.match),
              name: "flow" + i,
            },
          })),
        });
      });
  }, []);

  const toggleFlowVisibility = useCallback(
    (flow: flowEntryType) => {
      setSwitchSelf((switchSelf) => {
        let newFlow = switchSelf.flowEntries.find((f) => {
          return JSON.stringify(f.details.match) === JSON.stringify(flow.details.match);
        });
        newFlow.box.visible = !newFlow.box.visible;
        return { ...switchSelf };
      });
    },
    [switchSelf]
  );

  const toggleFlowVisibilityOfSelected = () => {
    setSwitchSelf((switchSelf) => {
      const newSwitchSelf = { ...switchSelf };
      let newFlow = newSwitchSelf.flowEntries.find((f) => f.box.id === selected.id);
      newFlow.box.visible = !newFlow.box.visible;
      return newSwitchSelf;
    });
  };

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

  // const getBoxes = () => Object.values(switchSelf.flowEntries).map((f) => f.box);
  const getBoxes = (mySwitchSelf: switchSelfType = null) => {
    if (mySwitchSelf) return Object.values(mySwitchSelf.flowEntries).map((f) => f.box);
    else return Object.values(switchSelf.flowEntries).map((f) => f.box);
  };

  // const setBoxes = () => {
  //   return Object.keys(switchSelf.flowEntries).map(flow=>)
  // }

  const updateBox = (updatedBox: BoxType) => {
    setSwitchSelf((switchSelf) => {
      const newSwitchSelf = { ...switchSelf };
      let newFlow = newSwitchSelf.flowEntries.find((f) => f.box.id === updatedBox.id);
      newFlow.box = updatedBox;
      return newSwitchSelf;
    });
  };

  const updateFlow = (updatedFlow: flowEntryType) => {
    setSwitchSelf((switchSelf) => {
      const newSwitchSelf = { ...switchSelf };
      let i = newSwitchSelf.flowEntries.findIndex((f) => f.box.id === updatedFlow.box.id);
      newSwitchSelf.flowEntries[i] = { ...updatedFlow };
      return newSwitchSelf;
    });
  };

  const updateFlowName = (id: string, newName: string) => {
    setSwitchSelf((switchSelf) => {
      const newSwitchSelf = { ...switchSelf };
      let i = newSwitchSelf.flowEntries.findIndex((f) => f.box.id === id);
      newSwitchSelf.flowEntries[i].box.name = newName;
      return newSwitchSelf;
    });
  };

  const checkExistence = useCallback(
    (id) => {
      return [...getBoxes(), ...ports].map((b) => b.id).includes(id);
    },
    [switchSelf, ports]
  );

  const addBox = useCallback(
    (x, y, shape) => {
      x -= x % constants.draggingGrid[0];
      y -= y % constants.draggingGrid[1];
      let l = getBoxes().length;
      while (checkExistence("box" + l)) l++;
      var newName = prompt("Enter box name: ", "box" + l);
      while (checkExistence(newName)) newName = prompt("name taken,choose other: ");
      if (newName) {
        let newFlow: flowEntryType = {
          isSynced: false,
          details: {},
          // visible: true,
          box: { id: newName, x, y, shape, menuWindowOpened: true, visible: true },
        };
        // setBoxes([...boxes, newBox]);
        setSwitchSelf((switchSelf) => {
          const newSwitchSelf = { ...switchSelf };
          newSwitchSelf.flowEntries = newSwitchSelf.flowEntries.concat(newFlow);
          return newSwitchSelf;
        });
      }
    },
    [switchSelf.flowEntries.length, JSON.stringify(getBoxes().map((b) => b.menuWindowOpened))]
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
    [getBoxes().length, JSON.stringify(getBoxes().map((b) => b.menuWindowOpened)), selected, addBox]
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

  const removeConnectedLines = (boxId: string) => {
    setLines((lines) => {
      return lines.filter((line) => !(line.props.start === boxId || line.props.end === boxId));
    });
  };

  const removeSelectedBox = useCallback(() => {
    delFlowFromServer(switchSelf.flowEntries.find((f) => f.box.id === selected.id));
  }, [getBoxes().length, selected]);

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
    setSwitchSelf((switchSelf) => {
      const newSwitchSelf = { ...switchSelf };
      const newBox = getBoxes().find((box) => box.id === selected.id);
      newBox.menuWindowOpened = true;
      return newSwitchSelf;
    });
  }, [selected]);

  // const convertActionsFromUI2ServerSet = (actions: flowEntryDetailsType["actions"][]): serverSetFlowType["actions"][] =>
  //   actions.map((ac) =>
  //     (Object.keys(ac) as Array<keyof typeof ac>).map((acKey) => ({
  //       type: acKey,
  //       port: Number(ac[acKey]),
  //     }))
  //   );
  const convertActionsFromUI2ServerSet = (actions: flowEntryDetailsType["actions"]): serverSetFlowType["actions"] =>
    (Object.keys(actions) as Array<keyof typeof actions>).map((ac) => ({
      type: ac,
      port: Number(actions[ac]),
    }));

  const convertActionsFromServerGet2UI = (actions: serverGetFlowType["actions"]): flowEntryDetailsType["actions"] =>
    actions.map((ac) => ac.split(":")).reduce((acu, cu) => Object.assign(acu, { [cu[0]]: cu[1] }), {});

  // (Object.keys(actions) as Array<keyof typeof actions>).map((ac) => ({
  //   type: ac,
  //   port: Number(actions[ac]),
  // }));

  const delFlowFromServer = useCallback(
    (flow: flowEntryType, callback?: () => void) => {
      const confirm = window.confirm(`are you sure you want to delete ${flow.box.id}?`);
      if (confirm === false) return;
      const parsedActions = convertActionsFromUI2ServerSet(flow.details.actions);
      const reqBody = { ...flow.details, dpid: Number(switchSelf.dpid), actions: parsedActions };
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      };
      fetch(proxyAddress + "http://localhost:8080/stats/flowentry/delete_strict", requestOptions).then((response) => {
        if (response.status !== 200) alert(response.status);
        else {
          removeConnectedLines(flow.box.id);
          setSwitchSelf((switchSelf) => {
            const newSw = { ...switchSelf };
            const i = newSw.flowEntries.findIndex((f) => _.isEqual(f, flow));
            newSw.flowEntries = newSw.flowEntries.filter((f) => !_.isEqual(f, flow));
            return newSw;
          });
          if (callback) callback();
        }
      });
    },
    [switchSelf]
  );

  const convertNumericStringsInObj2numbers = (obj: { [key: string]: any }): { [key: string]: any } => {
    const newObj = { ...obj };
    for (let key in obj) {
      if (typeof obj[key] === "string") newObj[key] = isNaN(obj[key]) === false ? Number(obj[key]) : obj[key];
    }
    return newObj;
  };

  const checkFlowExistence = (flowMatch: flowEntryType["details"]["match"]) =>
    switchSelf.flowEntries.find(
      (f) => JSON.stringify(f.details.match) === JSON.stringify(convertNumericStringsInObj2numbers(flowMatch))
    );

  const getFlowDetailsFromServer = (
    flowMatch: flowEntryDetailsType["match"],
    callback?: (flowsDetails: flowEntryDetailsType) => void
  ) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ match: flowMatch }),
    };
    fetch(proxyAddress + "http://localhost:8080/stats/flow/" + dpid, requestOptions)
      .then((response) => {
        if (response.status !== 200) alert(response.status);
        else return response.json();
      })
      .then((flowDetails: { [dpid: number]: serverGetFlowType[] }) => {
        const serverFlowDetails = flowDetails[Number(dpid)][0];
        callback({ ...serverFlowDetails, actions: convertActionsFromServerGet2UI(serverFlowDetails.actions) });
      });
  };

  const addFlowToServer = useCallback(
    (flow: flowEntryType, callback?: (updatedFlowDetails: flowEntryDetailsType) => void) => {
      const { match = {}, actions = {}, priority = 1 } = flow.details;
      const flowExist = checkFlowExistence(match);
      if (flowExist) {
        alert(
          "the flow " +
            flowExist.box.name +
            " with the same match rule already exist.\nFlows with same match rules are not allowed."
        );
        return;
      }
      const parsedActions = convertActionsFromUI2ServerSet(actions);
      const reqBody: serverSetFlowType = {
        ...flow.details,
        match,
        actions: parsedActions,
        priority,
        dpid: Number(switchSelf.dpid),
      };
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      };
      fetch(proxyAddress + "http://localhost:8080/stats/flowentry/add", requestOptions).then((response) => {
        if (response.status !== 200) alert(response.status);
        else {
          //retrieve all details of flow from server because some of the details may be set by the server
          getFlowDetailsFromServer(match, (flowDetails) => {
            const updatedFlow = {
              ...flow,
              details: {
                ...flowDetails, //server respond with list of matching flows but we know there is a single flow matching to single match rule
              },
              isSynced: true,
            };
            updateFlow(updatedFlow);
            if (callback) callback(updatedFlow.details);
          });
        }
      });
    },
    [switchSelf]
  );

  const updateFlowOnServer = (updatedFlowDetails: flowEntryDetailsType, callback?: () => void) => {
    // update flow details based on box name of flow
    // update means delete the previous flow
    const parsedActions = convertActionsFromUI2ServerSet(updatedFlowDetails.actions);
    const reqBody: Partial<serverSetFlowType> = {
      ...updatedFlowDetails,
      actions: parsedActions,
      dpid: Number(switchSelf.dpid),
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    };
    fetch(proxyAddress + "http://localhost:8080/stats/flowentry/modify_strict", requestOptions).then((response) => {
      if (response.status !== 200) alert(response.status);
      else {
        if (callback) callback();
      }
    });
  };

  const canvasProps = useMemo(
    () => ({
      setPorts,
      // setBoxes,
      updateBox,
      updateFlow,
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
      toggleFlowVisibilityOfSelected,
      delFlowFromServer,
      addFlowToServer,
      updateFlowOnServer,
      updateFlowName,
    }),
    [
      setPorts,
      // setBoxes,
      updateBox,
      updateFlow,
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
      toggleFlowVisibilityOfSelected,
      delFlowFromServer,
      addFlowToServer,
      updateFlowOnServer,
      updateFlowName,
    ]
  );

  // console.log("SwitchView rendered", switchSelf.flowEntries);

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
                onClick={() => setSwitchDetailsWindow(!switchDetailsWindow)}
              />
            </div>
            <div className="innerCanvas">
              <ToolboxMenu />
              <PortsBar {...{ ports, portPolarity: "input", lines }} />
              <BoxesContainer {...{ boxes: getBoxes(), handleDropBox, lines }} />
              <PortsBar {...{ ports, portPolarity: "output" }} />
              {/* xarrow connections*/}

              {lines.map((line, i) => (
                <XarrowWrapper key={line.props.start + "-" + line.props.end + i} {...{ line, selected }} />
              ))}
              {/* boxes menu that may be opened */}
              {switchSelf.flowEntries.map((f) => {
                return f.box.menuWindowOpened ? <BoxDetailsModal key={f.box.id} {...{ flow: f }} /> : null;
              })}
            </div>
            {switchDetailsWindow ? (
              <SwitchDetailsModal {...{ setSwitchDetailsWindow, flowEntries: switchSelf.flowEntries }} />
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
