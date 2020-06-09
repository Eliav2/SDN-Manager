# SDN-Manager

to run project run following commands:

initiate ryu controller and ryu ofctl_rest API server:
$ sudo ryu-manager stupid_switch.py ryu.app.ofctl_rest

run emulated net using mininet: 
$ sudo mn --topo=tree,2 --controller=remote --switch=ovs,protocols=OpenFlow14

run proxy server(because react request passes through proxy server to prevent CORS): 
$ node ~/programming/IDF\ projects/SDN\ Manager/SDN\ Manager/backend/proxyServer/proxyServer.js

then enter react UI folder and start UI server:
$ cd ~/programming/IDF\ projects/SDN\ Manager/SDN\ Manager/UI 
$ yarn start
