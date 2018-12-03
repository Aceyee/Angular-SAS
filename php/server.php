<?php
require "init.php";
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if(!isset($_POST)) {
    die();
}
session_start();
$response = [];

$username = mysqli_real_escape_string($con, $_POST['username']);
$password = mysqli_real_escape_string($con, $_POST['password']);

$query = "SELECT * from user WHERE username = '$username' AND passwd='$password'";
    
$result = mysqli_query($con, $query);

if(mysqli_num_rows($result) > 0){
    $response['status'] = 'loggedin';
    $response['user'] = $username;
    $response['useruniqueid'] = md5(uniqid());
    $_SESSION['useruniqueid'] = $response['useruniqueid'];
    $row = mysqli_fetch_assoc($result);
    $response['roll'] = $row["roll"];
    // array_push($response, array("username"=>$row["username"], "passwd"=>$row["passwd"],"university"=>$row["university"], 
    //         "roll"=>$row["roll"],"email"=>$row["email"], "studentNO"=>$row["studentNO"]));
}else{
    $response['status'] = 'error';
}

echo json_encode($response);
?>