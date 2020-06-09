# from flask import Flask, request
#
# app = Flask(__name__)
#
#
# @app.route("/")
# def home():
#     return "Yup flask is running"
#
#
# if __name__ == "__main__":
#     app.run(debug=True, host='0.0.0.0', port=5000)



from ryu.lib.ovs import vsctl

OVSDB_ADDR = 'tcp:127.0.0.1:6640'
ovs_vsctl = vsctl.VSCtl(OVSDB_ADDR)

# Equivalent to
# $ ovs-vsctl show
command = vsctl.VSCtlCommand('show')
ovs_vsctl.run_command([command])
print(command.result)
# ovs_vsctl

# ovs_path_addr = command.result.split('\n')[0]
# print(ovs_path_addr)
# print(vsctl.valid_ovsdb_addr('tcp:127.0.0.1:6640'))

# command = vsctl.VSCtlCommand('list', ('Port', 's1-eth1'))
# ovs_vsctl.run_command([command])
# print(vars(command))
# print(command.result[0].name)

#

# from ryu.services.protocols.ovsdb import event as ovsdb_event
# from ryu.services.protocols.ovsdb import api as ovsdb
# from ryu.controller.handler import set_ev_cls
# from ryu.base import app_manager
# import uuid
# import json


# class MyApp(app_manager.RyuApp):
#     @set_ev_cls(ovsdb_event.EventNewOVSDBConnection)
#     def handle_new_ovsdb_connection(self, ev):
#         system_id = ev.system_id
#         address = ev.client.address
#         self.logger.info(
#             'New OVSDB connection from system-id=%s, address=%s',
#             system_id, address)

#         # Example: If device has bridge "s1", add port "s1-eth99"
#         if ovsdb.bridge_exists(self, system_id, "s1"):
#             self.create_port(system_id, "s1", "s1-eth99")

#     def create_port(self, system_id, bridge_name, name):
#         new_iface_uuid = uuid.uuid4()
#         new_port_uuid = uuid.uuid4()

#         bridge = ovsdb.row_by_name(self, system_id, bridge_name)

#         def _create_port(tables, insert):
#             iface = insert(tables['Interface'], new_iface_uuid)
#             iface.name = name
#             iface.type = 'internal'

#             port = insert(tables['Port'], new_port_uuid)
#             port.name = name
#             port.interfaces = [iface]

#             bridge.ports = bridge.ports + [port]

#             return new_port_uuid, new_iface_uuid

#         req = ovsdb_event.EventModifyRequest(system_id, _create_port)
#         rep = self.send_request(req)

#         if rep.status != 'success':
#             self.logger.error('Error creating port %s on bridge %s: %s',
#                               name, bridge, rep.status)
#             return None

#         return rep.insert_uuids[new_port_uuid]


