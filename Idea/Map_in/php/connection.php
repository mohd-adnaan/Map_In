<?php
$dbconn = pg_connect("host=localhost dbname=mapin_db user=postgres password=Postgres$%^&")
    or die('Could not connect: ' . pg_last_error());

//define("upload_folder","../../documents/");   //system path of upload folder


function test_input($data) 
    {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        //$data =  htmlspecialchars_decode($data);
        return $data;
}

?>