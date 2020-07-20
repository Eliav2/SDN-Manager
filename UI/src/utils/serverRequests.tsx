////@ts-nocheck

/**
 * The propose of all these requests is to serve the UI and return parsed data as the UI expect.
 */

// import { ofctlRestUrl } from "./../App";
import { fieldsNameType } from "../pages/SwitchView/components/aclsFields";
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

type flowActionsType<
  T extends "serverGet" | "serverPost" | "UI" = "UI"
> = T extends "serverGet"
  ? string[]
  : T extends "serverPost"
  ? { type: fieldsNameType<"actions">; port: number }[]
  : { [key in fieldsNameType<"actions">]: string };

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
  onError?: (error: any) => any;
}) => {
  return fetch(url + "/stats/switches")
    .then((res) => res.json())
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
  onSuccess: (ports: portDetailsType) => any;
  onError?: (error: any) => any;
}) => {
  return fetch(url + "/stats/portdesc/" + dpid)
    .then((res) => res.json())
    .then(
      (ports: portDetailsType) => {
        onSuccess(ports);
      },
      (error) => {
        if (onError) onError(error);
      }
    );
};

export const getAllSwitchesWithPortDescription = ({
  url,
  onSuccess,
  onError,
}: {
  url: string;
  onSuccess: (switches: serverSwitchesType) => any;
  onError?: (error: any) => any;
}) => {
  console.log(url + "/stats/switches");
  let switches: { [dpid: string]: portDetailsType[] } = {};
  getListOfSwitchesDpids({
    url,
    onSuccess: (switchesDpids) => {
      const promises = switchesDpids.map((dpid) =>
        getPortDescription({
          url,
          dpid: Number(dpid),
          onSuccess: (ports) => {
            switches = Object.assign(switches, ports);
          },
          onError: (error) => onError(error),
        })
      );
      Promise.all(promises).then(() => {
        let parsed_switches: serverSwitchesType = {};
        for (let dpid in switches) {
          // for each switch
          for (let i = 0; i < switches[dpid].length; i++) {
            if (switches[dpid][i].port_no === "LOCAL") {
              //set name of switch to name of local port
              parsed_switches[dpid] = Object.assign(
                { ports: switches[dpid] },
                { name: switches[dpid][i].name, dpid: Number(dpid) }
              );
            }
          }
        }
        onSuccess(parsed_switches);
      });
    },
    onError: (error) => {
      if (onError) onError(error);
    },
  });
};

export const convertActionsFromServerGet2UI = (
  actions: flowType<"serverGet">["actions"]
): flowType<"UI">["actions"] => {
  //   const actionsList = actions.map((ac) => ac.split(":")) as string[][];
  //   const actionsObjects = actionsList.map((ac) => ({ [ac[0]]: ac[1] })) as flowType<"UI">["actions"];
  //   console.log(actionsObjects);
  //   return actionsObjects;

  const actionsUI = actions
    .map((ac) => ac.split(":"))
    .reduce(
      (acu, cu) => Object.assign(acu, { [cu[0]]: cu[1] }),
      {} as flowType<"UI">["actions"]
    );
  return actionsUI;

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

  const result = (Object.keys(actions) as Array<keyof typeof actions>).map(
    (ac) => ({
      type: ac,
      port: Number(actions[ac]) ? Number(actions[ac]) : actions[ac],
    })
  );

  // (Object.keys(actions) as Array<keyof typeof actions>).map((ac)
  return result as any;
};

// export const convertActionsFromUI2ServerSet = (actions: flowType["actions"]): flowType<"serverPost">["actions"] =>{

// }

const convertNumericStringsInObj2numbers = (obj: {
  [key: string]: any;
}): { [key: string]: any } => {
  const newObj = { ...obj };
  for (let key in obj) {
    if (typeof obj[key] === "string")
      newObj[key] = isNaN(obj[key]) === false ? Number(obj[key]) : obj[key];
  }
  return newObj;
};

const convertNumbersInObj2strings = (obj: {
  [key: string]: any;
}): { [key: string]: any } => {
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

const convertFlowUI2serverPost = (
  flow: Partial<flowType>
): Partial<flowType<"serverPost">> => ({
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
  onError?: (error: any) => any;
}) => {
  fetch(url + "/stats/flow/" + dpid)
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
  onError?: (error: any) => any;
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
      if (response.status !== 200) onError(response.status);
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
  onError?: (error: any) => any;
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
//   onError?: (error: any) => any;
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
  onError?: (error: any) => any;
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
              const updatedFlow = flows.find(
                (f) => isMatch(f, flow) && isEqual(f.match, flow.match)
              );
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
  onError?: (error: any) => any;
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
