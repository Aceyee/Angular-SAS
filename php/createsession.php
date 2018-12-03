<?php
require "init2.php";

$name = "SSS";
$university = $_POST["university"];
$course = $_POST["course"];
$professor = $_POST["professor"];

$sql_query_insertCourse = "insert into session(university, course, professor) values('$university','$course','$professor');";
$sql_query_getCourseID = "SELECT id from session WHERE university like '$university' and course like '$course' and professor like '$professor';";

if(mysqli_query($con, $sql_query_insertCourse)){
    $result = mysqli_query($con, $sql_query_getCourseID);
    $row = mysqli_fetch_array($result);
    $id = $row["id"];
    $sql_query_CreateSheet = "CREATE TABLE sheet".$id." (courseid INT, university VARCHAR(40), studentname VARCHAR(40), studentNO VARCHAR(16) PRIMARY KEY, choice VARCHAR(1), punchtime DATE);";
    $sql_query_getCourse = "SELECT * from session WHERE id like '$id';";
    //$sql_query_insertSignup = "insert into signupsheet(id, studentname, studentID) values('$id','aceyee','V00793984');";
    if(mysqli_query($con, $sql_query_CreateSheet)){
        //echo "Sheet Created Insertion Success ".$id;
        $result2 = mysqli_query($con, $sql_query_getCourse);
        $response = array();
        if(mysqli_num_rows($result2)>0){
            while($row2 = mysqli_fetch_array($result2)){
                array_push($response, array("id"=>$row2[0], "university"=>$row2[1], "course"=>$row2[2], "session"=>$row2[3], "professor"=>$row2[4]));
            }
            echo json_encode(array("Create Success"=>$response));
        }else{
            echo "Create Course Failed";
        }
    }else{
        echo "Failed to Create a Sheet";
    }
}else{
    echo "Data insertion error ".mysqli_error($con);
}
?>