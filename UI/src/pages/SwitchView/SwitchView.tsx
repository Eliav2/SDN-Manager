import React, { useState, createContext, useEffect, useCallback, useMemo } from "react";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import "./SwitchView.css";
import { BoxType } from "./components/Box";
import { actionsTypes } from "./components/TopBar";
import XarrowWrapper, { XarrowWrapperType } from "./components/XarrowWrapper";
import FlowDetailsModal from "./modals/FlowDetailsModal";
import { useParams } from "react-router";
import PortsBar from "./components/PortsBar";
import TestComponent from "./components/TestComponent";
import BounceLoader from "react-spinners/BounceLoader";
import SwitchDetailsModal from "./modals/SwitchDetailsModal";
import _, { isEqual, flow } from "lodash";
import { PortType } from "./components/Port";
import { xarrowPropsType } from "react-xarrows";
import ToolboxMenu from "./components/ToolboxMenu";
import BoxesContainer from "./components/BoxesContainer";
import {
  portDetailsType,
  flowType,
  serverSwitchesType,
  getFlowsOfSwitch,
  removeFlowFromSwitch,
  addFlowToSwitch,
  modifyFlowOnSwitch,
  convertActionsFromUI2ServerPost,
} from "../../utils/serverRequests";
import { proxyAddress } from "../../App";

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
  updateFlowOnUi: (updatedFlow: flowUIType) => void;
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
  delFlow: (flow: flowUIType, callback?: () => void) => void;
  addFlowToServer: ({
    flow,
    callback,
    checkExistence,
  }: {
    flow: flowUIType;
    callback?: (updatedFlowDetails: flowType) => void;
    checkExistence?: boolean;
  }) => void;
  updateFlowOnServer: (prevID: string, updatedFlow: flowUIType, callback?: () => void) => void;
  updateFlowName: (flowId: string, newName: string) => void;
};

export const CanvasContext = createContext<CanvasContextType>(null);
export const constants = { draggingGrid: [1, 1] };

export const boxShapes = ["modBox"] as const;

export type boxShapesType = typeof boxShapes[number];
export type selectedType<t extends "box" | "arrow" = "box" | "arrow"> = t extends "box"
  ? BoxType | PortType
  : XarrowWrapperType;

export type flowUIType = {
  details: Partial<flowType<"UI">>;
  // visible: boolean;
  box: BoxType;
  isSynced: boolean;
};

export type switchSelfType = serverSwitchesType[number] & {
  flowEntries: flowUIType[];
};

export type modXarrowPropsType = Omit<xarrowPropsType, "start" | "end"> & { start: string; end: string };

export type lineType = modXarrowPropsType;

