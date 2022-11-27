import io
import time
import picamera
from PIL import Image
import os
import cv2; import numpy as np
fileName = ""

camera = picamera.PiCamera(resolution=(320, 240), framerate=15)
camera.start_preview()
stream = io.BytesIO()
stream.seek(0)	

def takePicture():
	stream.seek(0)
	stream.truncate()
	camera.capture(stream, format='jpeg', use_video_port=True)
	stream.seek(0)
	return stream.read()

def cv_takePicture() :
        global fileName, stream, camera

        if len(fileName) != 0:
                os.unlink(fileName)

        stream.seek(0)
        stream.truncate()
        camera.capture(stream, format='jpeg', use_video_port=True)
        data = np.frombuffer(stream.getvalue(), dtype=np.uint8)
        image = cv2.imdecode(data, 1)
        haar = cv2.CascadeClassifier('./haarCascades/haar-cascade-files-master/haarcascade_frontalface_default.xml')
        image_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = haar.detectMultiScale(image_gray,1.1,3)
        for x, y, w, h in faces:
                src = image.copy()
                dst = src[(y-40):(y+h+40), (x-20):(x+w+20)]

        takeTime = time.time()
        fileName = "./static/%d.jpg" % (takeTime * 10)
        cv2.imwrite(fileName, dst)
        return fileName

if(__name__ == '__main__'):
	count = 0
	while(True):
		a = takePicture()
		b = io.BytesIO(a)
		image = Image.open(b)
		fname = './data/a%03d.jpg' % count
		image.save(fname)
		print(fname)
		count += 1
		pass

