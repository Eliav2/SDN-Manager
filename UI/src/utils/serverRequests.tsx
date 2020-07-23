////@ts-nocheck

/**
 * The propose of all these requests is to serve the UI and return parsed data as the UI expect.
 */

// import { ofctlRestUrl } from "./../App";
import { fieldsNameType, actionsFields } from "../pages/SwitchView/components/aclsFields";
import { isEqual, isMatch } from "lodash";

export type portDetailsType = {
  advertised: number;
  config: number;
  curr: number;
  curr_speed: number;
  hw_addr: string;
  max_speed: number;
  name: string;
  peer: number;
  port_no: string;
  state: number;
  supported: number;
};

export type serverSwitchType = {
  ports: portDetailsType[];
  name: string;
  dpid: number;
};

export type serverSwitchesType = {
  [dpid: string]: serverSwitchType;
};

type flowActionsType<T extends "serverGet" | "serverPost" | "UI" = "UI"> = T extends "serverGet"
  ? string[]
  : T extends "serverPost"
  ? { type: fieldsNameType<"actions">; port: number }[] // : { [key in fieldsNameType<"actions">]: string };
  : { type: fieldsNameType<"actions">; port: string }[];

export type flowType<T extends "serverGet" | "serverPost" | "UI" = "UI"> = {
  match: { [key in fieldsNameType<"match">]?: string };
  actions: flowActionsType<T>;
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

const getListOfSwitchesDpids = ({
  url,
  onSuccess,
  onError,
}: {
  url: string;
  onSuccess: (switchesDpids: string[]) => any;
  onError?: (error: Error) => any;
}) => {
  return fetch(url + "/stats/switches")
    .then((res) => {
      if (res.ok === false) return onError({ message: res.statusText, name: "URIError" });
      return res.json();
    })
    .then(
      (switchesDpids: string[]) => {
        onSuccess(switchesDpids);
      },
      (error) => {
        if (onError) onError(error);
      }
    );
};

const getPortDescription = ({
  url,
  dpid,
  onSuccess,
  onError,
}: {
  url: string;
  dpid: number;
  onSuccess: (switchPorts: { [dpid: number]: portDetailsType[] }) => any;
  onError?: (error: Error) => any;
}) => {
  return fetch(url + "/stats/portdesc/" + dpid)
    .then((res) => res.json())
    .then(
      (switchPorts: { [dpid: number]: portDetailsType[] }) => {
        onSuccess(switchPorts);
      },
      (error) => {
        if (onError) onError(error);
      }
    );
};

export const getSwitchWithPortDescription = ({
  url,
  dpid,
  onSuccess,
  onError,
}: {
  url: string;
  dpid: number;
  onSuccess: (switche: serverSwitchType) => any;
  onError?: (error: Error) => any;
}) => {
  return getPortDescription({
    url,
    dpid: Number(dpid),
    onSuccess: (switchPorts) => {
      const ports = switchPorts[dpid];
      let parsed_switch = { ports, dpid };
      for (let i = 0; i < ports.length; i++) {
        if (ports[i].port_no === "LOCAL") {
          //set name of switch to name of local port
          parsed_switch = Object.assign(parsed_switch, { name: ports[i].name });
        }
      }
      onSuccess(parsed_switch as serverSwitchType);
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });
};

export const getAllSwitchesWithPortDescription = ({
  url,
  onSuccess,
  onError,
}: {
  url: string;
  onSuccess: (switches: serverSwitchesType) => any;
  onError?: (error: Error) => any;
}) => {
  let switches: { [dpid: string]: serverSwitchType } = {};
  return getListOfSwitchesDpids({
    url,
    onSuccess: (switchesDpids) => {
      const promises = switchesDpids.map((dpid) =>
        getSwitchWithPortDescription({
          url,
          dpid: Number(dpid),
          onSuccess: (switche) => {
            switches = Object.assign(switches, { [dpid]: switche });
          },
          onError: (error) => onError(error),
        })
      );
      Promise.all(promises).then(() => {
        // let parsed_switches: serverSwitchesType = {};
        // for (let dpid in switches) {
        //   // for each switch
        //   for (let i = 0; i < switches[dpid].length; i++) {
        //     if (switches[dpid][i].port_no === "LOCAL") {
        //       //set name of switch to name of local port
        //       parsed_switches[dpid] = Object.assign(
        //         { ports: switches[dpid] },
        //         { name: switches[dpid][i].name, dpid: Number(dpid) }
        //       );
        //     }
        //   }
        // }
        onSuccess(switches);
      });
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });
};

// // type tmp1 = typeof "number"
// const string2Type = (str: string): string | number | object => {
//   const tmp: any = null;
//   switch (str) {
//     case "number":
//       return tmp as number;
//     case "string":
//       return tmp as string;
//     case "object":
//       return tmp as object;
//   }
// };

// // { [key: string]: string }
// const objectTypes2Type = (obj: { [key: string]: any }, objTypes: { [key: string]: string }) => {
//   const objWithTypes = {} as { [key: string]: any };
//   for (let key in obj) {
//     const propWithType = string2Type(objTypes[key]);
//     objWithTypes[key] = obj[key] as typeof propWithType;
//   }
// };

// const obj = {
//   OUTPUT: ["port","number"],
//   SET_VLAN_VID: ["vlan_vid", "number"],
//   SET_VLAN_PCP: ["vlan_pcp"],
//   STRIP_VLAN: [],
//   SET_DL_SRC: ["dl_src"],
//   SET_DL_DST: ["dl_dst"],
//   SET_NW_SRC: ["nw_src"],
//   SET_NW_DST: ["nw_dst"],
//   SET_NW_TOS: ["nw_tos"],
//   SET_TP_SRC: ["tp_src"],
//   SET_TP_DST: ["tp_dst"],
//   ENQUEUE: ["queue_id", "pot"],
// };

// const OUTPUTtype =  string2Type(obj.OUTPUT[2])

// const OUTPUT = obj.OUTPUT[0] as typeof OUTPUTtype

const actionsServerPostExamples = actionsFields.map((ac) => ({ ...JSON.parse(ac[2]) }));

export const convertActionsFromServerGet2UI = (actions: flowType<"serverGet">["actions"]): flowType<"UI">["actions"] => {
  // const actionsUI = actions
  //   .map((ac) => ac.split(":"))
  //   .reduce((acu, cu) => Object.assign(acu, { [cu[0]]: cu[1] }), {} as flowType<"UI">["actions"]);
  // return actionsUI;

  // const actionType2actionName = {
  //   OUTPUT: ["port"],
  //   SET_VLAN_VID: ["vlan_vid"],
  //   SET_VLAN_PCP: ["vlan_pcp"],
  //   STRIP_VLAN: [] as any,
  //   SET_DL_SRC: ["dl_src"],
  //   SET_DL_DST: ["dl_dst"],
  //   SET_NW_SRC: ["nw_src"],
  //   SET_NW_DST: ["nw_dst"],
  //   SET_NW_TOS: ["nw_tos"],
  //   SET_TP_SRC: ["tp_src"],
  //   SET_TP_DST: ["tp_dst"],
  //   ENQUEUE: ["queue_id", "port"],
  // } as const;

  // const actionsUI = actions
  //   .map((ac) => ac.split(":"))
  //   .map(([type, actionName]) => {
  //     // (actionType2actionName[type] as any).map();
  //     let actionsFieldsDict = actionsFields.map((ac) => ({ [ac[0]]: JSON.parse(ac[2]) } as const));
  //     // for(let key in actionsFieldsDict){
  //     //   actionsFieldsDict[key] = JSON.parse(actionsFieldsDict[key])
  //     // }
  //     return { type, actionName };
  //   });
  // const [actionsTypes, actionsValues] = actions.map((ac) => ac.split(":"));
  const actionsList = actions.map((ac) => ac.split(":"));
  const actionsUI: any = [];
  for (let i = 0; i < actionsList.length; i++) {
    const actionObj = { ...actionsServerPostExamples.find((ac) => ac.type === actionsList[i][0]) };
    for (let key in actionObj) {
      if (key === "type") continue;
      actionObj[key] = actionsList[i][1];
    }
    actionsUI.push(actionObj);
  }
  return actionsUI;

  //   const actionsList = actions.map((ac) => ac.split(":")) as string[][];
  //   const actionsObjects = actionsList.map((ac) => ({ [ac[0]]: ac[1] })) as flowType<"UI">["actions"];
  //   console.log(actionsObjects);
  //   return actionsObjects;

  // return (Object.keys(actions) as Array<keyof typeof actions>).map((ac) => ({
  //   type: ac,
  //   port: Number(actions[ac]) ? Number(actions[ac]) : actions[ac],
  // }));

  // console.log(actions.map((ac) => ac.split(":")));
};

export const convertActionsFromUI2ServerPost = (
  actions: Partial<flowType["actions"]>
): Partial<flowType<"serverPost">["actions"]> => {
  // const result = actions.map(
  //   (action) =>
  //     (Object.keys(action) as Array<keyof typeof action>).reduce(
  //       (acu, cu) => Object.assign(acu, { [cu]: action[cu] }),
  //       {}
  //     ) as serverSetFlowType["actions"][number]
  // );
  // console.log(result);

  // const result = actions.map((action) =>
  //   (Object.keys(action) as Array<keyof typeof action>).map((acKey) => ({
  //     type: acKey,
  //     port: Number(action[acKey]) ? Number(action[acKey]) : action[acKey],
  //   }))
  // );

  const result = (Object.keys(actions) as Array<keyof typeof actions>).map((ac) => ({
    type: ac,
    port: Number(actions[ac]) ? Number(actions[ac]) : actions[ac],
  }));

  // (Object.keys(actions) as Array<keyof typeof actions>).map((ac)
  return result as any;
};

// export const convertActionsFromUI2ServerSet = (actions: flowType["actions"]): flowType<"serverPost">["actions"] =>{

// }

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

const convertFlowServerGet2UI = (flow: flowType<"serverGet">): flowType => ({
  ...flow,
  match: convertNumbersInObj2strings(flow.match),
  actions: convertActionsFromServerGet2UI(flow.actions),
});
// const convertFlowServerPost2UI = (flow: flowType<"serverPost">): flowType =>  ({
//     ...flow,
//     actions: conver(flow.actions),
//   });;

const convertFlowUI2serverPost = (flow: Partial<flowType>): Partial<flowType<"serverPost">> => ({
  ...flow,
  match: convertNumericStringsInObj2numbers(flow.match),
  actions: convertActionsFromUI2ServerPost(flow.actions),
});

export const getFlowsOfSwitch = ({
  dpid,
  url,
  onSuccess,
  onError,
}: {
  dpid: number;
  url: string;
  onSuccess: (flows: flowType<"UI">[]) => any;
  onError?: (error: Error) => any;
}) => {
  return fetch(url + "/stats/flow/" + dpid)
    .then((res) => {
      if (res.status !== 200) alert(res.status);
      return res.json();
    })
    .then(
      (result: { [dpid: string]: flowType<"serverGet">[] }) => {
        onSuccess(result[dpid].map((flow) => convertFlowServerGet2UI(flow)));
      },
      (error) => {
        if (onError) onError(error);
      }
    );
};

export const removeFlowFromSwitch = ({
  url,
  dpid,
  flow,
  onSuccess,
  onError,
}: {
  url: string;
  dpid: number;
  flow: Partial<flowType<"UI">>;
  onSuccess?: () => any;
  onError?: (error: string | Error) => any;
}) => {
  const parsedActions = convertActionsFromUI2ServerPost(flow.actions);
  const reqBody = { ...flow, dpid, actions: parsedActions };
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqBody),
  };
  fetch(url + "/stats/flowentry/delete_strict", requestOptions).then(
    (response) => {
      if (response.status !== 200) onError(response.statusText);
      if (onSuccess) onSuccess();
    },
    (error) => {
      if (onError) onError(error);
    }
  );
};

/**
 * filter flow matching based given details.
 * @param flowMatch all flows matching given fields of current flow will be returned.
 */
export const getFilteredFlowsFromSwitch = ({
  url,
  dpid,
  flowMatch,
  onSuccess,
  onError,
}: {
  url: string;
  dpid: number;
  flowMatch: Partial<flowType<"UI">>;
  onSuccess: (matchingFlows: flowType[]) => any;
  onError?: (error: Error) => any;
}) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ match: flowMatch }),
  };
  fetch(url + "/stats/flow/" + dpid, requestOptions)
    .then((response) => {
      if (response.status !== 200) alert(response.status);
      else return response.json();
    })
    .then(
      (flowDetails: { [dpid: number]: flowType<"serverGet">[] }) => {
        onSuccess(flowDetails[dpid].map((f) => convertFlowServerGet2UI(f)));
      },
      (error) => {
        if (onError) onError(error);
      }
    );
};

