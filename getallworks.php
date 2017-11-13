<?php
$q = intval($_GET['q']);

$con = mysqli_connect('localhost','login','password','vsg_database');
if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}

$sql="SELECT * FROM works WHERE exhibitionID = '".$q."'";

$result = mysqli_query($con,$sql);
$row = mysqli_fetch_array($result, MYSQLI_ASSOC);
$rows = array();
do {
	$rows[] = $row;
} while($row = mysqli_fetch_assoc($result));

echo json_encode($rows);

mysqli_close($con);
?>