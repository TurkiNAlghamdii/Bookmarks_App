<?php

if($_SERVER['REQUEST_METHOD'] !== 'DELETE'){
    header('Allow: DELETE');
    http_response_code(405);
    echo json_encode(array  ('message'=> 'Error: Method not allowed'));
    return;
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: DELETE");

include_once '../db/DataBase.php';
include_once '../models/bookmark.php';

$database = new DataBase();
$dbConnection = $database->connect();

$bookmark = new Bookmark($dbConnection);

$data = json_decode(file_get_contents('php://input'));

if(!$data || !$data->id){
    http_response_code(422);
    echo json_encode(array ('message'=> 'Error: Missing required parameter id in the JSON body'));
    return;
}

$bookmark->setId($data->id);
if($bookmark->delete()){
    echo json_encode(array ('message'=> 'The bookmark was deleted'));
}