<?php
    require "init2.php";

    $name = "SSS";
    $search_input = $_POST["searchinput"];

    //$sql_query = "SELECT course from session WHERE course like '$search_input';";
    $sql_query = "SELECT * from session WHERE REPLACE(course, ' ', '') = REPLACE('$search_input', ' ', '');";
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