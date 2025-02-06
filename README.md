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

##  주요 기능
- 카메라/초음파 센서와 마주보는 의자를 배치
- 컴퓨터로 시작 버튼을 누르고 사람이 의자에 앉으면 초음파 센서로 감지
- 5초간 감지되면 사진 촬영
- opencv로 얼굴 인식 -> 적당한 크기로 잘라서 증명사진 칸에 출력


<br />

##  시연
![Image](https://github.com/user-attachments/assets/00c1debc-4a5c-4e86-83c1-a2b3678c6bcf)
  
