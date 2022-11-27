import time
import RPi.GPIO as GPIO
import Adafruit_MCP3008


# 전역 변수 선언 및 초기화
trig = 20
echo = 16
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(trig, GPIO.OUT)
GPIO.setup(echo, GPIO.IN)
GPIO.output(trig, False)

def measureDistance():
        global trig, echo
        time.sleep(0.5)
        GPIO.output(trig, True) # 신호 1 발생
        time.sleep(0.00001) # 짧은 시간을 나타내기 위함
        GPIO.output(trig, False) # 신호 0 발생

        while(GPIO.input(echo) == 0):
                pulse_start = time.time() # 신호 1을 받았던 시간
        while(GPIO.input(echo) == 1):
                pulse_end = time.time() # 신호 0을 받았던 시간

        pulse_duration = pulse_end - pulse_start
        return 340*100/2*pulse_duration

# LED 점등을 위한 전역 변수 선언 및 초기jj화
led = 6 # 핀 번호 GPIO6 의미
GPIO.setup(led, GPIO.OUT) # GPIO 6번 핀을 출력 선으로 지정.

def controlLED(led = 6, onOff = 0): # led 번호의 핀에 onOff(0/1) 값 출력
        if(onOff==2):
            for i in range(5):
                GPIO.output(led,i%2)
                time.sleep(0.1)
            GPIO.output(led,0)

        else:
            GPIO.output(led, onOff)

mcp = Adafruit_MCP3008.MCP3008(clk=11, cs=8, miso=9, mosi=10)

def measureLight():
        return mcp.read_adc(0) # channel 0에 연결된 조도 센서로부터 조도값 읽기

if(__name__ == '__main__'):
        onOff = 1
        while(True):
                print('distance = %4.1f' % measureDistance())
                controlLED(led, onOff)
                time.sleep(0.3)
                onOff = 1 if(onOff == 0) else 0


