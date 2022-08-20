const socket=io('/');
const videoGrid=document.getElementById('video-grid');
const myPeer=new Peer(undefined,{
    host:'/',
    port:'443'
});
window.peer = myPeer;
//Create Video Element
const myVideo=document.createElement('video');
//Chat icon for small screen size
const showChat = document.querySelector("#showChat");
//Back button on chat window for small screen size
const backBtn = document.querySelector(".header__back");
myVideo.muted=true;


//Show chat window
showChat.addEventListener("click", () => {
  document.querySelector(".main__right").style.display = "flex";
  document.querySelector(".main__right").style.flex = "1";
  document.querySelector(".main__left").style.display = "none";
  document.querySelector(".header__back").style.display = "block";
});

//Hide chat window
backBtn.addEventListener("click", () => {
  document.querySelector(".main__left").style.display = "flex";
  document.querySelector(".main__left").style.flex = "1";
  document.querySelector(".main__right").style.display = "none";
  document.querySelector(".header__back").style.display = "none";
});

//Store peers data
const peers={};
const user = username;
let myVideoStream,myId;

myPeer.on('open',id=>{
  myId=id;
  console.log(id);
  socket.emit("join-room",ROOM_ID,id,user);
});

//Get audio and video
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
    myVideoStream=stream;
    addVideoStream(myVideo,stream);

    myPeer.on('call',call=>{
        call.answer(stream);
        const video=document.createElement('video');
        //Add video stream
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream)
        })
    })

    //Add new user to video call
    socket.on("user-connected",userId=>{
        setTimeout(connectToNewUser,1000,userId,stream)
    })
})

//Remove user from video call
socket.on('user-disconnected',userId=>{
    console.log(userId);
    if(peers[userId]){
      peers[userId].close();
    }
    //else{
      //videoGrid.remove(video);
      //window.location=window.location;
    //}
});

var conn = myPeer.connect(myId)

//Connecting new user handle
function connectToNewUser(userId,stream){
    const call=myPeer.call(userId,stream)
    const video=document.createElement('video')
    //Get new user's stream
    call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream)
    });
    //Remove video stream
    call.on('close',()=>{
        video.remove()
    })
    //Add user data to peers array
    peers[userId]=call;
}

//Adding stream handle
function addVideoStream(video,stream){
    video.srcObject=stream;
    video.addEventListener("loadedmetadata",()=>{
        video.play();
    })
    videoGrid.append(video);
}

//Get text entered in chat window
let text = document.querySelector("#chat_message");
//Send icon
let send = document.getElementById("send");
//Display messages
let messages = document.querySelector(".messages");

//Emit message entered in window
send.addEventListener("click", (e) => {
    if (text.value.length !== 0) {
      socket.emit("message", text.value);
      text.value = "";
    }
  });

text.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && text.value.length !== 0) {
      socket.emit("message", text.value);
      text.value = "";
    }
});

//Invite people icon
const inviteButton = document.querySelector("#inviteButton");
//Mute icon
const muteButton = document.querySelector("#muteButton");
//Pause video icon 
const stopVideo = document.querySelector("#stopVideo");
//Leave Button
const leaveButton = document.querySelector("#leaveButton");


//Mute & unmute my mic
muteButton.addEventListener("click", () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    html = `<i class="fas fa-microphone-slash"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    html = `<i class="fas fa-microphone"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  }
});

//Turn camera on & off
stopVideo.addEventListener("click", () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    html = `<i class="fas fa-video-slash"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    html = `<i class="fas fa-video"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  }
});

//Invite other people to video call
inviteButton.addEventListener("click", (e) => {
  prompt(
    "Send this ID to people you want to meet with",
    ROOM_ID
  );
});

leaveButton.addEventListener("click", (e) => {
  myPeer.destroy();
  videoGrid.remove(myVideo);
});

//Display the message entered by user in chat window
socket.on("createMessage", (message,userName) => {
    messages.innerHTML =
      messages.innerHTML +
      `<div class="message">
          <b><i class="far fa-user-circle"></i> <span>${
            userName === user ? "me" : userName
          }</span> </b>
          <span>${message}</span>
      </div>`;
  });