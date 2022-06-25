Authors - Aryan Tyagi, Prakhar 

<img src="aryan.png" alt="drawing" width="400"/> 

<img src="prakhar.png" alt="drawing" width="400"/> 


FOR  BACKGROUND  FUNCTIONALITY,  OPEN THIS WEBSITE IN A SEPARATE WINDOW AND DO WHATEVER YOU WANT AFTER HOVERING ON THE MINIMISED BROWSER ICON THROUGH 

# Welcome to CYSA's documentation
Be sure to check out our app at <link>. Also checkout the [Hands](https://google.github.io/mediapipe/solutions/hands.html) & [FaceMesh](https://google.github.io/mediapipe/solutions/face_mesh.html) model of Mediapipe, an open source framework from Google, the backbone of our app.

# CYSA Details

*Monitoring Screen-on time:- Using the facemesh model of Mediapipe, an open source framework from Google, we intend to track user’s screen time.

*Monitoring screen eye distance:- We nudge the user in some form in case the user comes closer than the minimum recommended screen distance.

	*Implementation*
	We did this by tracking the landmarks of face which is returned by 	the model.
	Let’s say that initially, at an arm’s length distance from screen, 	the bounding box of four corners of face had an area of ‘x’.
	Whenever the user’s face comes closer to the screen, the area 	increases.
	If the area becomes 2.2x the user is notified.

*Using Hands package of MediaPipe, a palm and finger Detection model, we are tracking the fingers of user in real time. If the landmarks of fingers come inside the landmarks of lips of face the user will get a warning sound. *We are also checking the z index returned by the model to make sure that the alarm goes off only if the finger is actually in lip area and not just in 2D*.

# Tech Stack we used
* HTML 5
* CSS
* Vanilla JS
* Node JS
* Express
* MediaPipe Hands, Facemesh Model


## DEVELOPMENT SETUP

*You need Node.js to be installed on your system. You can download Node.js and follow the instructions on how to do that on nodejs.org

*Clone or download this repository

*Open your terminal

*With the command line go to the folder you just cloned/downloaded

*Type ‘node server.js', so your server starts running
Go to the browser and access http://127.0.0.1:3000 / to use the website.



## IN DEPTH CODE DOCUMENTATION

* *finger_tip_landmarks_list* : 


<img src="https://google.github.io/mediapipe/images/mobile/hand_landmarks.png" alt="drawing" width="400"/> 


An array of 5 integers that will be used to obtain 3D coordinates of the tips of all the 5 fingers, the landmarks list is given in the image above.


* *finger_tip_coords* : An array of dictionaries containing 3D floating point coordinates of tips of all fingers. 
        number of elements in finer_tip_coords = (number of hands detected)*5.
* *face_mesh_bbox* : An array containing the landmark points of 4 corners of the face detected. Our motive is to find the area between these landmarks for judging the distance between the screen and face.


<img src="https://miro.medium.com/max/1400/1*gQBBRW-y-h2lTikyY4P9dg.jpeg" alt="drawing" width="400"/>
        
        
        The x, y coordinates are always positive, while, the z coordinate can be negative too.

* *face_mesh_bbox_coords* : An array containing 3D floating point coordinates of the 4 landmarks obtained from *face_mesh_bbox* variable.
        number of elements in face_mesh_bbox_coords = 4.


* *FACEMESH_LIPS* : An array containing the integer landmark points of corners of the LIPS detected. These 4 landmarks out of 468 were obtained by trial and error. The landmarks is in the format [x_start, x_end, y_start, y_end]


* *facesmash_lips_coords* : An array of 4 dictionaries containing the 3D floating point coordinates of 4 lip corner landmarks defined in *FACEMESH_LIPS*. 


* *ideal_area* : The area between 4 corner of face, defined in *face_mesh_bbox*, in the **first frame of webcam feed**, which will be taken as reference for judging if the user is too close to the screen. Value is of float type.


* *threshold_area* : The threshold are calculated is 120% ideal_area;


* *bbox_counter_temp* : A constant for checking the first frame of webcam feed.


* *face_detected* : Variable that is False by default and True when a face is detected in the frame.


* *hand_detected* : Variable that is False by default and True when a hand is detected in the frame.


* *totalSeconds* : Variable with initial value int(0), increments by int(1) every second. Used in calculating on-screen time.


* *var which_finger_inside_quad* : A list of integers either 1 or 0 depending upon if the tip of finger is inside the lip area or not.



## Functions and their description

* **countUpTimer** : Updates *count_up_timer* element of HTML every second by using time logic and nudges the user (in the form of audio) whenever the time becomes multiple of 20 minutes.


* **calcPolygonArea** : Calculating the area of polygon between the vertices passed as an argument.
        Arguments : Array of vertices of Polygon
        Returns : Floating point area of the polygon


* **check_points_in_quadrilateral** : For checking if the tip of the finger is inside the lip region(the landmarks of which is in FACEMESH_LIPS). Logic is to return 1 for the respective finger if its tip is inside quadrilateral formed by the 4 corners of the lips.
        Arguments : quadrilateral_coordinates, finger tip coordinates, number of finger tip coordinates


    For example if your left and right index finger is inside the lip region, *which_finger_inside_quad* will look something like [1, 0, 0, 0, 0, 1, 0, 0, 0, 0].


* **face_mesh_coords_func** : Function which takes results obtained from the MediaPipe model as an argument and updates *facesmash_lips_coords* & *face_mesh_bbox_coords* with their respective values(details already mentioned).
        Arguments : Results of the FaceMesh model of MediaPipe


* **finger_coords_func** : Function that populates the array *finger_tip_coords* depending upon how many hands are in the frame, calls the **check_points_in_quadrilateral** function to check if finger is inside the lip region and then nudges the user accordingly (if 'check on my nail biting habit' is checked).


* **onResults** : For understanding the flow of the website read this-
When a face is detected it will
    * Change *face_detected* to True, call the function **face_mesh_coords_func**
    * Calulate the ideal bounding box area by calling **calcPolygonArea** 
    * Calculates the threshold area valus and checks if (current area) > (threshold area + ideal area)
    * Plays the ping audio and updates HTML file accordingly.
Otherwise
    * Changes face detected tox False


* **onResults1** : Once a hand **and** face is detected, does similar functions to **onResults**.

Between line 274 to 293, the "FaceMesh" and "Hands" models are looaded into *facemesh* and *hands* respectively with certain parameters like minimum Detection confidence (=0.8 used)


* **together** : In this, we are passing **onResults**, **onResults1** in the onResults method of facemesh and hands.
In line 308, window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser calls **together** function to update the video frame before the next frame. The method takes a callback as an argument to be invoked before the repaint.


Code in between line 312 to 333 is to fulfills the purpose of ON/OFF switch for the camera, where OFF refreshes the website and ON asks for the camera permission & starts the on-screen timer.
