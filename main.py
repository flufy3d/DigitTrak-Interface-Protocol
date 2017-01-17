import time
import json
from random import *
from SimpleWebSocketServer import *

clients = []  #list

context = {}  #dict


def doSend(self,data):
    data_string = json.dumps(data)
    self.sendMessage(unicode(data_string))
    context['server'].serve()


class SWSS(WebSocket):

    def handleMessage(self):
        # echo message back to client
        print self.data
        jdata = json.loads(self.data)
        if jdata[u'cmd'] == 0 and u'cmd' in jdata:
            print 'set Standby.'
            context['standby'] = 1
        elif jdata[u'cmd'] == 5 and u'cmd' in jdata:            
            data = jdata[u'broadcast']
            for client in clients:
                #if client != self:
                doSend(client,data)
             




    def handleConnected(self):
        print self.address, 'connected'
        clients.append(self)
        if context['device_status'] == 0:
            data = {'device_status':0}
            doSend(self,data)

    def handleClose(self):
        print self.address, 'closed'
        clients.remove(self)

def init():
    context['device_status'] = 0
    context['standby'] = 0
    context['server'] = SimpleWebSocketServer('', 8000, SWSS,0.016)


def sendBallData():
    balldata = {}
    balldata['type'] = 0
    balldata['data'] = {}
    balldata['data']['backspin'] = round(uniform(2.3,10222),3)
    balldata['data']['sidespin'] = round(uniform(-400,300),3)
    balldata['data']['pitch'] = round(uniform(0,20.0),3)
    balldata['data']['yaw'] = round(uniform(-15,15),3)
    balldata['data']['velocity'] = round(uniform(1.1,85.0),3)
    balldata['data']['confidence'] = round(uniform(0.8,0.99),3)

    print 'send ball data'
    for client in clients:
        doSend(client,balldata)


def sendClubData():
    clubdata = {}
    clubdata['type'] = 1
    clubdata['data'] = {}
    clubdata['data']['club_velocity'] = 13.2
    clubdata['data']['club_horiz'] = 0.54
    clubdata['data']['club_vert'] = 16
    clubdata['data']['ball_offset'] = -0.02

    print 'send club data'
    for client in clients:
        doSend(client,clubdata)


def main():
    init();
    while True:
        context['server'].serve()




