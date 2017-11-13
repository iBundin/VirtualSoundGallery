<?php
session_start();
if(isset($_POST['exedit'])) {
$name        = $_POST['name'];
$description = $_POST['description'];
$id          = $_POST['id'];
$oldIcon	 = $_POST['oldIcon'];
$curator     = $_POST['curator'];


//CREATE / EDIT EXHIBITION
if ($_SESSION["user_rights"]==1 && $_POST['exedit']=='SAVE') {
	$con = mysqli_connect('localhost','login','password','vsg_database');
	if (!$con) {
		die('Could not connect: ' . mysqli_error($con));
	}
	echo "access granted <br>";

		$uploaddir = '/home/virtuals/public_html/test/images/';   
		if (!file_exists($uploaddir)) {
			mkdir($uploaddir, 0777, true);
		}
		
		if (move_uploaded_file($_FILES['icon']['tmp_name'], $uploaddir . $id . $_FILES['icon']['name'])) {
			echo "File is valid, and was successfully uploaded.<br>";
			echo "file: " . $uploaddir . $_FILES['icon']['name'] . "<br>";
			$artwork = './images/'.$_FILES['icon']['name'];
		} else {
			echo "There some errors uploading icon!<br>";
			$artwork = $oldIcon;
		}

	
	$sql="REPLACE INTO exhibitions VALUES ('"  .$id. "', '" .$name. "','" . $artwork . "','" . $description . "','" . $curator . "')";
	mysqli_query($con, $sql);
	$lastID =  mysqli_insert_id($con); 
	echo $sql . "<br>";
	echo "Done. Last ID: " . $lastID;
		
	
	mysqli_close($con);

//DELETE EXHIBITION
} else if ($_SESSION["user_rights"]==1 && $_POST['exedit']=='delete') {
	$con = mysqli_connect('localhost','login','password','vsg_database');
	if (!$con) {
		die('Could not connect: ' . mysqli_error($con));
	}
	echo "access granted <br>";
	$sql="DELETE FROM exhibitions WHERE id = '".$id."'";
	if ($result = mysqli_query($con,$sql)) {
		echo "Exhibition deleted";	

	}
	mysqli_close($con);
} else if ($_SESSION["user_rights"]==2 && $_POST['exedit']=='SAVE') {                 // ACCESS FOR CURATORS

	$con = mysqli_connect('localhost','login','password','vsg_database');
	if (!$con) {
		die('Could not connect: ' . mysqli_error($con));
	}
	echo "access granted <br>";

		$uploaddir = '/home/virtuals/public_html/test/images/';   // FOR REMOTE!                      CHANGE in FINAL!
		if (!file_exists($uploaddir)) {
			mkdir($uploaddir, 0777, true);
		}
	
		
		if (move_uploaded_file($_FILES['icon']['tmp_name'], $uploaddir .$_SESSION["user_exhibitionId"]. $_FILES['icon']['name'])) {
			echo "File is valid, and was successfully uploaded.<br>";
			echo "file: " . $uploaddir .$_SESSION["user_exhibitionId"]. $_FILES['icon']['name'] . "<br>";
			$artwork = './images/'.$_FILES['icon']['name'];
		} else {
			echo "No image uploaded.<br>";
			$artwork = $oldIcon;
		}

	
	$sql="UPDATE exhibitions SET 
	name = '" .$name. "', 
	artwork = '" . $artwork . "', 
	description = '" . $description . "', curator = '" . $curator . "' WHERE id = ".$_SESSION["user_exhibitionId"];
	mysqli_query($con, $sql);
	$lastID =  mysqli_insert_id($con); 
	echo "Changes in exhibition saved.";
	mysqli_close($con);

}else {echo "acess denied";}
}
?>