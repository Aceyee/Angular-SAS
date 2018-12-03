<?php
require "init2.php";

$name = "SSS";
$courseid = $_POST["courseid"];
$choice = $_POST["choice"];
$university = $_POST["university"];
$studentNO = $_POST["studentNO"];
$username = $_POST["username"];

$sql_query_getStudentNO = "SELECT studentNO from sheet".$courseid." WHERE studentNO like '$studentNO';";

$result_getStudentNO = mysqli_query($con, $sql_query_getStudentNO);
if(mysqli_num_rows($result_username)>0){
    echo "data exist";
}else{
    $sql_query_insertSignup = "INSERT into sheet".$courseid."(courseid, university, studentname, studentNO, choice) values('$courseid','$university','$username','$studentNO','$choice');";
    if(mysqli_query($con, $sql_query_insertSignup)){
        $sql_getNum = "SELECT * from sheet".$courseid.";";
        $result_getNum = mysqli_query($con, $sql_getNum);
        $num = mysqli_num_rows($result_getNum);
        $response = [];
        $response['status'] = 'success';
        $response['num'] = $num;
        echo json_encode($response);
    }else if(strpos(mysqli_error($con), 'Duplicate')!==false){
        $sql = "UPDATE sheet".$courseid." SET choice='$choice' WHERE studentNO='$studentNO'";
        if ($con->query($sql) === TRUE) {
            $sql_getNum = "SELECT * from sheet".$courseid.";";
            $result_getNum = mysqli_query($con, $sql_getNum);
            $num = mysqli_num_rows($result_getNum);
            $response['status'] = 'success';
            $response['num'] = $num;
            echo json_encode($response);
        } else {
            echo "Error updating record: " . $con->error;
        }
    }else{
        echo "Data insertion error ".mysqli_error($con);
    }
}
?>