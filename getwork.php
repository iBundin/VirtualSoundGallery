<?php
$q = intval($_GET['q']);

$con = mysqli_connect('localhost','login','password','vsg_database');
if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}

$sql="SELECT * FROM works WHERE workId = '".$q."'";

$result = mysqli_query($con,$sql);
$row = mysqli_fetch_array($result, MYSQLI_NUM);
echo json_encode($row);
mysqli_close($con);
?>