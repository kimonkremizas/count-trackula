BROADCAST_TO_PORT = 7000
import time
from socket import *
from datetime import datetime
import random

s = socket(AF_INET, SOCK_DGRAM)
#s.bind(('', 14593))     # (ip, port)
# no explicit bind: will bind to default IP + random port
s.setsockopt(SOL_SOCKET, SO_BROADCAST, 1)
while True:
    now = datetime.now()
    strftime = now.strftime('%Y-%m-%d %H:%M:%S.%f')
    strftimeString = str(strftime[:-4])
        # THis will add the datetimenow and the IsEntrance bit/bool value
    data =strftimeString+",0"
    s.sendto(bytes(data, "UTF-8"), ('<broadcast>', BROADCAST_TO_PORT))
    print(data)
    time.sleep(2)