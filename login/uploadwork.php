<?php
session_start();

$author      = $_POST['author'];
$name        = $_POST['name'];
$description = $_POST['description'];
$year		 = $_POST['year'];
$place		 = $_POST['place'];
$id          - $_POST['id'];

if ($_SESSION["user_rights"]==2) {
	$exhibition  = $_SESSION["user_exhibitionId"];
} else {$exhibition  = $_POST['exhibition'];}

// SPEAKERS ARRAY
$speakerX = array();
$speakerY = array();
$speakerZ = array();
$speakerFile = array();

$traf=0;

if (($_SESSION['user_rights']==1 || $_SESSION['user_rights']==2 || $_SESSION['user_rights']==3)  && $_POST['submiti']=='Submit Data') {
	$con = mysqli_connect('localhost','login','password','vsg_database');
	if (!$con) {
		die('Could not connect: ' . mysqli_error($con));
	}
	echo "access granted <br>";

	
	if (dataValid($con) || $_SESSION['user_rights']==1 ) {

		$sql="SELECT name FROM exhibitions WHERE id = '".$exhibition."'";
		if ($result = mysqli_query($con,$sql)) {
			$exhib = mysqli_fetch_array($result);
			$exhibitionName = $exhib['name'];
			echo "<br>on id exhibition: " . $exhibitionName . "<br>";
		}

		//$uploaddir = '/var/www/vsg/virtual-sound-gallery/works/'.$exhibitionName.'/'.$author.'/'.$name.'/';   // FOR REMOTE! 
		$uploaddir = '/var/www/vsg/virtual-sound-gallery/works/'.$exhibitionName.'/'.$author.'/'.$name.'/';
		//$uploaddir = '/home/localhost/www/gallery1/works/'.$exhibitionName.'/'.$author.'/'.$name.'/';
		if (!file_exists($uploaddir)) {
			mkdir($uploaddir, 0777, true);
		}

		foreach ($_POST as $key => $value) {                                  // Возвращает массивы позиций
			if (strpos($key, 'x_') !== false) {
				$speakerX[intval(substr($key, strpos($key, 'x_')+2))-1] = intval($value);
			} else
			if (strpos($key, 'y_') !== false) {
				$speakerY[intval(substr($key, strpos($key, 'y_')+2))-1] = intval($value);
			} else	
			if (strpos($key, 'z_') !== false) {
				$speakerZ[intval(substr($key, strpos($key, 'z_')+2))-1] = intval($value);     
			}
		}

		
		if (move_uploaded_file($_FILES['artwork']['tmp_name'], $uploaddir . $_FILES['artwork']['name'])) {
			echo "File is valid, and was successfully uploaded.<br>";
			echo "file: " . $uploaddir . $_FILES['artwork']['name'] . "<br>";
			$artwork = './works/'.$exhibitionName.'/'.$author.'/'.$name.'/'.$_FILES['artwork']['name'];
		} else {
			echo "Error uploading icon<br>";
			$artwork = './images/play.png';
		}
		
	if (isset($_FILES['video'])) {
		if (move_uploaded_file($_FILES['video']['tmp_name'], $uploaddir . $_FILES['video']['name'])) {
			echo "File is valid, and was successfully uploaded.<br>";
			echo "file: " . $uploaddir . $_FILES['video']['name'] . "<br>";
			$video = './works/'.$exhibitionName.'/'.$author.'/'.$name.'/'.$_FILES['video']['name'];
		} else {
			echo "Error uploading video<br>" . $_FILES['video'];
			$video = '0';
		}
	} else {$video = '0';echo "No video<br>";}
		
	$date  = date('Y-m-d H:i:s');
	$sql="INSERT INTO works VALUES ('".$id."', '" .$exhibition. "','" .$name. "','" . $artwork . "','" . $author . "',
		'" . $description . "','" . $video . "','" . $year . "','" . $place . "',
		'" . $_SESSION['user_id'] . "', '" .  $date . "')";
	if (mysqli_query($con, $sql)) {
			$lastID =  mysqli_insert_id($con); 
				echo "Added Work record, last ID: " . $lastID;
			} else {echo "Error adding work record";}
	
	echo $sql . "<br>";
	echo "Done. Last ID: " . $lastID;

	for($i=0; $i<=$count; $i++) {
		if ($_FILES['files']['size'][$i]) {
			$count = count($_FILES['files']['name']);
			if (move_uploaded_file($_FILES['files']['tmp_name'][$i], $uploaddir . $_FILES['files']['name'][$i])) {
				echo "File is valid, and was successfully uploaded.<br>";
				echo "file: " . $uploaddir . $_FILES['files']['name'][$i] . "<br>";
				$speakerFile[$i] = './works/'.$exhibitionName.'/'.$author.'/'.$name.'/'.$_FILES['files']['name'][$i];
			} else {
				echo "Error uploading files<br>";
				move_uploaded_file($_FILES['files']['tmp_name'][$i], $f = $uploaddir . $_FILES['files']['name'][$i]);
				echo "file: " . $uploaddir . $_FILES['files']['name'][$i] . "<br>";
				chmod($f, 0777);
				$speakerFile[$i] = '';
			}
			$sql="INSERT INTO speakers VALUES (null, '".$lastID."','" .$speakerFile[$i]. "','" . $speakerX[$i] . "','" . $speakerY[$i] . "','" . $speakerZ[$i] . "')";
			echo $sql;
			if (mysqli_query($con, $sql)) {
				echo "Added Speaker";
			} else {echo "Error adding speaker";}
		}	
	}

	$sql="UPDATE users set traffic_used = '".$traf."' WHERE user_id = '".$_SESSION['user_id']."'";
	if (mysqli_query($con, $sql)) {
		echo "new size! ".$traf."<br>";
	} else {echo "Error with size update! ".$traf."<br>";}
}
mysqli_close($con);


