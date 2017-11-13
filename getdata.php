<?php
$q = intval($_GET['q']);

$con = mysqli_connect('localhost','login','password','vsg_database');
if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}

//$sql="SELECT * FROM works WHERE exhibitionId = '".$q."'";
//$sql="SELECT * FROM works JOIN speakers ON works.workId=speakers.workId WHERE workId = '".$q."'";
$sql="SELECT * FROM speakers WHERE workId = '".$q."'";

$result = mysqli_query($con,$sql);
$row = mysqli_fetch_array($result);

$emparray[] = array();
	do {
        $emparray[] = $row;
    } while($row = mysqli_fetch_assoc($result));

echo json_encode($emparray);
mysqli_close($con);
?>