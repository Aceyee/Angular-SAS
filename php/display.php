<?php
require "init2.php";

$name = "SSS";
$courseid = $_POST["courseid"];

$sql_getNum = "SELECT * from sheet".$courseid.";";
$result_getNum = mysqli_query($con, $sql_getNum);
$num = mysqli_num_rows($result_getNum);
$response = [];
$response['status'] = 'success';
$response['num'] = $num;
// array_push($response,array("num_punched"=>$num));
echo json_encode($response);
?>