# 라즈베리파이 무인 인증사진 촬영기


<div id="2"></div>

##  개요
- 무인 인증사진 촬영기
- H/W: 라즈베리파이 3.0
- Python, Linux
- 2021.12 2학년 개인 미니프로젝트
- 시연 동영상 (https://www.youtube.com/watch?v=On1XHwmrGYU)

<br />

##  회로 구성
라즈베리파이 -> Bread Board 연결
라즈베리파이 -> 카메라 연결

Bread Board 부착 부품
- 초음파 센서 (GPIO16, GPIO20)
- LED (GPIO6) 
- MCP3202 (SPIMOSI, SPIMISO, SPISCLK, SPICE0, 조도센서)
- 조도 센서

LED와 조도센서에는 저항을 연결함
<br />

## 코드 구성 
<details>
  <summary>펼치기/접기</summary>
  app.py </br>
  flask로 html 웹페이지를 띄움 </br>
  </br> camera.py </br>
  카메라로 사진을 찍어서 opencv로 얼굴을 인식 </br>
  증명사진 모양으로 잘라서 반환 (haarCascades 필요) </br>
  </br> circuit.py </br>
  인자에 따라서 LED를 키거나, 끄거나, 빠르게 깜박거리는 함수 </br>
  거리와 조도를 측정해서 리턴 </br>
  </br> mqtt.py </br>
  실시간 카메라, led, opencv 명령을 받기 위해 세 개의 토픽으로 subscribe </br>
  실시간 카메라 요청을 받으면 단순히 사진을 찍어서 publish </br>
  Led 요청을 받으면 msg의 값에 따라서 led를 조정 </br>
  Opencv 요청을 받으면 증명사진을 만들어서 publish </br>
  1초에 한번 초음파와 조도를 측정하여 계속 publish </br>
  </br> mqtt.html </br> 
  사용자 입력을 받고 실시간 카메라 및 증명사진과 센서 값을 송출함 </br>
  웹페이지에서 촬영시작 명령을 내리며 증명사진을 출력하고 다운로드 받을 수 있음 </br>
  초음파 센서와 조도 센서의 거리 값을 계속 보여줌 ( 밝기가 낮으면 경고, 전구 그림이 바뀜 ) </br>
  상태 정보를 나타내는 텍스트 필드가 있어 프로그램 상태를 대화 형식으로 보여줌 </br>
  </br> Mqttio.js </br> 
  라즈베리파이와 브라우저를 연결함  </br>
  실시간 이미지, 증명사진, 조도값, 초음파값을 받기 위해 subscribe  </br>
  연결이 되면 실시간 카메라를 받기 위해 계속 publish  </br>
  메시지를 받아서 각 토픽에 따라서 행동하며, 지속적으로 텍스트필드에 상태메세지를 띄움 </br>
  
</details>

##  주요 기능

- 카메라/초음파 센서와 마주보는 의자를 배치
- 컴퓨터로 시작 버튼을 누르고 사람이 의자에 앉으면 초음파 센서로 감지
- 5초간 감지되면 사진 촬영
- opencv로 얼굴 인식 -> 적당한 크기로 잘라서 증명사진 칸에 출력
- 밝기 감지, 밝기가 너무 낮으면 촬영 X
- LED의 깜빡임으로 사용자가 촬영을 인식

<br />

##  시연
![Image](https://github.com/user-attachments/assets/7c0f00ef-2012-4699-af78-8e7aade55d3d)

![Image](https://github.com/user-attachments/assets/20eef0b2-d479-45f5-b62a-e508c4656228)