// UPDATE CURRENT WORK
} else if (($_SESSION["user_rights"]==1 || $_SESSION["user_rights"]==2 || validUser($con)) && $_POST['submiti']=='Update') {
	$con = mysqli_connect('localhost','login','password','vsg_database');
	if (!$con) {
		die('Could not connect: ' . mysqli_error($con));
	}
	echo "access granted <br>";

	$count = 0;
	foreach ($_POST as $key => $value) {                                  // Возвращает массивы позиций
		if (strpos($key, 'x_') !== false) {
			$speakerX[intval(substr($key, strpos($key, 'x_')+2))-1] = intval($value);
			$count++;
		} else
		if (strpos($key, 'y_') !== false) {
			$speakerY[intval(substr($key, strpos($key, 'y_')+2))-1] = intval($value);
		} else	
		if (strpos($key, 'z_') !== false) {
			$speakerZ[intval(substr($key, strpos($key, 'z_')+2))-1] = intval($value);     
		}
	}

	echo $count;
	for($i=0; $i<$count; $i++) {
		$sql="UPDATE speakers set 
			x = '" . $speakerX[$i] . "', 
			y = '" . $speakerY[$i] . "',
			z = '" . $speakerZ[$i] . "'
		WHERE workId = '" .$_POST['id']. "' ";

		if (mysqli_query($con, $sql)) {
			echo "<br/>Speaker layout edited.<br/>";
			echo $sql;
		} else {echo "<br/>Error editing speaker layout.";}
	}


	//Update image
	$sql="SELECT name FROM exhibitions WHERE id = '".$exhibition."'";
	if ($result = mysqli_query($con,$sql)) {
		$exhib = mysqli_fetch_array($result);
		$exhibitionName = $exhib['name'];
		echo "<br>on id exhibition: " . $exhibitionName . "<br>";
	}
	$uploaddir = '../wroks'.$exhibitionName.'/'.$author.'/'.$name.'/';
	if (!file_exists($uploaddir)) {
		mkdir($uploaddir, 0777, true);
	}
	if (isset($_FILES['artwork'])) {
		if (move_uploaded_file($_FILES['artwork']['tmp_name'], $uploaddir . $_FILES['artwork']['name'])) {
			echo "File is valid, and was successfully uploaded.<br>";
			echo "file: " . $uploaddir . $_FILES['artwork']['name'] . "<br>";
			$artwork = './works/'.$exhibitionName.'/'.$author.'/'.$name.'/'.$_FILES['artwork']['name'];

			$sql="UPDATE works set artwork = '" .$artwork. "' WHERE workId = '" .$_POST['id']. "' ";
			if (mysqli_query($con, $sql)) {
				echo "<br/>New icon uploaded.<br/>";
			} else {echo "<br/>Error uploading new icon.<br/>";}
		}
	}
	

	$sql="UPDATE works set 
		name = '" .$name. "', 
		author = '" . $author . "',
		description = '" . $description . "',
		year = '" . $year . "',
		place = '" . $place . "',
		user_id = '" . $_SESSION['user_id'] . "' 
		WHERE workId = '" .$_POST['id']. "' ";
	if (mysqli_query($con, $sql)) {
		echo "<br/>Work edited.<br/>";
	} else {echo "<br/>Error editing work.";}

// DELETE WORK
} else if (($_SESSION["user_rights"]==1 || $_SESSION["user_rights"]==2 || validUser($con)) && $_POST['submiti']=='delete') {

	$con = mysqli_connect('localhost','login','password','vsg_database');
	if (!$con) {
		die('Could not connect: ' . mysqli_error($con));
	}
	echo "access granted for delete <br>";

	//First, delete video and artwork, if it exists
	$sql = "SELECT video, artwork FROM works WHERE workId = '".$_POST['id']."'";
	if ($result = mysqli_query($con,$sql)) {
		$deleteVideo = mysqli_fetch_array($result);
		if ($deleteVideo['video']!=0 && file_exists(".".$deleteVideo['video'])) {
			unlink(".".$deleteVideo['video']);
		}
		if (file_exists(".".$deleteVideo['artwork'] ) && $deleteVideo['artwork']!='.images/play.png' ) {unlink(".".$deleteVideo['artwork']);}
	}

	//Second, delete audio files
	$sql = "SELECT filename FROM speakers WHERE workId = '".$_POST['id']."'";
	if ($result = mysqli_query($con,$sql)) {
		$deleteDir = mysqli_fetch_array($result, MYSQLI_NUM);
		echo $deleteDir[0]."<br>";
		while ($row = mysqli_fetch_array($result, MYSQLI_NUM)) {
			if (file_exists(".".$row[0])) {unlink(".".$row[0]);}
			if (!file_exists(".".$row[0])) {echo ".".$row[0]." deleted<br>";}
		}
	}

	//Delete directory
	rmdir(dirname(".".$deleteDir[0]));

	//Delete records from database
	$sql="DELETE FROM speakers WHERE workId = '".$_POST['id']."'";
	if (mysqli_query($con, $sql)) {
    	echo "<br>Record deleted successfully";
	} else {
    	echo "<br>Error deleting record: " . mysqli_error($con);
	}
	$sql="DELETE FROM works WHERE workId = '".$_POST['id']."'";
	if (mysqli_query($con, $sql)) {
    	echo "<br>Record deleted successfully";
	} else {
    	echo "<br>Error deleting record: " . mysqli_error($con);
	}
	
	//Update user uploaded traffic
	$sql="SELECT traffic_limit, traffic_used FROM users WHERE user_id = '".$_SESSION["user_id"]."'";
	if ($result = mysqli_query($con,$sql)) {
		$traffic = mysqli_fetch_array($result, MYSQLI_ASSOC);
		$traf = 2*$traffic['traffic_used'] - $traf;
	}
	if ($traf<$traffic['traffic_used']) {
		$sql="UPDATE users set traffic_used = '".$traf."' WHERE user_id = '".$_SESSION['user_id']."'";
			if (mysqli_query($con, $sql)) {
				echo "You uploaded: ".$traf."<br>";
			} else {echo "Error with size update.";}
	}
	mysqli_close($con);

} else {echo "access denied";}

