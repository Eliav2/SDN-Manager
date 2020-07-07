// export const matchFields = [
//   ["in_port", "Integer 32bit", "Switch input port"],
//   ["in_phy_port", "Integer 32bit", "Switch physical input port"],
//   ["metadata", "Integer 64bit", "Metadata passed between tables"],
//   ["eth_dst", "MAC address", "Ethernet destination address"],
//   ["eth_src", "MAC address", "Ethernet source address"],
//   ["eth_type", "Integer 16bit", "Ethernet frame type"],
//   ["vlan_vid", "Integer 16bit", "VLAN id"],
//   ["vlan_pcp", "Integer 8bit", "VLAN priority"],
//   ["ip_dscp", "Integer 8bit", "IP DSCP (6 bits in ToS field)"],
//   ["ip_ecn", "Integer 8bit", "IP ECN (2 bits in ToS field)"],
//   ["ip_proto", "Integer 8bit", "IP protocol"],
//   ["ipv4_src", "IPv4 address", "IPv4 source address"],
//   ["ipv4_dst", "IPv4 address", "IPv4 destination address"],
//   ["tcp_src", "Integer 16bit", "TCP source port"],
//   ["tcp_dst", "Integer 16bit", "TCP destination port"],
//   ["udp_src", "Integer 16bit", "UDP source port"],
//   ["udp_dst", "Integer 16bit", "UDP destination port"],
//   ["sctp_src", "Integer 16bit", "SCTP source port"],
//   ["sctp_dst", "Integer 16bit", "SCTP destination port"],
//   ["icmpv4_type", "Integer 8bit", "ICMP type"],
//   ["icmpv4_code", "Integer 8bit", "ICMP code"],
//   ["arp_op", "Integer 16bit", "ARP opcode"],
//   ["arp_spa", "IPv4 address", "ARP source IPv4 address"],
//   ["arp_tpa", "IPv4 address", "ARP target IPv4 address"],
//   ["arp_sha", "MAC address", "ARP source hardware address"],
//   ["arp_tha", "MAC address", "ARP target hardware address"],
//   ["ipv6_src", "IPv6 address", "IPv6 source address"],
//   ["ipv6_dst", "IPv6 address", "IPv6 destination address"],
//   ["ipv6_flabel", "Integer 32bit", "IPv6 Flow Label"],
//   ["icmpv6_type", "Integer 8bit", "ICMPv6 type"],
//   ["icmpv6_code", "Integer 8bit", "ICMPv6 code"],
//   ["ipv6_nd_target", "IPv6 address", "Target address for ND"],
//   ["ipv6_nd_sll", "MAC address", "Source link-layer for ND"],
//   ["ipv6_nd_tll", "MAC address", "Target link-layer for ND"],
//   ["mpls_label", "Integer 32bit", "MPLS label"],
//   ["mpls_tc", "Integer 8bit", "MPLS TC"],
//   ["mpls_bos", "Integer 8bit", "MPLS BoS bit"],
//   ["pbb_isid", "Integer 24bit", "PBB I-SID"],
//   ["tunnel_id", "Integer 64bit", "Logical Port Metadata"],
//   ["ipv6_exthdr", "Integer 16bit", "IPv6 Extension Header pseudo-field"],
//   ["pbb_uca", "Integer 8bit", "PBB UCA header field (EXT-256 Old version of ONF Extension)"],
//   ["tcp_flags", "Integer 16bit", "TCP flags (EXT-109 ONF Extension)"],
//   ["actset_output", "Integer 32bit", "Output port from action set metadata (EXT-233 ONF Extension)"],

import { BoxType } from "./Box";

