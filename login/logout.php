<?php
session_start();
unset($_SESSION["user_id"]);
unset($_SESSION["user_name"]);
unset($_SESSION["user_rights"]);
unset($_SESSION["user_exhibitionId"]);
header("Location:index.php");
?>