function dataValid($con) {
	$sql="SELECT traffic_limit, traffic_used FROM users WHERE user_id = '".$_SESSION["user_id"]."'";
	if ($result = mysqli_query($con,$sql)) {
		$traffic = mysqli_fetch_array($result, MYSQLI_ASSOC);
		echo "traffic used: " .$traffic['traffic_used']. " / " .$traffic['traffic_limit']. "kbyte<br>";
	}
	if (isset($_FILES['files'])) {
		$count = count($_FILES['files']['name']);
		$sumsize = 0;
		for($i=0; $i<=$count; $i++) {
			if ($_FILES['files']['size'][$i]) {
				$sumsize += $_FILES['files']['size'][$i];
			}
		}
	}
	if (isset($_FILES['video'])) {$sumsize += $_FILES['video']['size'];}
	echo (round($sumsize/1000) + $traffic['traffic_used']);
	$GLOBALS["traf"] = round($sumsize/1000) + $traffic['traffic_used'];
	if ((round($sumsize/1000) + $traffic['traffic_used'])<$traffic['traffic_limit']) {
		return true;
	} else {
		echo "Upload Limit Exceeded.";
		return false;}
}

function validUser($con) {
	$sql="SELECT user_id FROM works WHERE workId = '".$id."'";
	if ($result = mysqli_query($con,$sql)) {
		$user = mysqli_fetch_array($result, MYSQLI_ASSOC);
		if ($user['user_id'] == $_SESSION['user_id']) {
			return true;
		} else {return false;}
	}
}

?>