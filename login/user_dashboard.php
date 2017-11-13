<?php
session_start();
if (!!$_SESSION['user_name']===false) {
	header("Location:index.php");
}
?>
<!doctype HTML>
<html>
<head>
<style type="text/css">
	html, body {
		width: 100%;
		height:100%;
		margin:0;
		padding: 0;
		color: #ffffff;
		font-family: arial;
		background-image: radial-gradient(ellipse farthest-corner at 50% 50% , #555 -30%, #000000);
		background-repeat: none;
	}
	a {
	font-family: arial;
	color: #ffffff;
	text-decoration: underline;
	}

a:visited {
	font-family: arial;
	color: #ffffff;
	text-decoration: underline;
}

a:hover {
	font-family: arial;
	color: #aaaaaa;
	text-decoration: underline;
}
header {
}
#container {
	position: relative;
	margin: 0 auto;
	width: 994px;
}
#page {
	position: relative;
	padding: 30px;
	width:880px;
	height: 600px;
}
#wrapper {
	position: relative;
	height:800px;
	border-radius: 30px;
	width: 994px;
	background-color: #555555;
}

#editWorks {
	position: absolute;
	width: 100%;
	visibility: hidden;
	height:650px;
}
#editEx {
	position: absolute;
	width: 100%;
	margin: 0;
	visibility: visible;
	height:450px;
}

#exFormContainer {
	position: relative;
	left: 0;
	top: 0;
	width: 50%;
	}
#worksHere {
	position: absolute;
	right: 0;
	top: 60px;
	width: 50%;
	height: 500px;
	overflow-y: scroll;
}
	
#worksHere ul {
	margin:0;
	padding-left: 0;
	width:100%;
	cursor:pointer;
	text-align: left;
	list-style-type: none;
}
#worksHere ul li {
	padding-bottom:4px;
	padding-top: 4px;
	vertical-align: middle;
}
#worksHere ul li:hover {
	background-color: #777;
}
.workImg {
	width:32px;
	height:32px;
	vertical-align:middle;
}

#status {
	position: relative;
	margin: 0 30px;
}


/*Load work layers*/
#workInfo {
	display: block;
	width: 510px;
	height:100%;
	background-color: #556677;
	padding:10px;
}
#workFiles {
	display: none;
	width: 510px;
	height:100%;
	background-color: #776655;
	min-height: 400px;
	padding:10px;
}

/*Buttons*/
#deleteWorkButton {
	border-radius: 5px;
	border-color: #000000;
	background-color: #ff0000;
	color: #ffffff;
}
#workSubmit {
	border-radius: 5px;
	border-color: #000000;
	background-color: #005500;
	color: #ffffff;
}
#speakerFiles {

}
</style>
<script type="text/javascript" src="infoLoader.js"></script>
</head>
<body>

<div id="container">
<span style="letter-spacing:17px;margin-right:-18px;font-size:50px;">VIRTUAL SOUND GALLERY</span>
<header>
<?php
if($_SESSION["user_name"]) {
?>
Welcome, <?php echo $_SESSION["user_name"]; ?>! Click here to <a href="logout.php" tite="Logout">Logout.</a>
<?php
}
?>
</header>

<div id="wrapper">
<div id="page">
<div id="editEx">
<h3>Edit Exhibition</h3>
<div id="exFormContainer">

