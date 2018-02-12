var workResponce = [];
var exhibitionsArr = [];
var descStr   = '';  //Exhibitions HTML string
var exDescStr = ''; 

var worksArr = [];
var spArr = [];
var pageLoadingIm = new Image(32,32);
pageLoadingIm.src = "./images/ajax-loader.gif";
var pageLoader = '<img src="./images/ajax-loader.gif" align="center">';
var loadedMedia  = 0;
var mediaElementsCount = 0;
var canPlayIt = false;

function isMobile() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
}

function exDescript(str) {
	exDescStr = '<img align="left" style="margin:0 10px 0 0;" src="';
	exDescStr += exhibitionsArr[str].artwork + '">'; 
	exDescStr += '<h3 style="margin:0 0 0 0;padding:0;">' + exhibitionsArr[str].name + '</h3>';
	exDescStr += '<p style="margin:15px 0 0 0;">'; 
	exDescStr += exhibitionsArr[str].description;
	exDescStr += '<br/><br/> Curator: '+ exhibitionsArr[str].curator +'</p>';
	document.getElementById('exDescr').innerHTML = exDescStr;
	//document.getElementById('exNav').innerHTML=' &nbsp;::&nbsp; <span style="text-transform:uppercase;">' + exhibitionsArr[str].name + '</span>';
}

function workDescript(str) {
	var workDescriptStr = '<img align="left" style="margin:0 10px 0 0;" src="'; 
		workDescriptStr += worksArr[str].artwork;
		workDescriptStr += '"><p style="margin:0 0 0 0;font-size:1.2em;">';
		workDescriptStr += '<b>"' + worksArr[str].name;
		workDescriptStr += '"</b><i> by ' + worksArr[str].author + '</i></p><p>';
		workDescriptStr += worksArr[str].description;
		workDescriptStr += '</p>';
	document.getElementById('exDescr').innerHTML = workDescriptStr;
	//document.getElementById('workNav').innerHTML = ' &nbsp;::&nbsp; <span style="text-transform:uppercase;">' + worksArr[str].name + '</span><i> by ' + worksArr[str].author + '</i>';
}

function hideText() {
	document.getElementById('exDescr').innerHTML = '';
	//document.getElementById('exNav').innerHTML   = '';
	//document.getElementById('workNav').innerHTML = '';
}

function hideWorkText() {
	document.getElementById('exDescr').innerHTML = exDescStr;
	//document.getElementById('workNav').innerHTML = '';
}

function hideAll() {
	document.getElementById("container").style.visibility = "hidden";
	//document.getElementById("description").style.visibility = "hidden";
}

function getExhibitions() {
		
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (! isMobile()) {
        	xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				exhibitionsArr = JSON.parse(xmlhttp.responseText);
				descStr += '<table cellpadding="0" cellspacing="30" align="center" style="margin-top:0px;verical-align:top;"><tr>';
				for (var i=0;i<exhibitionsArr.length;i++) {
					descStr += '<td align="center" style="width:200px;verical-align:top;cursor:pointer;text-transform: uppercase;" onclick = "showAllWorks(';
					descStr += exhibitionsArr[i].id; 
					descStr += ')" onmouseover = \"exDescript('; 
					descStr += exhibitionsArr[i].id-1;
					descStr += ')\"';
					descStr += 'onmouseout = "hideText();">'; 
					descStr += '<img style="width:64px;height:64px;" src="'; 
					descStr += exhibitionsArr[i].artwork; 
					descStr += '"><br>';
					descStr += exhibitionsArr[i].name; 
					descStr += '</td>';				
				}
				descStr += "</tr></table>";
				document.getElementById("post").innerHTML = descStr;
            }
	        }
        } else {
        	xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				exhibitionsArr = JSON.parse(xmlhttp.responseText);
				descStr += '<div style="text-align:center;verical-align:top;"><table style="text-align:center;font-size:1em;vertical-align:top;"><tr>';
				for (var i=0;i<exhibitionsArr.length;i++) {		
					descStr += '<td style="width:20%;text-align:center;vertical-align:top;"  onclick = "showAllWorks(';
					descStr += exhibitionsArr[i].id;
					descStr += ')">';
					descStr += '<img class="workMobileImg" src="'; 
					descStr += exhibitionsArr[i].artwork; 
					descStr += '"></br>';
					descStr += exhibitionsArr[i].name;
					descStr += '</td>';
				}
				descStr += "</tr></table></div>";
				document.getElementById("post").innerHTML = descStr;
            }
	        }
        }
        
        xmlhttp.open("GET","getexhibitions.php",true);
        xmlhttp.send();
}

function showExhibitions() {
	document.getElementById("post").style.backgroundColor = "transparent";
	document.getElementById('exDescr').innerHTML = '';
	document.getElementById("post").innerHTML = descStr;
	document.getElementById("container").style.visibility="visible";
	document.getElementById("instructions").style.visibility = "hidden";
	document.getElementById("description").style.visibility = "hidden";

	document.getElementById("aboutVSG").style.visibility = "hidden";
}

