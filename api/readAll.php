<?php

if($_SERVER['REQUEST_METHOD'] !== 'GET'){
    header('Allow: GET');
    http_response_code(405);
    echo json_encode(array  ('message'=> 'Error: Method not allowed'));
    return;
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");

include_once '../db/DataBase.php';
include_once '../models/bookmark.php';

$database = new DataBase();
$dbConnection = $database->connect();

$bookmark = new Bookmark($dbConnection);

$result = $bookmark->readAll();

if(!empty($result)){
    
    echo json_encode($result);
}else{
    http_response_code(404);
    echo json_encode(array('message'=> 'Error: No bookmarks items found'));
}