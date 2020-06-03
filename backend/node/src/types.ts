type types = {
  dbTable:
    | "Controller"
    | "Bridge"
    | "Queue"
    | "IPFIX"
    | "NetFlow"
    | "Open_vSwitch"
    | "QoS"
    | "Port"
    | "sFlow"
    | "SSL"
    | "Flow_Sample_Collector_Set"
    | "Mirror"
    | "Flow_Table"
    | "Interface"
    | "AutoAttach"
    | "Manager";
  getTableArgs: { remote: Client };
};

export default types;
