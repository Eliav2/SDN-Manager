
## Requiremnts for running 'RUNME.SH' script:

### the computer running the script
- 

### the machine simulating the network
- [open vSwitch](http://www.openvswitch.org/)  installed.
- [Ryu SDN installed](https://ryu.readthedocs.io/en/latest/getting_started.html).
    - `$ sudo apt install python3-ryu`
- [Ryu ofctl_rest](https://ryu.readthedocs.io/en/latest/app/ofctl_rest.html) server application running.
    - `$ ryu-manager ryu.app.ofctl_rest`

you can use [mininet](http://mininet.org/download/) to emulate a network.


## self notes:
to run 'miniedit' on mininet vm run following commands:
```
$ sudo apt-get update
$ sudo apt-get install xinit flwm
$ startx

```
open new shell: rightClick>Debian>Applications>shells>bash
then run on the shell `$ sudo ~/mininet/examples/miniedit.py`
see [answer](https://stackoverflow.com/a/58038220) .
