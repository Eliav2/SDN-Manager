from mininet.node import RemoteController
from mininet.topo import Topo
from mininet.net import Mininet
from mininet.util import dumpNodeConnections
from mininet.log import setLogLevel


class SingleSwitchTopo(Topo):
    "Single switch connected to n hosts."
    def build(self, n=3):
        switch = self.addSwitch('s1')
        # Python's range(N) generates 0..N-1
        for h in range(n):
            host = self.addHost('h%s' % (h + 1))
            self.addLink(host, switch)

def simpleTest():
    "Create and test a simple network"
    topo = SingleSwitchTopo(n=4)
    net = Mininet(topo=topo,controller = RemoteController)
    # net = Mininet(topo)
    net.start()
    print "Dumping host connections"
    dumpNodeConnections(net.hosts)
    print "Testing network connectivity"
    net.pingAll()
    net.stop()

if __name__ == '__main__':
    # Tell mininet to print useful information
    setLogLevel('info')
    simpleTest()


"""Custom topology example

Two directly connected switches plus a host for each switch:

   host --- switch --- switch --- host

Adding the 'topos' dict with a key/value pair to generate our newly defined
topology enables one to pass in '--topo=mytopo' from the command line.
"""

# from mininet.topo import Topo

# class MyTopo( Topo ):
#     "Simple topology example."

#     def __init__( self ):
#         "Create custom topo."

#         # Initialize topology
#         Topo.__init__( self )

#         # Add hosts and switches
#         leftHost = self.addHost( 'h1' )
#         rightHost = self.addHost( 'h2' )
#         leftSwitch = self.addSwitch( 's3' )
#         rightSwitch = self.addSwitch( 's4' )

#         # Add links
#         self.addLink( leftHost, leftSwitch )
#         self.addLink( leftSwitch, rightSwitch )
#         self.addLink( rightSwitch, rightHost )


topos = { 'mytopo': ( lambda: SingleSwitchTopo() ) }