// ];
export const matchFields = [
  ["in_port", "Switch input port (int)", '{"in_port": 7}'],
  ["in_phy_port", "Switch physical input port (int)", '{"in_phy_port": 5, "in_port": 3}'],
  [
    "metadata",
    "Metadata passed between tables (int or string)",
    '{"metadata": 12345} or {"metadata": "0x1212/0xffff"}',
  ],
  ["eth_src", "Ethernet source address (string)", '{"eth_src": "aa:bb:cc:11:22:33"}'],
  ["dl_src", "Ethernet source address (string)", '{"eth_src": "aa:bb:cc:11:22:33"}'],
  ["eth_dst", "Ethernet destination address (string)", '{"eth_dst": "aa:bb:cc:11:22:33/00:00:00:00:ff:ff"}'],
  ["dl_dst", "Ethernet destination address (string)", '{"eth_dst": "aa:bb:cc:11:22:33/00:00:00:00:ff:ff"}'],
  ["eth_type", "Ethernet frame type (int)", '{"eth_type": 2048}'],
  ["dl_type", "Ethernet frame type (int)", '{"eth_type": 2048}'],
  ["vlan_vid", "VLAN id (int or string)", "See Example of VLAN ID match field"],
  ["vlan_pcp", "VLAN priority (int)", '{"vlan_pcp": 3, "vlan_vid": 3}'],
  ["ip_dscp", "IP DSCP (6 bits in ToS field) (int)", '{"ip_dscp": 3, "eth_type": 2048}'],
  ["ip_ecn", "IP ECN (2 bits in ToS field) (int)", '{"ip_ecn": 0, "eth_type": 34525}'],
  ["ip_proto", "IP protocol (int)", '{"ip_proto": 5, "eth_type": 34525}'],
  ["ipv4_src", "IPv4 source address (string)", '{"ipv4_src": "192.168.0.1", "eth_type": 2048}'],
  ["ipv4_dst", "IPv4 destination address (string)", '{"ipv4_dst": "192.168.10.10/255.255.255.0", "eth_type": 2048}'],
  ["tcp_src", "TCP source port (int)", '{"tcp_src": 3, "ip_proto": 6, "eth_type": 2048}'],
  ["tcp_dst", "TCP destination port (int)", '{"tcp_dst": 5, "ip_proto": 6, "eth_type": 2048}'],
  ["udp_src", "UDP source port (int)", '{"udp_src": 2, "ip_proto": 17, "eth_type": 2048}'],
  ["udp_dst", "UDP destination port (int)", '{"udp_dst": 6, "ip_proto": 17, "eth_type": 2048}'],
  ["sctp_src", "SCTP source port (int)", '{"sctp_src": 99, "ip_proto": 132, "eth_type": 2048}'],
  ["sctp_dst", "SCTP destination port (int)", '{"sctp_dst": 99, "ip_proto": 132, "eth_type": 2048}'],
  ["icmpv4_type", "ICMP type (int)", '{"icmpv4_type": 5, "ip_proto": 1, "eth_type": 2048}'],
  ["icmpv4_code", "ICMP code (int)", '{"icmpv4_code": 6, "ip_proto": 1, "eth_type": 2048}'],
  ["arp_op", "ARP opcode (int)", '{"arp_op": 3, "eth_type": 2054}'],
  ["arp_spa", "ARP source IPv4 address (string)", '{"arp_spa": "192.168.0.11", "eth_type": 2054}'],
  ["arp_tpa", "ARP target IPv4 address (string)", '{"arp_tpa": "192.168.0.44/24", "eth_type": 2054}'],
  ["arp_sha", "ARP source hardware address (string)", '{"arp_sha": "aa:bb:cc:11:22:33", "eth_type": 2054}'],
  [
    "arp_tha",
    "ARP target hardware address (string)",
    '{"arp_tha": "aa:bb:cc:11:22:33/00:00:00:00:ff:ff", "eth_type": 2054}',
  ],
  ["ipv6_src", "IPv6 source address (string)", '{"ipv6_src": "2001::aaaa:bbbb:cccc:1111", "eth_type": 34525}'],
  ["ipv6_dst", "IPv6 destination address (string)", '{"ipv6_dst": "2001::ffff:cccc:bbbb:1111/64", "eth_type": 34525}'],
  ["ipv6_flabel", "IPv6 Flow Label (int)", '{"ipv6_flabel": 2, "eth_type": 34525}'],
  ["icmpv6_type", "ICMPv6 type (int)", '{"icmpv6_type": 3, "ip_proto": 58, "eth_type": 34525}'],
  ["icmpv6_code", "ICMPv6 code (int)", '{"icmpv6_code": 4, "ip_proto": 58, "eth_type": 34525}'],
  [
    "ipv6_nd_target",
    "Target address for Neighbor Discovery (string)",
    '{"ipv6_nd_target": "2001::ffff:cccc:bbbb:1111", "icmpv6_type": 135, "ip_proto": 58, "eth_type": 34525}',
  ],
  [
    "ipv6_nd_sll",
    "Source link-layer for Neighbor Discovery (string)",
    '{"ipv6_nd_sll": "aa:bb:cc:11:22:33", "icmpv6_type": 135, "ip_proto": 58, "eth_type": 34525}',
  ],
  [
    "ipv6_nd_tll",
    "Target link-layer for Neighbor Discovery (string)",
    '{"ipv6_nd_tll": "aa:bb:cc:11:22:33", "icmpv6_type": 136, "ip_proto": 58, "eth_type": 34525}',
  ],
  ["mpls_label", "MPLS label (int)", '{"mpls_label": 3, "eth_type": 34888}'],
  ["mpls_tc", "MPLS Traffic Class (int)", '{"mpls_tc": 2, "eth_type": 34888}'],
  ["mpls_bos", "MPLS BoS bit (int) (Openflow1.3+)", '{"mpls_bos": 1, "eth_type": 34888}'],
  [
    "pbb_isid",
    "PBB I-SID (int or string) (Openflow1.3+)",
    '{"pbb_isid": 5, "eth_type": 35047} or{"pbb_isid": "0x05/0xff", "eth_type": 35047}',
  ],
  [
    "tunnel_id",
    "Logical Port Metadata (int or string) (Openflow1.3+)",
    '{"tunnel_id": 7} or {"tunnel_id": "0x07/0xff"}',
  ],
  [
    "ipv6_exthdr",
    "IPv6 Extension Header pseudo-field (int or string) (Openflow1.3+)",
    '{"ipv6_exthdr": 3, "eth_type": 34525} or {"ipv6_exthdr": "0x40/0x1F0", "eth_type": 34525}',
  ],
  // ["pbb_uca", "PBB UCA hander field(int) (Openflow1.4+)", '{"pbb_uca": 1, "eth_type": 35047}'],
  // ["tcp_flags", "TCP flags(int) (Openflow1.5+)", '{"tcp_flags": 2, "ip_proto": 6, "eth_type": 2048}'],
  // ["actset_output", "Output port from action set metadata(int) (Openflow1.5+)", '{"actset_output": 3}'],
  // ["packet_type", "Packet type value(int) (Openflow1.5+)", '{"packet_type": [1, 2048]}'],
] as const;