const SwitchView = (props: { switches: serverSwitchesType }) => {
  const { dpid: sDpid } = useParams<{ dpid: string }>();
  const dpid = Number(sDpid);
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
    fetchFlowsFromServer();
  }, []);

  const fetchFlowsFromServer = () => {
    getFlowsOfSwitch({
      dpid,
      onSuccess: (flows) => {
        setDataFetched(true);
        const boxesConSize = document.getElementById("boxesContainer").getBoundingClientRect();
        setSwitchSelf((switchSelf) => {
          const newSwitchSelf = { ...switchSelf };
          newSwitchSelf.flowEntries = flows.map((f, i) => {
            let x = boxesConSize.width * (0.2 + 0.8 * Math.random());
            let y = boxesConSize.height * (0.2 + 0.8 * Math.random());
            return {
              details: f,
              visible: false,
              isSynced: true,
              box: {
                x,
                y,
                visible: false,
                id: JSON.stringify(f.match),
                name: "flow" + i,
              },
            };
          });
          return newSwitchSelf;
        });
      },
    });
  };

  const toggleFlowVisibility = useCallback(
    (flow: flowUIType) => {
      flow.box.visible = !flow.box.visible;
      updateFlowOnUi(flow);
    },
    [switchSelf]
  );

  const toggleFlowVisibilityOfSelected = () => {
    toggleFlowVisibility(switchSelf.flowEntries.find((f) => f.box.id === selected.id));
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

  const updateFlowOnUi = (updatedFlow: flowUIType) => {
    setSwitchSelf((switchSelf) => {
      const newSwitchSelf = { ...switchSelf };
      let i = newSwitchSelf.flowEntries.findIndex((f) => f.box.id === updatedFlow.box.id);
      newSwitchSelf.flowEntries[i] = { ...updatedFlow };
      return newSwitchSelf;
    });
  };

  const updateFlowName = (id: string, newName: string) => {
    const newFlow = switchSelf.flowEntries.find((f) => f.box.id === id);
    newFlow.box.name = newName;
    updateFlowOnUi(newFlow);
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
        let newFlow: flowUIType = {
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
      if (inputFlow) {
        inputFlow.details.actions["OUTPUT"] = endBoxId.replace(":<output>", "");
        updateFlow(inputFlow.box.id, inputFlow);
        // inputFlow.details.actions.filter(ac=>ac==="OUTPUT").forEach
        // inputFlow.isSynced ? updateFlow(inputFlow) : updateFlowOnUi(inputFlow);
      }
      if (outputFlow) {
        outputFlow.details.match["in_port"] = startBoxId.replace(":<input>", "");
        updateFlow(outputFlow.box.id, outputFlow);
        // outputFlow.isSynced ? updateFlow(outputFlow) : updateFlowOnUi(outputFlow);
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
  }, [switchSelf, selected]);

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
      updateFlow(inputFlow.box.id, { ...inputFlow });
    }
    if (outputFlow) {
      delete outputFlow.details.match["in_port"];
      updateFlow(outputFlow.box.id, { ...outputFlow });
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

  const delFlowFromUI = (flow: flowUIType) => {
    removeConnectedLines(flow.box.id);
    setSwitchSelf((switchSelf) => {
      const newSw = { ...switchSelf };
      newSw.flowEntries = newSw.flowEntries.filter((f) => !_.isEqual(f, flow));
      return newSw;
    });
    handleSelect(null);
  };

  const delFlowFromServer = (flow: flowUIType, callback?: () => void) => {
    removeFlowFromSwitch({ flow: flow.details, dpid, onSuccess: () => callback() });
  };

  const delFlow = useCallback(
    (flow: flowUIType) => {
      const confirm = window.confirm(`are you sure you want to delete ${flow.box.name}?`);
      if (confirm === false) return;
      if (flow.isSynced === false) return delFlowFromUI(flow);
      delFlowFromServer(flow, () => delFlowFromUI(flow));
    },
    [switchSelf]
  );

  const checkFlowExistence = (flowMatch: flowType["match"]) =>
    switchSelf.flowEntries.find((f) => JSON.stringify(f.details.match) === JSON.stringify(flowMatch));

  // const getFlowDetailsFromServer = (
  //   matchRule: Partial<flowType["match"]>,
  //   callback?: (flowsDetails: flowType) => void
  // ) => {
  //   getFlowBasedOnMatchRuleFromSwitch({
  //     dpid,
  //     matchRule,
  //     onSuccess: (flow) => {
  //       callback(flow);
  //     },
  //   });
  // };

  const addFlowToServer = useCallback(
    ({
      flow,
      callback,
      checkExistence = true,
    }: {
      flow: flowUIType;
      callback?: (updatedFlowDetails: flowType) => void;
      checkExistence?: boolean;
    }) => {
      const { match = {} } = flow.details;
      if (checkExistence) {
        const flowExist = checkFlowExistence(match);
        if (flowExist) {
          alert(
            "the flow " +
              flowExist.box.name +
              " with the same match rule already exist.\nFlows with same match rules are not allowed."
          );
          return;
        }
      }
      addFlowToSwitch({
        dpid,
        flow: flow.details,
        onSuccess: (flowDetails) => {
          const updatedFlow = {
            ...flow,
            details: flowDetails,
            isSynced: true,
          };
          updateFlowOnUi(updatedFlow);
          if (callback) callback(updatedFlow.details);
        },
        onError: (error) => alert(error),
      });
    },
    [switchSelf]
  );

  // const updateFlow = (updatedFlow: flowUIType) => {
  //   updateFlowOnServer(updatedFlow, () => updateFlowOnUi(updatedFlow));
  // };

  /**
   * will update a flow entry on vSwitch based on matching wildcards.
   * if successful response will update the UI as well.
   * @param boxID - id of current flow(means previous match rule)
   * @param updatedFlow - the updated flow
   * @param callback    - callback function that will be called after receive success code(200) from server
   *
   * @see https://ryu.readthedocs.io/en/latest/app/ofctl_rest.html#modify-flow-entry-strictly
   */
  const updateFlow = (boxID: string, updatedFlow: flowUIType, callback?: () => void) => {
    const flowToDelete = switchSelf.flowEntries.find((f) => f.box.id === boxID);
    if (isEqual(flowToDelete.details, updatedFlow.details)) return;
    delFlowFromServer(flowToDelete, () => addFlowToServer({ flow: updatedFlow, callback, checkExistence: false }));

    // const relevantFlow = switchSelf.flowEntries.find((f) => f.box.id === updatedFlow.box.id);
    // console.log(relevantFlow.details);
    // modifyFlowOnSwitch({
    //   dpid,
    //   updatedFlow: relevantFlow.details,
    //   onSuccess: () => callback(),
    //   onError: (error) => alert(error),
    // });

    // const parsedActions = convertActionsFromUI2ServerPost(updatedFlow.details.actions);
    // const reqBody = {
    //   ...updatedFlow.details,
    //   actions: parsedActions,
    //   dpid: Number(switchSelf.dpid),
    // };
    // const requestOptions = {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(reqBody),
    // };
    // fetch(proxyAddress + "http://localhost:8080/stats/flowentry/modify_strict", requestOptions).then((response) => {
    //   if (response.status !== 200) alert(response.status);
    //   else {
    //     if (callback) callback();
    //   }
    // });
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
      updateFlowOnServer: updateFlow,
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
      updateFlow,
      updateFlowName,
    ]
  );

  // console.log("SwitchView rendered", switchSelf.flowEntries);

  // const drawFlowLines = (f) =>{

  // }

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
              {/* draw connections */}
              {switchSelf.flowEntries.map((f) =>
                f.box.visible ? (
                  <React.Fragment key={f.box.id}>
                    {f.details.match && f.details.match.in_port ? (
                      <XarrowWrapper line={{ start: f.details.match.in_port + ":<input>", end: f.box.id }} />
                    ) : null}
                    {f.details.actions &&
                    (isNaN(f.details.actions.OUTPUT as any) === false || f.details.actions.OUTPUT === "LOCAL") ? (
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
