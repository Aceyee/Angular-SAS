<?php
    require "init2.php";

    $name = "SSS";
    $professor_name = $_POST["professor_name"];

    //$sql_query = "SELECT course from session WHERE course like '$professor_name';";
    $sql_query = "SELECT * from session WHERE REPLACE(professor, ' ', '') = REPLACE('$professor_name', ' ', '');";

    $result = mysqli_query($con, $sql_query);
    $response = [];

    if(mysqli_num_rows($result)>0){
        $response['status']='courseFound';
        $response['session']=[];
        while($row = mysqli_fetch_array($result)){
            array_push($response['session'], array("id"=>$row[0], "university"=>$row[1], "course"=>$row[2], "session"=>$row[3], "professor"=>$row[4]));
        }
    }else{
        $response['status']='error';
        $response['message']='Search Fails. No Result';
    }
    echo json_encode($response);

?>