<?php
if($_SESSION["user_rights"]==1) {
echo "Users: <br><select onclick=\"chooseUser(this.options.selectedIndex)\">";
$con = mysqli_connect('localhost','login','password','vsg_database');
	if (!$con) {
		die('Could not connect: ' . mysqli_error($con));
	}
$sql="SELECT * FROM users";
if ($result = mysqli_query($con,$sql)) {
$row = mysqli_fetch_array($result, MYSQLI_ASSOC);
$rows = array();
do {
	echo "<option>" .$row["user_name"]. "</option>";
	$rows[] = $row;
} while($row = mysqli_fetch_assoc($result));
}
echo "<option>*new user*</option></select>";

echo "
<form id=\"formUsers\" method=\"post\" enctype=\"multipart/form-data\" name=\"formUsers\">
 <input type=\"submit\" name=\"submit\" value=\"delete user\"><br>
Username:<br>
<input type=\"text\" name=\"userName\" id=\"userName\"><br>
Password:<br>
<input type=\"password\" name=\"password\"><br>
Email:<br>
<input type=\"mail\" name=\"email\" id=\"userEmail\"><br>
Role:<br>
<select id=\"userRole\">
<option>Owner</option>
<option>Curator</option>
<option>Author</option>
<option>User</option>
</select>
Used <span id=\"userTrafficUsed\"></span> / of <input type=\"number\" id=\"userTrafficLimit\"> limit. <br><br>
<input type=\"submit\" name=\"submit\" value=\"SAVE user data\" align=\"right\">
</form><hr>";
echo "<form id=\"form2\" method=\"post\" enctype=\"multipart/form-data\" name=\"form2\">
Exhibitions:<br><select id=\"exhibition1\" name=\"exhibition\" onchange=\"chooseExhibition(this.options.selectedIndex);showAllWorks(exhibitionsArr[this.options.selectedIndex].id);\">
</select> <input name=\"exedit\" type=\"submit\" value=\"delete\"> <br>
Curator<br>
<input type=\"text\" id=\"exCurator\" name=\"curator\"><br>
Title:<br> 
<input id=\"exName\" name=\"name\" type=\"text\">  <br><br>
<input type=\"hidden\" name=\"id\" id=\"exIdHidden\">";
} else if($_SESSION["user_rights"]==2) {

	echo "<h3 id=\"exTitle\"> &nbsp; </h3>
	<form id=\"form2\" method=\"post\" enctype=\"multipart/form-data\" name=\"form2\">
	Curator<br>
<input type=\"text\" id=\"exCurator\" name=\"curator\"><br>
<input type=\"hidden\" name=\"name\" id=\"exName\">"; 
}
?>

<span id="exIconImg"></span>
New icon (*.png / *.jpg, 150x150px):<br> <input id="exIcon" name="icon" type="file" accept="image/png, image/jpeg"> <br><br>
Description:<br> 
<textarea id="exDescription" name="description" cols="60" rows="8"></textarea>  <br><br>
<input name="exedit" type="submit" value="SAVE">
<input type="hidden" name="oldIcon" id="oldIcon" value="./images/icon.png">
</form>

</div>

<div id="worksHere">
</div>

<br>


</div>



<div id="editWorks">
<table style="width:100%;margin:0;padding:0;"><tr>
<td align="left">
	<h2>Edit multichannel work</h2></td>
<td align="right">
	<h2 onclick="showExEditor();" style="cursor:pointer;"><- back</h2>
</td>
</tr></table>

<div style="position:relative;width:100%;">

<div style="width:530px;position:absolute;top:0;left:0;margin:0;padding:0;">
<table style="margin:0 0;padding:0;width:100%;border:0;border-spacing:0"><tr>
	<td onclick="showWorkLoader(1);" style="background-color:#556677;cursor:pointer;width:50%;text-align:center;">Edit Info</td>
	<td onclick="showWorkLoader(2);" style="background-color:#776655;cursor:pointer;width:50%;text-align:center;">Upload files</td></tr>
</table>
<form id="form1" method="post" enctype="multipart/form-data" name="form1">
<div id="workInfo">
	<input value="delete" type="button" id="deleteWorkButton"><br>
	Author:<br> <input id="workAuthor" name="author" type="text" required maxlength="50"> <br><br>
	Work name:<br> <input id="name" name="name" type="text" required maxlength="50"> <br><br>
	Artwork (*.png / *.jpg, 150x150px):<br> <input id="artwork" name="artwork" type="file" accept="image/png, image/jpeg" onchange="readImage(this.files[0]);"> <br><br>
	Description:<br> <textarea id="description" name="description" type="text" required cols="60" rows="4" maxlength="500"></textarea>  <br><br>
	Year:<br> <input id="year" name="year" type="text"> <br><br>
	Place:<br> <input id="place" name="place" type="text" maxlength="300"> <br><br>
	<input type="hidden" name="id" id="workIdHidden">
	<input type="hidden" name="exhibition" id="exIdWorkHidden">
</div>
<div id="workFiles">
	<span id="videoLoader">Video: <input id="video" name="video" type="file" accept="video/mp4, video/ogg"/> - leave empty <br></span>
	Audio: <input multiple name="files[]" type="file" accept="audio/mpeg, audio/ogg" id="speakerFiles" onchange="readAudio()"/>
	<span id="speakers"></span>
	<br>
	
	<input name="submiti" type="hidden" value="" id="form1HidSubmit">
	<input type="button" value="Submit Data" id="workSubmit">
	<input type="button" value="Update" id="workUpdate">
</div>
</form>

</div>

<div style="width:400px;position:absolute;top:0;right:0;text-align:right;">