// export type matchFieldsType = typeof matchFields[number][0];

// export const matchFields = [
//   ["in_port", "Switch input port (int)", '{"in_port": 7}'],
//   ["in_phy_port", "Switch physical input port (int)", '{"in_phy_port": 5, "in_port": 3}'],
//   [
//     "metadata",
//     "Metadata passed between tables (int or string)",
//     '{"metadata": 12345} or {"metadata": "0x1212/0xffff"}',
//   ],
//   ["eth_src", "(string)"]
//   ["dl_src", "(string)"]
//   ["eth_dst", "(string)"]
//   ["dl_dst", "(string)"]
//   ["eth_type", "(int)]
//   ["dl_type", "(int)]
//   ["vlan_vid", "(int or string)"],
//   ["vlan_pcp", "VLAN priority (int)", '{"vlan_pcp": 3, "vlan_vid": 3}'],
//   ["ip_dscp", "IP DSCP (6 bits in ToS field) (int)", '{"ip_dscp": 3, "eth_type": 2048}'],
//   ["ip_ecn", "IP ECN (2 bits in ToS field) (int)", '{"ip_ecn": 0, "eth_type": 34525}'],
//   ["ip_proto", "IP protocol (int)", '{"ip_proto": 5, "eth_type": 34525}'],
//   ["ipv4_src", "IPv4 source address (string)", '{"ipv4_src": "192.168.0.1", "eth_type": 2048}'],
//   ["ipv4_dst", "IPv4 destination address (string)", '{"ipv4_dst": "192.168.10.10/255.255.255.0", "eth_type": 2048}'],
//   ["tcp_src", "TCP source port (int)", '{"tcp_src": 3, "ip_proto": 6, "eth_type": 2048}'],
//   ["tcp_dst", "TCP destination port (int)", '{"tcp_dst": 5, "ip_proto": 6, "eth_type": 2048}'],
//   ["udp_src", "UDP source port (int)", '{"udp_src": 2, "ip_proto": 17, "eth_type": 2048}'],
//   ["udp_dst", "UDP destination port (int)", '{"udp_dst": 6, "ip_proto": 17, "eth_type": 2048}'],
//   ["sctp_src", "SCTP source port (int)", '{"sctp_src": 99, "ip_proto": 132, "eth_type": 2048}'],
//   ["sctp_dst", "SCTP destination port (int)", '{"sctp_dst": 99, "ip_proto": 132, "eth_type": 2048}'],
//   ["icmpv4_type", "ICMP type (int)", '{"icmpv4_type": 5, "ip_proto": 1, "eth_type": 2048}'],
//   ["icmpv4_code", "ICMP code (int)", '{"icmpv4_code": 6, "ip_proto": 1, "eth_type": 2048}'],
//   ["arp_op", "ARP opcode (int)", '{"arp_op": 3, "eth_type": 2054}'],
//   ["arp_spa", "ARP source IPv4 address (string)", '{"arp_spa": "192.168.0.11", "eth_type": 2054}'],
//   ["arp_tpa", "ARP target IPv4 address (string)", '{"arp_tpa": "192.168.0.44/24", "eth_type": 2054}'],
//   ["arp_sha", "ARP source hardware address (string)", '{"arp_sha": "aa:bb:cc:11:22:33", "eth_type": 2054}'],
//   [
//     "arp_tha",
//     "ARP target hardware address (string)",
//     '{"arp_tha": "aa:bb:cc:11:22:33/00:00:00:00:ff:ff", "eth_type": 2054}',
//   ],
//   ["ipv6_src", "IPv6 source address (string)", '{"ipv6_src": "2001::aaaa:bbbb:cccc:1111", "eth_type": 34525}'],
//   ["ipv6_dst", "IPv6 destination address (string)", '{"ipv6_dst": "2001::ffff:cccc:bbbb:1111/64", "eth_type": 34525}'],
//   ["ipv6_flabel", "IPv6 Flow Label (int)", '{"ipv6_flabel": 2, "eth_type": 34525}'],
//   ["icmpv6_type", "ICMPv6 type (int)", '{"icmpv6_type": 3, "ip_proto": 58, "eth_type": 34525}'],
//   ["icmpv6_code", "ICMPv6 code (int)", '{"icmpv6_code": 4, "ip_proto": 58, "eth_type": 34525}'],
//   [
//     "ipv6_nd_target",
//     "Target address for Neighbor Discovery (string)",
//     '{"ipv6_nd_target": "2001::ffff:cccc:bbbb:1111", "icmpv6_type": 135, "ip_proto": 58, "eth_type": 34525}',
//   ],
//   [
//     "ipv6_nd_sll",
//     "Source link-layer for Neighbor Discovery (string)",
//     '{"ipv6_nd_sll": "aa:bb:cc:11:22:33", "icmpv6_type": 135, "ip_proto": 58, "eth_type": 34525}',
//   ],
//   [
//     "ipv6_nd_tll",
//     "Target link-layer for Neighbor Discovery (string)",
//     '{"ipv6_nd_tll": "aa:bb:cc:11:22:33", "icmpv6_type": 136, "ip_proto": 58, "eth_type": 34525}',
//   ],
//   ["mpls_label", "MPLS label (int)", '{"mpls_label": 3, "eth_type": 34888}'],
//   ["mpls_tc", "MPLS Traffic Class (int)", '{"mpls_tc": 2, "eth_type": 34888}'],
//   ["mpls_bos", "MPLS BoS bit (int) (Openflow1.3+)", '{"mpls_bos": 1, "eth_type": 34888}'],
//   [
//     "pbb_isid",
//     "PBB I-SID (int or string) (Openflow1.3+)",
//     '{"pbb_isid": 5, "eth_type": 35047} or{"pbb_isid": "0x05/0xff", "eth_type": 35047}',
//   ],
//   [
//     "tunnel_id",
//     "Logical Port Metadata (int or string) (Openflow1.3+)",
//     '{"tunnel_id": 7} or {"tunnel_id": "0x07/0xff"}',
//   ],
//   [
//     "ipv6_exthdr",
//     "IPv6 Extension Header pseudo-field (int or string) (Openflow1.3+)",
//     '{"ipv6_exthdr": 3, "eth_type": 34525} or {"ipv6_exthdr": "0x40/0x1F0", "eth_type": 34525}',
//   ],
//   // ["pbb_uca", "PBB UCA hander field(int) (Openflow1.4+)", '{"pbb_uca": 1, "eth_type": 35047}'],
//   // ["tcp_flags", "TCP flags(int) (Openflow1.5+)", '{"tcp_flags": 2, "ip_proto": 6, "eth_type": 2048}'],
//   // ["actset_output", "Output port from action set metadata(int) (Openflow1.5+)", '{"actset_output": 3}'],
//   // ["packet_type", "Packet type value(int) (Openflow1.5+)", '{"packet_type": [1, 2048]}'],
// ] as const;

