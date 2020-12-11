from datetime import datetime
import time
from socket import *
import random

BROADCAST_TO_PORT = 7000
s = socket(AF_INET, SOCK_DGRAM)
s.setsockopt(SOL_SOCKET, SO_BROADCAST, 1)

counter=0
    
while True:
    now = datetime.now()
    strftime = now.strftime('%Y-%m-%d %H:%M:%S.%f')
    strftimeString = str(strftime[:-4])
    print(strftimeString)
    value = random.randint(0,1)
    isEntranceString = str(value)
    data =strftimeString+","+isEntranceString
    s.sendto(bytes(data, "UTF-8"), ('<broadcast>', BROADCAST_TO_PORT))
    time.sleep(30)
