#!/bin/sh
sudo gnome-terminal \
 --tab --title="RYU server" --command="ryu-manager /home/eliav/programming/IDF\ projects/SDN\ Manager/SDN\ Manager/net-tests/ryu/simple_switch_13.py ryu.app.ofctl_rest" \
 --tab --title="mininet network" --command="mn --topo=tree,2 --controller=remote --switch=ovs,protocols=OpenFlow13" \
 --tab --title="proxy server" --command="node /home/eliav/programming/IDF\ projects/SDN\ Manager/SDN\ Manager/backend/proxyServer/proxyServer.js"