<?php

if($_SERVER['REQUEST_METHOD'] !== 'PUT'){
    header('Allow: PUT');
    http_response_code(405);
    echo json_encode(array  ('message'=> 'Error: Method not allowed'));
    return;
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: PUT");

include_once '../db/DataBase.php';
include_once '../models/bookmark.php';

$database = new DataBase();
$dbConnection = $database->connect();

$bookmark = new Bookmark($dbConnection);

$data = json_decode(file_get_contents('php://input'));

if(!$data || !$data->id || !$data->title || !$data->link){
    http_response_code(422);
    echo json_encode(array ('message'=> 'Error: Missing required parameters id and title and link in the JSON body'));
    return;
}

$bookmark->setId($data->id);
$bookmark->setTitle($data->title);
$bookmark->setLink($data->link);
if($bookmark->update()){
    echo json_encode(array ('message'=> 'The bookmark was updated'));
}