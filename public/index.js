var count_temp=0;
onblur = function() {
  setTimeout('self.focus()',1);
  }

//prakhar's code
var switch_1 = false;
var switch_2 = false;
document.getElementsByClassName("switch1")[0].addEventListener("click",function(){
  if(switch_1==false)
  switch_1=true;
  else
  switch_1=false;
})

document.getElementsByClassName("switch2")[0].addEventListener("click",function(){
  if(switch_2==false)
  switch_2=true;
  else
  switch_2=false;
})


document.getElementById("i_button").addEventListener('mouseover',function(){
  document.getElementById("glass").style.visibility="visible";
})

document.getElementById("i_button").addEventListener('mouseout',function(){
  document.getElementById("glass").style.visibility="hidden";
})

// FOR LIGHT MODE



document.getElementById("color_button").addEventListener('click',function(){
// console.log('hello');
document.body.classList.toggle("light-mode");
// document.getElementsByClassName("cursor")[0].classList.toggle("cursor-light-mode");
document.getElementsByTagName("*")[0].classList.toggle("cursor-blue");
document.getElementsByTagName("*")[0].classList.toggle("cursor-yellow");

if(document.getElementsByTagName("*")[0].classList.contains("cursor-blue"))
{
  document.getElementsByClassName("moon")[0].src="sun.png";
}
else
{
    document.getElementsByClassName("moon")[0].src="moon.png";
}
})


// ARYAN's code
//looping audio with 0 volume to keep this tab in focus, else chaning tabs will stop the audio
var audio = document.getElementById('notif_audio');


// landmarks of the tips of fingers
finger_tip_landmarks_list = [8, 12, 16, 20, 4];
finger_tip_coords = []

// for the bounding box of the face for area calculation
face_mesh_bbox = [10, 454, 152, 234];
face_mesh_bbox_coords = []

// the lips landmarks
FACEMESH_LIPS = [61, 291, 0, 17]; // [x_start, x_end, y_start, y_end]
facesmash_lips_coords = []

//one arm distance area of bounding box of face
var ideal_area;
//var threshold_area = 0.02;
var bbox_counter_temp = 0;


var face_detected = false;
var hand_detected = false;


var startapp=false;
var count = 0;

//for count-up timer
// var timerVariable = setInterval(countUpTimer, 1000);
var totalSeconds = 0;

function countUpTimer() {
  ++totalSeconds;
  var hour = Math.floor(totalSeconds / 3600);
  var minute = Math.floor((totalSeconds - hour * 3600) / 60);
  var seconds = totalSeconds - (hour * 3600 + minute * 60);
  document.getElementById("count_up_timer").innerHTML = hour + ":" + minute + ":" + seconds;

  // accroding to the 20-20-20 rule after 20 minutes look at something 20 feet away for 20 seconds.
  if(totalSeconds % (20*60) == 0)
  {
    audio.play();
  }

  if(totalSeconds >= 15)
    document.getElementById("loading_circle").classList.add('removed');
  
  if(totalSeconds == 15)
    document.getElementsByClassName("ready")[0].classList.remove('removed');
  
  if(totalSeconds == 17)
    document.getElementsByClassName("ready")[0].classList.add('removed');

}


// calculating area of polygon given the vertices
function calcPolygonArea(v) {
  var total = 0;

  for (var i = 0, l = v.length; i < l; i++) {
    var x = v[i].x;
    var y = v[i == v.length - 1 ? 0 : i + 1].y;
    var sub_X = v[i == v.length - 1 ? 0 : i + 1].x;
    var sub_Y = v[i].y;

    total += (x * y * 0.5);
    total -= (sub_X * sub_Y * 0.5);
  }

  return Math.abs(total);
}

var which_finger_inside_quad = [0,0,0,0,0, 0, 0, 0, 0, 0];
function check_points_in_quadrilateral(quadrilateral, points, number_of_points)
{
  var finger_in_mouth_bool = false;
  for(i=0; i<number_of_points; i++)
  {
    //console.log();
    // points [{x:0.2, y:0.4, z:0.4}]
    try
    {
        if(((points[i]['x']>= quadrilateral[0]['x']) && (points[i]['x']<= quadrilateral[1]['x'])) && ((points[i]['y']>= quadrilateral[2]['y']) && (points[i]['y']<= quadrilateral[3]['y'])) && Math.abs(Math.abs(points[i]['z']) - Math.abs(quadrilateral[1]['z']))<=0.03)
        {
            which_finger_inside_quad[i] = 1;
        }
        else
        {
            which_finger_inside_quad[i] = 0;
        }
      }
      catch(err) {
        console.log(err.message);
      }
  }

  if(which_finger_inside_quad.reduce((a,b) => a+b, 0) > 0)
  {
    which_finger_inside_quad = [0,0,0,0,0, 0, 0, 0, 0, 0];
    return true;
  }

}

