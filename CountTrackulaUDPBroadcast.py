from datetime import datetime
import time
from socket import *
from sense_hat import SenseHat

BROADCAST_TO_PORT = 7000
s = socket(AF_INET, SOCK_DGRAM)
s.setsockopt(SOL_SOCKET, SO_BROADCAST, 1)

sense = SenseHat()
sense.set_imu_config(True, True, True)
red = (255, 0, 0)
green = (0, 255, 0)
counter=0
sense.clear()


sense.show_message("WAIT", text_colour=[255, 0, 0])
time.sleep(15)
sense.show_message("GO", text_colour=[255, 0, 0])
o = sense.get_orientation()
resting_yaw = round(o["yaw"],3)
print("Resting yaw: {0}".format(resting_yaw))
    
while True:
    o = sense.get_orientation()
    yaw = round(o["yaw"],3)
    print("yaw: {0}".format(yaw))
    if yaw>resting_yaw+5.5 and yaw<resting_yaw+9.5:
        if counter != 1:
            print("-------------Door opened. PUT BROADCAST HERE")
            now = datetime.now()
            strftime = now.strftime('%Y-%m-%d %H:%M:%S.%f')
            strftimeString = str(strftime[:-4])
            isEntranceString = str(1)
            data =strftimeString+","+isEntranceString
            s.sendto(bytes(data, "UTF-8"), ('<broadcast>', BROADCAST_TO_PORT))
            sense.clear(red)
            counter += 1
        else:
            print("-------------Door closed")
            sense.clear(green)
            counter = 0
    time.sleep(0.10)