<canvas id="speakersCanv" width="400px" height="400px">No canvas</canvas>
</div>

</div>
</div>


</div>
<div id="status"></div>
</div>
</div>

<script>
// Async Submit
var formD = document.forms.namedItem("form1");
var formDsubmit = document.getElementById('form1HidSubmit');
document.getElementById('workSubmit').onclick = function() {
	formDsubmit.value = 'Submit Data';
	workLoader();
}
document.getElementById('workUpdate').onclick = function() {
	formDsubmit.value = 'Update';
	workLoader()	
}
document.getElementById('deleteWorkButton').onclick = function() {
	formDsubmit.value = 'delete';
	workLoader()
}

function workLoader() {
	if (validateWorkForm()) {

		//format message for sql DB
		document.getElementById("description").value = replaceAll(document.getElementById("description").value);
        document.getElementById("name").value = replaceAll(document.getElementById("name").value);
        document.getElementById("workAuthor").value = replaceAll(document.getElementById("workAuthor").value);
        document.getElementById("place").value = replaceAll(document.getElementById("place").value);
        document.getElementById("year").value = replaceAll(document.getElementById("year").value);

	    var hr = new XMLHttpRequest();
	    var url = "uploadwork.php";
		var oData = new FormData(formD);

		hr.upload.onprogress = function(event) {
    		document.getElementById("status").innerHTML = "processing..." + (event.loaded/event.total)*100 + '%';
   		}

	    hr.open("POST", url, true);
	    hr.onload = function() {
		    if(hr.status == 200) {
			    var return_data = hr.responseText;
			     console.log(return_data);
				document.getElementById("status").innerHTML = return_data;
				
				<?php if($_SESSION["user_rights"]==2) {
					echo "showAllWorks(exhibitionsArr[thisEx].id, showExEditor);";
				} else if ($_SESSION["user_rights"]==1) {
					echo "showAllWorks(document.getElementById(\"exIdWorkHidden\").value, showExEditor);";
				}
				?>
				//showExEditor();
		    }
	    }
	    hr.send(oData);
	    document.getElementById("status").innerHTML = "processing...";
    } else {document.getElementById("status").innerHTML = "Form data not valid.";}
}

var formE = document.forms.namedItem("form2");
formE.addEventListener('submit', function(evt){

	//String format for SQL
	document.getElementById("exCurator").value = replaceAll(document.getElementById("exCurator").value);
	document.getElementById("exDescription").value = replaceAll(document.getElementById("exDescription").value);

    var hr = new XMLHttpRequest();
    var url = "editExhibition.php";
	var oData = new FormData(formE);

	hr.upload.onprogress = function(event) {
    	document.getElementById("status").innerHTML = "processing..." + event.loaded + ' / ' + event.total;
    }

    hr.open("POST", url, true);
    
    hr.onload = function() {
	    if(hr.status == 200) {
		    var return_data = hr.responseText;
		    console.log(return_text);
			document.getElementById("status").innerHTML = return_data;

			getExhibitions(
				<?php if($_SESSION["user_rights"]==2) {
					echo "function(){chooseExhibition(thisEx);}";
				}?> );
	    }
    }
    hr.send(oData);
   
	evt.preventDefault();

}, false);


<?php if($_SESSION["user_rights"]==2) {
echo "
var thisEx;
getExhibitions( function() {
for (var i in exhibitionsArr) {
	if (exhibitionsArr[i].id == ".$_SESSION["user_exhibitionId"].") {
		thisEx = i;
	}
} 
document.getElementById(\"exTitle\").innerHTML = exhibitionsArr[thisEx].name; 
console.log(exhibitionsArr[thisEx].name);
showAllWorks(exhibitionsArr[thisEx].id, function() {
	chooseExhibition(thisEx);
	});
});
"; } else if($_SESSION["user_rights"]==1) {
	echo "getExhibitions(exhibitionsEditor);";
	echo "var userrArr = ";
	echo json_encode($rows);
	echo ";
	function chooseUser(num) {
		document.getElementById(\"userName\").value = userrArr[num].user_name;
		document.getElementById(\"userEmail\").value = userrArr[num].email;
		document.getElementById(\"userRole\").selectedIndex = userrArr[num].rights-1;
		document.getElementById(\"userTrafficUsed\").innerHTML = userrArr[num].traffic_used;
		document.getElementById(\"userTrafficLimit\").value = userrArr[num].traffic_limit;
	} ";
}?>


var canv = document.getElementById("speakersCanv"),
    ctx = canv.getContext('2d');
</script>

</body>
</html>