function face_mesh_coords_func(results)
{
  facesmash_lips_coords = []
  for(i = 0; i<4; i++)
  {
    facesmash_lips_coords.push(results.multiFaceLandmarks[0][FACEMESH_LIPS[i]]);
  }

  // for the bounding box of the face for area calculation
  face_mesh_bbox_coords = []
  for(i = 0; i<4; i++)
  {
    face_mesh_bbox_coords.push(results.multiFaceLandmarks[0][face_mesh_bbox[i]]);
  }

  //console.log(facesmash_lips_coords);
}

function finger_in_mouth(results) //finger_tip_landmarks : [{x:___, y:___, x:___},...] for all 21 landmarks
{
  var temp;

  finger_tip_coords = []

  for (i = 0; i<5; i++) //for first hand
  {
    finger_tip_coords.push(results.multiHandLandmarks[0][finger_tip_landmarks_list[i]]);
  }
  for (i = 0; i<5; i++) //for second hand
  {
    if(results.multiHandLandmarks.length > 1)
      finger_tip_coords.push(results.multiHandLandmarks[1][finger_tip_landmarks_list[i]]);
  }

  // if(check_point_in_quadrilateral(facesmash_lips_coords, finger_tip_coords, 4))
  // {
  // }
  //console.log(finger_tip_coords);
  temp = check_points_in_quadrilateral(facesmash_lips_coords, finger_tip_coords, results.multiHandLandmarks.length*5);

  console.log(hand_detected);

  if(temp == true)
  {
      //prakhar nail biting
      if(switch_2==true && hand_detected == true && face_detected == true)
      {
        audio.volume = 1;
        audio.play();
        count_temp++;
        console.log(count_temp);
        document.getElementsByClassName('status_2')[0].innerHTML="DETECTED!";
      }
  }
  else
  {
    document.getElementsByClassName('status_2')[0].innerHTML="Not detected";
  }
}


const videoElement = document.getElementsByClassName('input_video')[0];

var close_to_screen = false;

function onResults(results)
{
  if (results.multiFaceLandmarks.length != 0)
  {
    face_detected = true;
    face_mesh_coords_func(results);

    if (bbox_counter_temp == 0)   // first frame bbox area will be taken as ideal area
    {
      ideal_area = (calcPolygonArea(face_mesh_bbox_coords));
      console.log((calcPolygonArea(face_mesh_bbox_coords)));
    }

    bbox_counter_temp = 1;

    threshold_area = 1.2 * ideal_area;
    // if face is close to the screen then area value becomes greater than threshold_area + ideal_area
    if(calcPolygonArea(face_mesh_bbox_coords) > threshold_area + ideal_area)
    {
        //prakhar safe distance
      if(switch_1==true && face_detected == true)
      {
        audio.volume = 1;
        audio.play();
        count_temp++;
        console.log(count_temp);
        document.getElementsByClassName('status_1')[0].innerHTML="Unsafe!";
      }
      //console.log("very close to the screen");
    }
    else
    {
      document.getElementsByClassName('status_1')[0].innerHTML="Safe";
    }
  }

  else
  {
    face_detected = false;
  }
}

function onResults1(results)
{
  if ((results.multiHandLandmarks.length != 0) && (face_detected == true))
  {
    hand_detected = true;
    finger_in_mouth(results);
  }
  else
  {
    document.getElementsByClassName('status_2')[0].innerHTML="Not detected";
    hand_detected = false;
  }
}

//open-source code taken from mediapipe website
const faceMesh = new FaceMesh({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
}});
faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.8,
  minTrackingConfidence: 0.85
});

//open-source code taken from mediapipe website
const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.8,
  minTrackingConfidence: 0.8
});

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceMesh.send({image: videoElement});
    await hands.send({image: videoElement});
  },
});

function together()
{
  faceMesh.onResults(onResults);
  hands.onResults(onResults1);


  window.requestAnimationFrame(together);
}


document.getElementsByClassName("switch0")[0].addEventListener("click",function(){

  if(startapp==false)
  {
    startapp=true;
  }
  else
  {
    startapp=false;
  }
  if(startapp==true)
  {
    document.getElementById("loading_circle").classList.remove('removed');
    document.getElementsByClassName("ready")[0].classList.add('removed');
    setInterval(countUpTimer, 1000);
    count++;
    
    camera.start();
  }
  else if(startapp==false && count!=0)
  {
    location.reload();
  }

})

together();

//</script>
