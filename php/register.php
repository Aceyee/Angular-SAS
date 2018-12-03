<?php
require "init.php";
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$name = "SSS";
$user_name = $_POST["user_name"];
$user_pass = $_POST["user_pass"];
$user_university = $_POST["user_university"];
$user_roll = $_POST["user_roll"];
$user_email = $_POST["user_email"];
$user_studentNO = $_POST["user_studentNO"];

$user_name = str_replace(' ', '', $user_name);
$user_pass = str_replace(' ', '', $user_pass);

$response = [];

if($user_name==null || $user_name=='undefined'){
    $response['status'] = 'error';
    $response['message'] =  "Please input username, no white space";
}else if($user_pass==null|| $user_pass=='undefined'){
    $response['status'] = 'error';
    $response['message'] = "Please input password, no white space";
}else if($user_roll==null|| $user_roll=='undefined'){
    $response['status'] = 'error';
    $response['message'] = "Please select your roll";
}else{
    $sql_query_username = "SELECT * from user WHERE username like '$user_name'";
    $result_username = mysqli_query($con, $sql_query_username);
    if(mysqli_num_rows($result_username)>0){
        $response['status'] = 'error';
        $response['message'] = "username already exist, please try another one";
    }else{
        $sql_query_insert = "insert into user(username, passwd, university, roll, email, studentNO) values('$user_name','$user_pass','$user_university','$user_roll','$user_email','$user_studentNO');";

        if(mysqli_query($con, $sql_query_insert)){
            $response['status'] = 'registered';
            $response['message'] = "Registration Success";
            $response['user'] = $user_name;
            $response['useruniqueid'] = md5(uniqid());
            $_SESSION['useruniqueid'] = $response['useruniqueid'];
        }else{
            $response['status'] = 'error';
            $response['message'] = "Data insertion error: ".mysqli_error($con);
        }
    }
}
echo json_encode($response);
?>