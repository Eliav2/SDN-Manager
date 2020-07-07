import React, { useState, createContext, useEffect, useCallback, useMemo, useRef } from "react";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import "./SwitchView.css";
import Box, { BoxType } from "./components/Box";
import TopBar, { actionsTypes } from "./components/TopBar";
import XarrowWrapper, { XarrowWrapperType } from "./components/XarrowWrapper";
import FlowDetailsModal from "./modals/FlowDetailsModal";
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
import { isEqual } from "lodash";
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
  updateBoxOnUi: (updatedBox: BoxType) => void;
  updateFlowOnUi: (updatedFlow: flowEntryType) => void;
  setLines: React.Dispatch<React.SetStateAction<any[]>>;
  selected: selectedType<"box" | "arrow">;
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
  delFlow: (flow: flowEntryType, callback?: () => void) => void;
  addFlowToServer: (flow: flowEntryType, callback?: (updatedFlowDetails: flowEntryDetailsType) => void) => void;
  updateFlowOnServer: (updatedFlow: flowEntryType, callback?: () => void) => void;
  updateFlowName: (flowId: string, newName: string) => void;
};

export const CanvasContext = createContext<CanvasContextType>(null);
export const constants = { draggingGrid: [1, 1] };

export const boxShapes = ["modBox"] as const;

export type boxShapesType = typeof boxShapes[number];
export type selectedType<t extends "box" | "arrow" = "box" | "arrow"> = t extends "box"
  ? BoxType | PortType
  : XarrowWrapperType;

export type serverSetFlowType = {
  dpid?: number;
  actions: { type: fieldsNameType<"actions">; port: number | string }[];
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
};

export type switchSelfType = switchesType[string] & {
  flowEntries: flowEntryType[];
};

export type modXarrowPropsType = Omit<xarrowPropsType, "start" | "end"> & { start: string; end: string };

