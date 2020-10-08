/*let video = document.getElementById("video");


if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true}).then(function(stream) {
        video.srcObject = stream;
        video.play();
        let obj = stream.getTracks()[0].getSettings();
        console.log(obj);
    });
}


function fun() {
    const elementType = 1;
    let elements = document.getElementsByClassName("camera-grid")[0].childNodes;
    for(let i = 0; i < elements.length; i++) {
        let elem = elements[i];
        if(elem.nodeType == elementType) {
            elem.style.background = "red";
        }
    }
}*/