/**
 * will return the first flow matching the match rule `matchRule` given from vSwitch with dpid `dpid`
 */
// export const getFlowBasedOnMatchRuleFromSwitch = ({
//   dpid,
//   matchRule,
//   onSuccess,
//   onError,
// }: {
//   dpid: number;
//   matchRule: flowType["match"];
//   onSuccess: (flow: flowType<"UI">) => any;
//   onError?: (error: Error) => any;
// }) => {
//   getFilteredFlowsFromSwitch({
//     dpid,
//     flowMatch: { match: matchRule },
//     onSuccess: (flows) => onSuccess(flows[0]), // returns the first item because is supposed to be single flow matching the given match rule
//     onError: (error) => {
//       if (onError) onError(error);
//     },
//   });
// };

/**
 * filter flow matching based given details.
 * @param flowMatch all flows matching given fields of current flow will be returned.
 */
export const addFlowToSwitch = ({
  url,
  dpid,
  flow,
  onSuccess,
  onError,
}: {
  url: string;
  dpid: number;
  flow: Partial<flowType<"UI">>;
  onSuccess?: (flow: flowType<"UI">) => any;
  onError?: (error: Error) => any;
}) => {
  let serverPostFlow = convertFlowUI2serverPost(flow);
  const { match = {}, actions = [], priority = 1 } = serverPostFlow;
  serverPostFlow = {
    ...serverPostFlow,
    match,
    actions,
    priority,
  };
  const reqBody = { ...serverPostFlow, dpid: Number(dpid) };
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqBody),
  };
  fetch(url + "/stats/flowentry/add", requestOptions).then(
    (response) => {
      if (response.status !== 200) alert(response.status);
      else {
        //after flow successfully  added retrieve all details of flow from server because some of the details may be set by the server
        if (onSuccess) {
          getFilteredFlowsFromSwitch({
            url,
            dpid,
            flowMatch: { match },
            onSuccess: (flows) => {
              const updatedFlow = flows.find((f) => isMatch(f, flow) && isEqual(f.match, flow.match));
              //   console.log(flows, flow, updatedFlow);
              onSuccess(updatedFlow);
            },
            onError: (error) => onError(error),
          });
        }
        //     getFlowBasedOnMatchRuleFromSwitch({
        //       dpid,
        //       matchRule: match,
        //       onSuccess: (updatedFlow) => {
        //         console.log(updatedFlow, flow);
        //         // if (isEqual(updatedFlow.match, flow.match) === false) {
        //         if (false) {
        //           // #FIXME bugs of identifying right flow
        //           removeFlowFromSwitch({ dpid, flow: updatedFlow });
        //           onError(
        //             "match rule conflict.\n" +
        //               "The match rule: " +
        //               JSON.stringify(flow.match) +
        //               "\n\n also match the match rule:" +
        //               JSON.stringify(updatedFlow.match) +
        //               "\n\nPlease provide more detailed match rule."
        //           );
        //           return;
        //         } else {
        //           onSuccess(updatedFlow);
        //         }
        //       },
        //       onError: (error) => onError(error),
        //     });
      }
    },
    (error) => onError(error)
  );
};

export const modifyFlowOnSwitch = ({
  url,
  dpid,

  updatedFlow,
  onSuccess,
  onError,
}: {
  url: string;
  dpid: number;
  updatedFlow: Partial<flowType<"UI">>;
  onSuccess?: () => any;
  onError?: (error: Error) => any;
}) => {
  const serverFlow = convertFlowUI2serverPost(updatedFlow);
  console.log(serverFlow);
  const reqBody = {
    ...serverFlow,
    dpid: Number(dpid),
  };
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqBody),
  };
  fetch(url + "/stats/flowentry/modify_strict", requestOptions).then(
    (response) => {
      if (response.status !== 200) alert(response.status);
      else {
        console.log(response);
        if (onSuccess) onSuccess();
      }
    },
    (error) => onError(error)
  );
};
