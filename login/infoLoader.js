var exhibitionsArr = [];
var worksArr = [];
var spArr = [];
var speakCount = 0;

function getExhibitions(callback) {
        
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                exhibitionsArr = JSON.parse(xmlhttp.responseText);
                console.log(exhibitionsArr);
                if (!!callback) {
                    callback();
                }
            }
        }
        xmlhttp.open("GET","../getexhibitions.php",true);
        xmlhttp.send();
}

function exhibitionsEditor() {
    document.getElementById("exhibition1").innerHTML = '';
    var exOption = [];
    for (var i=0;i<exhibitionsArr.length;i++) {
        exOption[i] = document.createElement('option');
        exOption[i].innerHTML = exhibitionsArr[i].name;
        document.getElementById("exhibition1").appendChild(exOption[i]);
    }
    var newExhibition = document.createElement('option');
    newExhibition.innerHTML = '* NEW *';
    document.getElementById("exhibition1").appendChild(newExhibition);
}

function showAllWorks(str, callback) {

        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                worksArr = JSON.parse(xmlhttp.responseText);
                console.log(worksArr);

                var descStr = '';
                descStr += '<ul>';
                if (!!worksArr[0]) {
                    for (var i=0;i<worksArr.length;i++) {       
                        descStr += '<li onclick="chooseWork('; 
                        descStr += i;
                        descStr += ')"><table><tr><td style="width:40px;">';
                        descStr += '<img class="workImg" src="../'; 
                        descStr += worksArr[i].artwork; 
                        descStr += '"></td><td> ';
                        descStr += worksArr[i].author;
                        descStr += ' : </td><td> ';
                        descStr += worksArr[i].name;
                        descStr += '</td></tr></table></li>';
                    }
                }
                descStr += "<li onclick=\"chooseWork(worksArr.length);\">NEW UPLOAD</li></ul>";

                document.getElementById("worksHere").innerHTML = descStr;
                if (!!callback) {
                    callback();
                }
            }
        }
        xmlhttp.open("GET","../getallworks.php?q="+str,true);
        xmlhttp.send();
}


function chooseExhibition(num) {
    if (num==exhibitionsArr.length) {
        document.getElementById("exName").value = '***NEW***';
        document.getElementById("exIdHidden").value = 'null';
        document.getElementById("oldIcon").value = './images/icon.png';
    } else {
        if (!!document.getElementById("exName")) {document.getElementById("exName").value = exhibitionsArr[num].name;}
        document.getElementById("exCurator").value = exhibitionsArr[num].curator;
        document.getElementById("exDescription").value = exhibitionsArr[num].description;
        document.getElementById("exIconImg").innerHTML = '<img src="../' + exhibitionsArr[num].artwork + '">';

        document.getElementById("oldIcon").value = exhibitionsArr[num].artwork;
         if (!!document.getElementById("exIdHidden")) {document.getElementById("exIdHidden").value = exhibitionsArr[num].id;}

        document.getElementById("exIdWorkHidden").value = exhibitionsArr[num].id;
        //document.getElementById("exTitle").innerHTML = exhibitionsArr[num].name;
        //showAllWorks(num+1);
    }
}

function chooseWork(num) {
    document.getElementById("editEx").style.visibility = 'hidden';
    document.getElementById("editWorks").style.visibility = 'visible';
    document.getElementById("status").innerHTML = '';
    if (num==worksArr.length) {
        document.getElementById("workIdHidden").value = 'null';
        document.getElementById("name").value = 'NEW UPLOAD';
        document.getElementById("description").value = '';
        document.getElementById("year").value = '';
        document.getElementById("place").value = '';
        document.getElementById("workAuthor").value = '';

        document.getElementById("workSubmit").style.display = "block";
        document.getElementById("deleteWorkButton").style.display = "none";
        document.getElementById("workUpdate").style.display = "none";

        document.getElementById("speakerFiles").style.display = "block";
        document.getElementById("videoLoader").style.display = "block";

        document.getElementById("speakers").innerHTML = '';
        spArr = [];
        drawSpeakers();
    } else {
        document.getElementById("name").value = worksArr[num].name;
        document.getElementById("description").value = worksArr[num].description;
        document.getElementById("year").value = worksArr[num].year;
        document.getElementById("place").value = worksArr[num].place;
        document.getElementById("workIdHidden").value = worksArr[num].workId;
        document.getElementById("workAuthor").value = worksArr[num].author;

        document.getElementById("deleteWorkButton").style.display = "block";
        document.getElementById("workSubmit").style.display = "none";
        document.getElementById("workUpdate").style.display = "block";

        document.getElementById("speakerFiles").style.display = "none";
        document.getElementById("videoLoader").style.display = "none";

        document.getElementById("speakers").innerHTML = '';
        showSpeakers(num+1); 
    }
}

function showExEditor() {
    document.getElementById("editWorks").style.visibility = 'hidden';
    document.getElementById("editEx").style.visibility = 'visible';
}


function showSpeakers(str) {
    if (str == "") {
        document.getElementById("description").innerHTML = "";
        return;
    } else { 
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                spArr = JSON.parse(xmlhttp.responseText); 
                drawSpeakers();
            }
        }
        xmlhttp.open("GET","../getdata.php?q="+worksArr[str-1].workId,true);
        xmlhttp.send();
    }
}