export const actionsFields = [
  ["OUTPUT", 'Output packet from "port"', '{"type": "OUTPUT", "port": 3}'],
  ["COPY_TTL_OUT", "Copy TTL outwards", '{"type": "COPY_TTL_OUT"}'],
  ["COPY_TTL_IN", "Copy TTL inwards", '{"type": "COPY_TTL_IN"}'],
  ["SET_MPLS_TTL", 'Set MPLS TTL using "mpls_ttl"', '{"type": "SET_MPLS_TTL", "mpls_ttl": 64}'],
  ["DEC_MPLS_TTL", "Decrement MPLS TTL", '{"type": "DEC_MPLS_TTL"}'],
  ["PUSH_VLAN", 'Push a new VLAN tag with "ethertype"', '{"type": "PUSH_VLAN", "ethertype": 33024}'],
  ["POP_VLAN", "Pop the outer VLAN tag", '{"type": "POP_VLAN"}'],
  ["PUSH_MPLS", 'Push a new MPLS tag with "ethertype"', '{"type": "PUSH_MPLS", "ethertype": 34887}'],
  ["POP_MPLS", 'Pop the outer MPLS tag with "ethertype"', '{"type": "POP_MPLS", "ethertype": 2054}'],
  ["SET_QUEUE", 'Set queue id using "queue_id" when outputting to a port', '{"type": "SET_QUEUE", "queue_id": 7}'],
  ["GROUP", 'Apply group identified by "group_id"', '{"type": "GROUP", "group_id": 5}'],
  ["SET_NW_TTL", 'Set IP TTL using "nw_ttl"', '{"type": "SET_NW_TTL", "nw_ttl": 64}'],
  ["DEC_NW_TTL", "Decrement IP TTL", '{"type": "DEC_NW_TTL"}'],
  [
    "SET_FIELD",
    'Set a "field" using "value" (The set of keywords available for "field" is the same as match field)',
    "See Example of set-field action",
  ],
  [
    "PUSH_PBB",
    'Push a new PBB service tag with "ethertype" (Openflow1.3+)',
    '{"type": "PUSH_PBB", "ethertype": 35047}',
  ],
  ["POP_PBB", "Pop the outer PBB service tag (Openflow1.3+)", '{"type": "POP_PBB"}'],
  // [
  //   "COPY_FIELD",
  //   "Copy value between header and register (Openflow1.5+)",
  //   '{"type": "COPY_FIELD", "n_bits": 32, "src_offset": 1, "dst_offset": 2, "src_oxm_id": "eth_src", "dst_oxm_id": "eth_dst"}',
  // ],
  // ["METER", 'Apply meter identified by "meter_id" (Openflow1.5+)', '{"type": "METER", "meter_id": 3}'],
  [
    "EXPERIMENTER",
    'Extensible action for the experimenter (Set "base64" or "ascii" to "data_type" field)',
    '{"type": "EXPERIMENTER", "experimenter": 101, "data": "AAECAwQFBgc=", "data_type": "base64"}',
  ],
  [
    "GOTO_TABLE",
    '(Instruction) Setup the next table identified by "table_id"',
    '{"type": "GOTO_TABLE", "table_id": 8}',
  ],
  [
    "WRITE_METADATA",
    '(Instruction) Setup the metadata field using "metadata" and "metadata_mask"',
    '{"type": "WRITE_METADATA", "metadata": 0x3, "metadata_mask": 0x3}',
  ],
  [
    "METER",
    '(Instruction) Apply meter identified by "meter_id" (deprecated in Openflow1.5)',
    '{"type": "METER", "meter_id": 3}',
  ],
  [
    "WRITE_ACTIONS",
    "(Instruction) Write the action(s) onto the datapath action set",
    '{"type": "WRITE_ACTIONS", actions":[{"type":"POP_VLAN",},{ "type":"OUTPUT", "port": 2}]}',
  ],
  ["CLEAR_ACTIONS", "(Instruction) Clears all actions from the datapath action set", '{"type": "CLEAR_ACTIONS"}'],
] as const;

// export type actionsFieldsType = typeof actionsFields[number][0];

export type sectionNameType = "actions" | "match";
export type fieldsType<secName extends sectionNameType> = secName extends "match"
  ? typeof matchFields
  : typeof actionsFields;
export type fieldsNameType<secName extends sectionNameType> = fieldsType<secName>[number][0];

// matchFields.map(m=> ({[m[0]]:m[1].concat}))
