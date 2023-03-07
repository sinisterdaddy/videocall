let localVideo = document.getElementById("local-video")
let remoteVideo = document.getElementById("remote-video")

localVideo.style.opacity = 0
remoteVideo.style.opacity = 0

localVideo.onplaying = () => { localVideo.style.opacity = 1 }
remoteVideo.onplaying = () => { remoteVideo.style.opacity = 1 }

let peer
function init(userId) {
    peer = new Peer(userId, {
        host: '192.168.82.42',  //ip
        port: 8000,
        path: '/videocallapp'
    })

    listen()
}

let localStream
function listen() {
    peer.on('call', (call) => {
//get video from local machine then attach to call object and then answer the call
        navigator.getUserMedia({
            audio: true,
            video: true
        }, (stream) => {    //  call back function to receive the stream thwn show it in stream 
            localVideo.srcObject = stream
            localStream = stream

            call.answer(stream)  // to answer and peerjs lib will sent to user trying to answer
            call.on('stream', (remoteStream) => {
                remoteVideo.srcObject = remoteStream

                remoteVideo.className = "primary-video"    //when call is not conctd primry vid = lcl vid$ whn cnnctd we need to switch
                localVideo.className = "secondary-video"

            })

        })

    })
}
//for calling
function startCall(otherUserId) {      //othruser id is whom u want to call
    navigator.getUserMedia({       //get local stream from device
        audio: true,
        video: true
    }, (stream) => {

        localVideo.srcObject = stream //once we have local stream we play
        localStream = stream

        const call = peer.call(otherUserId, stream)   // to call we just need to refer 
        call.on('stream', (remoteStream) => {   //once it accepts the strea after acceptiing we need to play in local video
            remoteVideo.srcObject = remoteStream

            remoteVideo.className = "primary-video"
            localVideo.className = "secondary-video"
        })

    })
}

function toggleVideo(b) {   //b is boolean if true then well play the vid else not
    // will call this in android kotlin code through that this b will be a string 
    if (b == "true") {
        localStream.getVideoTracks()[0].enabled = true    // will return array of all the video stream it is playing 
    } else {
        localStream.getVideoTracks()[0].enabled = false
    }
}

function toggleAudio(b) {
    if (b == "true") {
        localStream.getAudioTracks()[0].enabled = true
    } else {
        localStream.getAudioTracks()[0].enabled = false
    }
} 