function drawSpeakers() {
    ctx.clearRect(0,0,400,400);
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(0,0,400,400);
    ctx.font = "17px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.fillText("front",180,16);
    ctx.fillText("back",180,395);


    ctx.beginPath();
    ctx.arc(200, 200, 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
    ctx.closePath();

    var x1,y1=0;
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';
    
    readSpeakers();
    for (var i=1;i<speakCount;i++) {
        ctx.save();

        x1 = 200-spArr[i].x;
        y1 = 200-(-spArr[i].z);
        ctx.translate(x1, y1);
        ctx.fillText(i,-5,6);
        ctx.rotate(Math.atan2(-spArr[i].z, spArr[i].x));
        ctx.strokeRect(-spArr[i].y/2,-spArr[i].y/2,spArr[i].y,spArr[i].y);
        ctx.restore();

        document.getElementById("x_"+i).value = spArr[i].x;
        document.getElementById("y_"+i).value = spArr[i].y;
        document.getElementById("z_"+i).value = spArr[i].z;
    }
}

function redrawSp() {
    ctx.clearRect(0,0,400,400);
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(0,0,400,400);
    ctx.fillStyle = '#ffffff';
    ctx.fillText("front",180,16);
    ctx.fillText("back",180,395);

    ctx.beginPath();
    ctx.arc(200, 200, 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
    ctx.closePath();

    var x1,y1,z1=0;
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';

    for (var i=1;i<speakCount;i++) {
        ctx.save();
        x1 = 200-document.getElementById("x_"+i).value;
        y1 = 200-(-document.getElementById("z_"+i).value);
        z1 = document.getElementById("y_"+i).value;
        ctx.translate(x1, y1);
        ctx.fillText(i,-5,6);
        ctx.rotate(Math.atan2(-document.getElementById("z_"+i).value, document.getElementById("x_"+i).value));
        ctx.strokeRect(-z1/2,-z1/2,z1,z1);
        ctx.restore();
    }
}


//DATA VALIDATION AND FORMATiNG
function replaceAll(str) {
    return str.replace(new RegExp(escapeRegExp('\''), 'g'), "\\'");
}

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function validateExForm() {

}

function validateWorkForm() {
    if (document.getElementById("name").value!='NEW UPLOAD') {
        return true;
    } else {
        document.getElementById("status").innerHTML = "change work name";
        return false;
    }
}

function readImage(file) {

    var reader = new FileReader();
    var image  = new Image();

    reader.readAsDataURL(file);  
    reader.onload = function(_file) {
        image.src    = _file.target.result;              // url.createObjectURL(file);
        image.onload = function() {
            var w = this.width,
                h = this.height,
                t = file.type,                           // ext only: // file.type.split('/')[1],
                n = file.name,
                s = ~~(file.size/1024) +'KB';
                if (w>150 && h>150) {
                    document.getElementById("status").innerHTML = 'Please choose the image at 150x150px resolution.';
                    document.getElementById("artwork").value = '';
                }
        };  
    };
}

function readAudio() {
    var audioFiles = document.getElementById("speakerFiles").files;
    var speakHTML = '<table>';
    for (i=1;i<audioFiles.length+1;i++) {
        speakHTML += '<tr><td>' + audioFiles[i-1].name;
        speakHTML += '</td><td><input name="x_' + i + '" id="x_' + i + '"type="number" required style="width:50px;" onchange="redrawSp();">';
        speakHTML += '<input name="y_' + i + '" id="y_' + i + '" type="number" required style="width:50px;" onchange="redrawSp();">';
        speakHTML += '<input name="z_' + i + '" id="z_' + i + '" type="number" required style="width:50px;" onchange="redrawSp();">';
        speakHTML += '</td></tr>';
    }
    speakHTML += '</table>';
    document.getElementById("speakers").innerHTML = speakHTML;
    speakCount = audioFiles.length+1;
};

function readSpeakers() {
    var speakHTML = '<table width="100%">';
    for (i=1;i<spArr.length;i++) {
        speakHTML += '<tr><td>' + formatFilename(spArr[i].filename);
        speakHTML += '</td><td><input name="x_' + i + '" id="x_' + i + '"type="number" required style="width:50px;" onchange="redrawSp();"> ';
        speakHTML += '<input name="y_' + i + '" id="y_' + i + '" type="number" required style="width:50px;" onchange="redrawSp();"> ';
        speakHTML += '<input name="z_' + i + '" id="z_' + i + '" type="number" required style="width:50px;" onchange="redrawSp();">';
        speakHTML += '</td></tr>';
    }
    speakHTML += '</table>';
    document.getElementById("speakers").innerHTML = speakHTML;
    speakCount = spArr.length;
};


function showWorkLoader(num) {
    if (num==1) {
        document.getElementById("workFiles").style.display = "none";
        document.getElementById("workInfo").style.display = "block";
    } else {
        document.getElementById("workFiles").style.display = "block";
        document.getElementById("workInfo").style.display = "none";
    }   
}

function formatFilename(str) {
    return str.slice(str.lastIndexOf('/')+1);
}