#!/bin/sh
sudo gnome-terminal \
 --tab --title="RYU server" --command="ryu-manager ./net-tests/ryu/simple_switch_13.py ryu.app.ofctl_rest" \
 --tab --title="mininet network" --command="mn --topo=tree,2 --controller=remote --switch=ovs,protocols=OpenFlow13" \
 --tab --title="proxy server" --command="node ./corsServer/corsServer.js"