function showAllWorks(str) {
	document.getElementById("instructions").style.visibility = "hidden";
	document.getElementById("description").style.visibility = "hidden";

	exDescript(exhibitionsArr[str-1].id-1);
	//document.getElementById('exNav').innerHTML=' &nbsp;::&nbsp; <span style="text-transform:uppercase;">' + exhibitionsArr[str-1].name + '</span>';
	
	document.getElementById("post").innerHTML = '<br><br><br>' + pageLoader;

        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (! isMobile()) {
	        xmlhttp.onreadystatechange = function() {
	            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					worksArr = JSON.parse(xmlhttp.responseText);
					var descStr = '';
					if (!!worksArr[0]) {
						descStr += '<div onmouseout = "hideWorkText();" class="worksMenu"><ul>';
						for (var i=0;i<worksArr.length;i++) {		
							descStr += '<li onclick = "showWork(';
							descStr += i; 
							descStr += ')" onmouseover = \"workDescript('; 
							descStr += i;
							descStr += ')\"><table style="padding:0;margin:0;width:100%;height:100%;"><tr><td style="width:40px;">';
							descStr += '<img class="workImg" src="'; 
							descStr += worksArr[i].artwork; 
							descStr += '"></td><td style="width:140px">';
							descStr += worksArr[i].author;
							descStr += ' </td><td>';
							descStr += worksArr[i].name;
							descStr += '</td></tr></table></li>';
						}
						descStr += "</ul></div>";
	                    //callback()
					} else {document.getElementById("post").innerHTML = 'No works loaded yet. Please come back later.';}
					
					document.getElementById("post").innerHTML = descStr;
					//document.getElementById("post").style.backgroundColor = "rgba(0,0,0,0.5)";
	            }
	        }
	    } else {
	    	xmlhttp.onreadystatechange = function() {
	            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					worksArr = JSON.parse(xmlhttp.responseText);
					var descStr = '';
					if (!!worksArr[0]) {
						descStr += '<div style="position:absolute;text-align:center;verical-align:top;"><table style="table-layout: fixed;width:100%;text-align:center;font-size:1em;vertical-align:top;"><tr>';
						for (var i=0;i<worksArr.length;i++) {		
							descStr += '<td style="width:22vw;text-align:center;vertical-align:top;" onclick = "showWork(';
							descStr += i; 
							descStr += ')"'; 
							descStr += i;
							descStr += ')\">';
							descStr += '<img class="workMobileImg" src="'; 
							descStr += worksArr[i].artwork; 
							descStr += '"><br>';
							descStr += worksArr[i].author;
							descStr += '<br>';
							descStr += worksArr[i].name;
							descStr += '</td>';
						}
						descStr += "</tr></table></div>";
	                    //callback()
					} else {document.getElementById("post").innerHTML = 'No works loaded yet. Please come back later.';}
					
					document.getElementById("post").innerHTML = descStr;
					//document.getElementById("post").style.backgroundColor = "rgba(0,0,0,0.5)";
	            }
	        }
	    }   
        xmlhttp.open("GET","getallworks.php?q="+str,true);
        xmlhttp.send();
}

function showWork(stri) {
	//document.getElementById('workNav').innerHTML = ' &nbsp;::&nbsp; <span style="text-transform:uppercase;">' + worksArr[stri].name + '</span><i> by ' + worksArr[stri].author + '</i>';
	document.getElementById("description").style.visibility = "visible";
	document.getElementById("instructions").style.visibility = "visible";
	document.getElementById("author").innerHTML = pageLoader;
	document.getElementById("work").innerHTML = '';
	hideAll();

	if (! isMobile()) {
		document.getElementById("descriptionName").innerHTML = worksArr[stri].author + ' "' + worksArr[stri].name + '"';
		document.getElementById("descript").innerHTML = worksArr[stri].description;
		document.getElementById("year").innerHTML = worksArr[stri].year;
		document.getElementById("place").innerHTML = worksArr[stri].place;
		document.getElementById("loading").innerHTML = '';
	}
	if (canPlayIt) {
		canPlayIt = false;
		document.getElementById('instructions').removeEventListener('click',clickToPlay,false);
	}
	showSpeakers(worksArr[stri].workId, stri);
}

function showSpeakers(str, nameStr) {
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

				document.getElementById("loading").innerHTML = pageLoader;
				mediaElementsCount = spArr.length - 1;
				LFOgain.gain.value = LFOgain.gain.value / (spArr.length - 0.99);
				loadWork();

				if (worksArr[nameStr].video !== '0' && ! isMobile()) {
					addVideo(worksArr[nameStr].video);
					mediaElementsCount++;
				}
				
				document.getElementById("author").innerHTML = worksArr[nameStr].author;
				document.getElementById("work").innerHTML = worksArr[nameStr].name;
				
            }
        }
        xmlhttp.open("GET","getdata.php?q="+str,true);
        xmlhttp.send();
    }
}

var saveAboutState = 0;
function showAboutVSG() {
	document.getElementById("aboutVSG").style.visibility = "visible";

	document.getElementById("container").style.visibility = "hidden";
	saveAboutState = 1;
	if (document.getElementById("description").style.visibility == "visible") {
		document.getElementById("description").style.visibility = "hidden";
		document.getElementById("instructions").style.visibility = "hidden";
		saveAboutState = 2;
	}
}

function closeAboutVSG() {
	document.getElementById("aboutVSG").style.visibility = "hidden";
	
	if (saveAboutState == 1) {
		document.getElementById("container").style.visibility = "visible";
	} else if (saveAboutState == 2) {
		document.getElementById("instructions").style.visibility = "visible";
		document.getElementById("description").style.visibility = "visible";
	}
}

function closePost() {
	document.getElementById("container").style.visibility="hidden";
	document.getElementById("instructions").style.visibility = "visible";
	document.getElementById("description").style.visibility = "visible";
}
