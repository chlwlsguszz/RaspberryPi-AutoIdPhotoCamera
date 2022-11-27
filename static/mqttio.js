function startConnect() { 
    clientID = "clientID-" + parseInt(Math.random() * 100); 
    
    broker = document.getElementById("broker").value; 
    port = document.getElementById("port").value; 

    // 연결을 시도하고 있음을 상태메세지로 알림
    // 아래의 scrollTop 프로퍼티는 텍스트필드의 스크롤을 계속 내려주기 위해 모든 메세지에 적용
    document.getElementById("chatbox").value += broker + ':' + port + '로 접속 시도\n';
    document.getElementById("chatbox").scrollTop = document.getElementById("chatbox").scrollHeight;

    client = new Paho.MQTT.Client(broker, Number(port), clientID);

    client.onConnectionLost = onConnectionLost; 
    client.onMessageArrived = onMessageArrived; 

    client.connect({
        onSuccess: onConnect,
    });
}

var isConnected = false;

function onConnect() {
    // 연결되었음을 알림
    document.getElementById("chatbox").value += '접속 성공, ' + '사진 촬영이 가능합니다.\n';
    document.getElementById("chatbox").scrollTop = document.getElementById("chatbox").scrollHeight;
    // 실시간 카메라, 증명사진, 조도 값을 받기 위해 세가지 토픽으로 구독
    client.subscribe("image", qos = 0); 
    client.subscribe("IDPhoto", qos = 0);
    client.subscribe("light", qos=0);
    // 실시간 카메라를 요청함
    client.send("request", 'test', 0, false);
    isConnected = true;
}

// 접속이 끊어지면 오류메세지를 상태메세지에 출력
function onConnectionLost(responseObject) { 
    document.getElementById("chatbox").value += '오류 : 접속 끊어짐\n';
    document.getElementById("chatbox").scrollTop = document.getElementById("chatbox").scrollHeight;
    if (responseObject.errorCode !== 0) {
        document.getElementById("chatbox").value += '오류 : ' + + responseObject.errorMessage + '\n';
        document.getElementById("chatbox").scrollTop = document.getElementById("chatbox").scrollHeight;
    }
}

var chairFlag = true; // 의자에 앉아달라는 말을 한번만 하기 위한 flag
var count = 5; // count가 0이 되면 증명사진을 만들기 위해
var lightFlag = false; // 전구의 그림을 한번만 바꾸기 위한 flag

function onMessageArrived(msg) { 
    // 메세지의 토픽이 request이면 msg 바이트값을 사진으로 바꿔서 송출하고 다시 요청함
    if(msg.destinationName == "image")    {
        bytesAsBase64 = btoa(String.fromCharCode.apply(null, msg.payloadBytes));
        document.getElementById("image").src = "data:image/jpg;base64," + bytesAsBase64;
        client.send('request', 'test', 0, false);
    }
    // 초음파 값이 온 경우
    else if(msg.destinationName == "ultrasonic") {
        distance = parseInt(msg.payloadString);
        // html 창에 거리값을 띄움
        document.getElementById("distance").innerHTML = distance;
        // 의자에 앉지 않아서 거리값이 1000을 넘거나 혹은 너무 가까운 경우
        if((distance >=1000 || distance <60) && chairFlag==true) {  
            client.send("led", '0', 0, false); // led를 끔
            chairFlag=false; // 의자에 앉아달라는 말을 한번만 하기 위해 존재
            document.getElementById("chatbox").value += "의자에 앉아주세요.\n";
            document.getElementById("chatbox").scrollTop = document.getElementById("chatbox").scrollHeight;
            count = 5; // count를 다시 5로 바꿈
        }
        // 의자에 잘 앉아있는 경우
        else if (distance >=60 && distance <= 100) {
            client.send("led", '1', 0, false); // led를 킴
            chairFlag=true; // 벗어나면 다시 의자에 앉아달라는 말을 하기 위해
            document.getElementById("chatbox").value += count+"초 후 사진을 찍습니다.\n";
            document.getElementById("chatbox").scrollTop = document.getElementById("chatbox").scrollHeight;
            count--;
            if(count == 0) { // 5초가 지나면 사진 촬영
                count = 5; // 다음 번 촬영을 위해 count를 다시 5로 바꿈 
                client.send("led", '2', 0, false); // 인자가 2면 led가 깜박거림, 사진이 찍혔음을 알림
                client.unsubscribe("ultrasonic", null); // 다음 요청까지 사진 촬영을 멈춤
                document.getElementById("chatbox").value += "사진 촬영 완료, 증명 사진을 만듭니다.\n";
                document.getElementById("chatbox").scrollTop = document.getElementById("chatbox").scrollHeight;
                client.send('opencv', 'test', 0, false); // 얼굴을 인식해서 자른 증명사진을 요청
            }
        }
    }
    // 증명사진의 파일 이름이 온 경우
    else if (msg.destinationName == "IDPhoto") {
        // 경로를 증명사진의 이름으로 바꿈
        document.getElementById("IDPhoto").src = msg.payloadString;
        document.getElementById("chatbox").value += "증명사진 출력 완료\n";
        document.getElementById("chatbox").scrollTop = document.getElementById("chatbox").scrollHeight;
        // download 받을 수 있도록 버튼의 경로를 바꿈
        document.getElementById("download").href = msg.payloadString;
        // 보여지는 거리 값을 초기화
        document.getElementById("distance").innerHTML = "측정 전";
    }
    // 조도 센서 값이 온 경우
    else if (msg.destinationName == "light") {
        // 웹 페이지에서 보여지는 조도 값을 갱신
        document.getElementById("light").innerHTML = msg.payloadString;
        // 조도 값이 낮으면 경고를 출력하고 전구의 그림을 꺼진 전구로 바꿈
        if(parseInt(msg.payloadString)<=10) {
            document.getElementById("light").innerHTML += " (경고:너무 어두움)";
             // 플래그는 전구의 그림을 한번만 바꾸기 위해 있음
            if(lightFlag==false) {
                document.getElementById("lightImage").src = "./static/light2.jpg";
                lightFlag = true;
            }
        }
        // 빛이 정상적으로 돌아오면 다시 밝은 전구로 바꿈
        else if (lightFlag==true) {
            document.getElementById("lightImage").src = "./static/light1.jpg";
            lightFlag = false;
        }

    }
}

// 연결 해제 버튼을 누르면 호출
function startDisconnect() {
    client.disconnect();  
    document.getElementById("chatbox").value += '연결 해제 됨\n';
    document.getElementById("chatbox").scrollTop = document.getElementById("chatbox").scrollHeight;
}

var topicSave;
//촬영 시작 버튼을 누르면 호출
function mySubscribe(topic) {
    if(client == null) return;
    if(isConnected != true) {
        topicSave = topic;
	window.setTimeout("subscribe(topicSave)", 500);
        return
    }

    document.getElementById("chatbox").value += '촬영을 시작합니다.\n';
    document.getElementById("chatbox").scrollTop = document.getElementById("chatbox").scrollHeight;
    client.subscribe(topic); // 초음파 센서 등록
}

// 촬영 중단 버튼을 누르면 호출
function myUnsubscribe(topic) {
    if(client == null || isConnected != true) return;

    document.getElementById("chatbox").value += '촬영을 중단합니다.\n';
    // 다음 번 촬영을 위해 count를 다시 5로 늘리고, led를 끔
    count = 5;
    client.send("led", '0', 0, false);
    client.unsubscribe(topic, null); 
}
