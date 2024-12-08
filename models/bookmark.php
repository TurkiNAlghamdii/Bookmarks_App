<?php

class bookmark{
    private $id;
    private $title;
    private $link;
    private $date_added;
    private $dbConnection;
    private  $dbTable = "bookmarks";

    public function __construct($dbConnection){
        $this->dbConnection = $dbConnection;
    }

    public function setId($id){
        $this->id = $id;
    }
    public function setTitle($title){
        $this->title = $title;
    }
    public function setLink($link){
        $this->link = $link;
    }
    public function setDateAdded($date_added){
        $this->date_added = $date_added;
    }
    public function getId(){
        return $this->id;
    }
    public function getTitle(){
        return $this->title;
    }
    public function getLink(){
        return $this->link;
    }
    public function getDateAdded(){
        return $this->date_added;
    }

    public function create(){
        $query = "INSERT INTO " . $this->dbTable." (title,link,date_added) VALUES(:title, :link, now());";
        $stmt = $this->dbConnection->prepare($query);
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":link", $this->link);
        if($stmt->execute()){
            return true;
        }
        printf("ERROR: %s", $stmt->error);
        return false;
    }

    public function readOne(){
        $query ="SELECT * FROM ".$this->dbTable." WHERE id=:id;";
        $stmt = $this->dbConnection->prepare($query);
        $stmt->bindParam("id", $this->id);
        if($stmt->execute() && $stmt->rowCount()==1){
            $result = $stmt->fetch(PDO::FETCH_OBJ);
            $this->id= $result -> id;
            $this->title= $result -> title;
            $this->link= $result -> link;
            $this->date_added = $result -> date_added;
            return true;
        }
        return false;
    }

    public function readAll(){
        $query ="SELECT * FROM ".$this->dbTable;
        $stmt = $this->dbConnection->prepare($query);
        if($stmt->execute() && $stmt->rowCount()>0){

            return $stmt -> fetchAll(PDO::FETCH_ASSOC);
        }
        return [];
    }
    public function update(){
        $query = "UPDATE " . $this->dbTable . " SET title = :title, link = :link, date_added = now() WHERE id = :id";
        $stmt = $this->dbConnection->prepare($query);
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":link", $this->link);
        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT); // here <--------------- The PD0::PARAM_INT
    
        if($stmt->execute() && $stmt->rowCount()==1){
            return true;
        }
        return false;
    }

    public function delete(){
        $query = "DELETE FROM " . $this->dbTable . " WHERE id = :id";
        $stmt = $this->dbConnection->prepare($query);

        $stmt->bindParam(":id", $this->id, PDO::PARAM_INT); // here <--------------- The PD0::PARAM_INT

        if ($stmt->execute() && $stmt->rowCount() == 1) {
            return true;
        }

        return false;
    }
    


}