// export type lineType = {
//   // props: { [P in keyof xarrowPropsType]: xarrowPropsType[P] };
//   props: modXarrowPropsType;
// };
export type lineType = modXarrowPropsType;

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
      .then((result: { [dpid: string]: serverGetFlowType[] }) => {
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

  const updateBoxOnUi = (updatedBox: BoxType) => {
    setSwitchSelf((switchSelf) => {
      const newSwitchSelf = { ...switchSelf };
      let newFlow = newSwitchSelf.flowEntries.find((f) => f.box.id === updatedBox.id);
      newFlow.box = updatedBox;
      return newSwitchSelf;
    });
  };

  const updateFlowOnUi = (updatedFlow: flowEntryType) => {
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
          box: { id: newName, x, y, shape, flowDetailsModalOpen: true, visible: true },
        };
        // setBoxes([...boxes, newBox]);
        setSwitchSelf((switchSelf) => {
          const newSwitchSelf = { ...switchSelf };
          newSwitchSelf.flowEntries = newSwitchSelf.flowEntries.concat(newFlow);
          return newSwitchSelf;
        });
      }
    },
    [switchSelf.flowEntries.length, JSON.stringify(getBoxes().map((b) => b.flowDetailsModalOpen))]
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
    [getBoxes().length, JSON.stringify(getBoxes().map((b) => b.flowDetailsModalOpen)), selected, addBox]
  );

  const handleBoxClick = useCallback(
    (e, box) => {
      e.stopPropagation(); //so only the click event on the box will fire on not on the container itself
      if (actionState === "Normal") {
        handleSelect(e, box);
      } else if (actionState === "Add Connections" && selected.id !== box.id && !box.id.includes(":<input>")) {
        addLineToSelectedBox(box);
      } else if (actionState === "Remove Connections") {
        setLines((lines) => lines.filter((line) => !(line.start === selected.id && line.end === box.id)));
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
          lines.filter((line) => line.start === selected.id && line.end === box.id).length === 0 &&
          !box.id.includes(":<input>")) ||
        (actionState === "Remove Connections" &&
          lines.filter((line) => line.start === selected.id && line.end === box.id).length > 0)
      ) {
        background = "LemonChiffon";
      }
      return background;
    },
    [actionState, selected]
  );

  const addLine = useCallback(
    ({ startBoxId, endBoxId }: { startBoxId: string; endBoxId: string }) => {
      // const flowToUpdate = switchSelf.flowEntries.find((f) => f.box.id === startBoxId);
      // updateFlowOnServer();

      const inputFlow = switchSelf.flowEntries.find((f) => f.box.id === startBoxId);
      const outputFlow = switchSelf.flowEntries.find((f) => f.box.id === endBoxId);
      // console.log(startBoxId, endBoxId);
      // console.log(inputFlow, outputFlow);
      if (inputFlow) {
        inputFlow.details.actions["OUTPUT"] = endBoxId.replace(":<output>", "");
        updateFlowOnServer({ ...inputFlow });
      }
      if (outputFlow) {
        outputFlow.details.match["in_port"] = startBoxId.replace(":<input>", "");
        updateFlowOnServer({ ...outputFlow });
      }
      // }
      // add line from selected box to passed 'box'
      //   setLines((lines) => [
      //     ...lines,
      //     {
      //       start: startBoxId,
      //       end: endBoxId,
      //     },
      //   ]);
    },
    [switchSelf, selected]
  );

  const removeSelectedBox = useCallback(() => {
    delFlow(switchSelf.flowEntries.find((f) => f.box.id === selected.id));
  }, [getBoxes().length, selected]);

  const addLineToSelectedBox = useCallback(
    (box: BoxType) => {
      addLine({ startBoxId: (selected as BoxType).id, endBoxId: box.id });
      // setLines((lines) => [
      //   ...lines,
      //   {
      //     start: selected.id as string,
      //     end: box.id,
      //   },
      // ]);
    },
    [lines.length, selected]
  );

  const removeLine = (lineId: XarrowWrapperType["id"]) => {
    const inputFlow = switchSelf.flowEntries.find((f) => f.box.id === lineId.start);
    const outputFlow = switchSelf.flowEntries.find((f) => f.box.id === lineId.end);
    if (inputFlow) {
      delete inputFlow.details.actions["OUTPUT"];
      updateFlowOnServer({ ...inputFlow });
    }
    if (outputFlow) {
      delete outputFlow.details.match["in_port"];
      updateFlowOnServer({ ...outputFlow });
    }
  };

  const removeSelectedLine = useCallback(() => {
    removeLine((selected as selectedType<"arrow">).id);
  }, [switchSelf, selected]);

  const removeConnectedLines = (boxId: string) => {
    lines
      .filter((line) => !(line.start === boxId || line.end === boxId))
      .forEach((line) => removeLine({ start: line.start, end: line.end }));
  };

  const openModsWindowOfSelected = useCallback(() => {
    setSwitchSelf((switchSelf) => {
      const newSwitchSelf = { ...switchSelf };
      const newBox = getBoxes().find((box) => box.id === selected.id);
      newBox.flowDetailsModalOpen = true;
      return newSwitchSelf;
    });
  }, [selected]);

  const convertActionsFromUI2ServerSet = (actions: flowEntryDetailsType["actions"]): serverSetFlowType["actions"] =>
    (Object.keys(actions) as Array<keyof typeof actions>).map((ac) => ({
      type: ac,
      port: Number(actions[ac]) ? Number(actions[ac]) : actions[ac],
    }));

  const convertActionsFromServerGet2UI = (actions: serverGetFlowType["actions"]): flowEntryDetailsType["actions"] =>
    actions.map((ac) => ac.split(":")).reduce((acu, cu) => Object.assign(acu, { [cu[0]]: cu[1] }), {});

  // (Object.keys(actions) as Array<keyof typeof actions>).map((ac) => ({
  //   type: ac,
  //   port: Number(actions[ac]),
  // }));

  const delFlowFromUI = (flow: flowEntryType) => {
    removeConnectedLines(flow.box.id);
    setSwitchSelf((switchSelf) => {
      const newSw = { ...switchSelf };
      const i = newSw.flowEntries.findIndex((f) => _.isEqual(f, flow));
      newSw.flowEntries = newSw.flowEntries.filter((f) => !_.isEqual(f, flow));
      return newSw;
    });
    handleSelect(null);
  };

  const delFlowFromServer = (flow: flowEntryType, callback?: () => void) => {
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
        if (callback) callback();
      }
    });
  };

  const delFlow = useCallback(
    (flow: flowEntryType) => {
      const confirm = window.confirm(`are you sure you want to delete ${flow.box.name}?`);
      if (confirm === false) return;
      if (flow.isSynced === false) return delFlowFromUI(flow);
      delFlowFromServer(flow, () => delFlowFromUI(flow));
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
  const convertNumbersInObj2strings = (obj: { [key: string]: any }): { [key: string]: any } => {
    const newObj = { ...obj };
    for (let key in obj) {
      if (typeof obj[key] === "number") newObj[key] = String(obj[key]);
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
        callback({
          ...serverFlowDetails,
          match: convertNumbersInObj2strings(serverFlowDetails.match),
          actions: convertActionsFromServerGet2UI(serverFlowDetails.actions),
        });
      });
  };

  const addFlowToServer = useCallback(
    (flow: flowEntryType, callback?: (updatedFlowDetails: flowEntryDetailsType) => void) => {
      const { match = {}, actions = {}, priority = 1 } = flow.details;
      const flowExist = checkFlowExistence(match);
      console.log(match);
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
            if (isEqual(flowDetails.match, flow.details.match) === false) {
              delFlowFromServer(flow);
              const conflictedFlow = switchSelf.flowEntries.find((f) => isEqual(f.details.match, flowDetails.match));
              const name = conflictedFlow.box.name;
              alert(
                "match rule conflicts with flow " +
                  name +
                  ".(means that the " +
                  JSON.stringify(flow.details.match) +
                  " rule also match the match rule of " +
                  name +
                  ")\nPlease provide more detailed match rule."
              );
              return;
            }
            const updatedFlow = {
              ...flow,
              details: {
                ...flowDetails, //server respond with list of matching flows but we know there is a single flow matching to single match rule
              },
              isSynced: true,
            };
            updateFlowOnUi(updatedFlow);
            if (callback) callback(updatedFlow.details);
          });
        }
      });
    },
    [switchSelf]
  );

  /**
   * will update a flow entry on vSwitch based on matching wildcards.
   * after successful response will update the UI as well.
   * @param updatedFlow - the flow to update details on server
   * @param callback    - callback function that will be called after receive success code(200) from server
   *
   * @see https://ryu.readthedocs.io/en/latest/app/ofctl_rest.html#modify-flow-entry-strictly
   */
  const updateFlowOnServer = (updatedFlow: flowEntryType, callback?: () => void) => {
    const parsedActions = convertActionsFromUI2ServerSet(updatedFlow.details.actions);
    const reqBody: Partial<serverSetFlowType> = {
      ...updatedFlow.details,
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
        updateFlowOnUi(updatedFlow);
        if (callback) callback();
      }
    });
  };

  const canvasProps = useMemo(
    () => ({
      setPorts,
      // setBoxes,
      updateBoxOnUi,
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
      delFlow,
      addFlowToServer,
      updateFlowOnUi,
      updateFlowOnServer,
      updateFlowName,
    }),
    [
      setPorts,
      // setBoxes,
      updateBoxOnUi,
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
      delFlow,
      updateFlowOnUi,
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

              {/* {lines.map((line, i) => (
                <XarrowWrapper key={line.start + "-" + line.end + i} {...{ line, selected }} />
              ))} */}
              {switchSelf.flowEntries.map((f) =>
                f.box.visible ? (
                  <React.Fragment key={f.box.id}>
                    {f.details.match && f.details.match.in_port ? (
                      <XarrowWrapper line={{ start: f.details.match.in_port + ":<input>", end: f.box.id }} />
                    ) : null}
                    {f.details.actions && f.details.actions.OUTPUT ? (
                      <XarrowWrapper line={{ start: f.box.id, end: f.details.actions.OUTPUT + ":<output>" }} />
                    ) : null}
                  </React.Fragment>
                ) : null
              )}
              {/* boxes menu that may be opened */}
              {switchSelf.flowEntries.map((f) => {
                return f.box.flowDetailsModalOpen ? <FlowDetailsModal key={f.box.id} {...{ flow: f }} /> : null;
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
