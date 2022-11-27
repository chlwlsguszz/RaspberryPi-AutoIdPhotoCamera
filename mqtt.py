import time
import paho.mqtt.client as mqtt
import camera
import circuit

def on_connect(client, userdata, flag, rc):
	print("Connect with result code:"+ str(rc))
	client.subscribe("request", qos = 0)
	client.subscribe("led", qos = 0)
	client.subscribe("opencv", qos = 0)
	pass

def on_message(client, userdata, msg) :
	if(msg.topic == "request"):
		client.publish("image", camera.takePicture(), qos = 0)
		pass
	elif(msg.topic == "led"):
		msg = int(msg.payload);
		circuit.controlLED(onOff=msg)
		pass
	elif(msg.topic == "opencv"):
		client.publish("IDPhoto", camera.cv_takePicture(), qos = 0)
		pass

broker_ip = "localhost" # 현재 이 컴퓨터를 브로커로 설정

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect(broker_ip, 1883)
client.loop_start()

while(True):
        distance = circuit.measureDistance()
        client.publish("ultrasonic", distance, qos=0)
        client.publish("light", circuit.measureLight(), qos = 0)
        time.sleep(0.5)

client.loop_stop()
client.disconnect()
