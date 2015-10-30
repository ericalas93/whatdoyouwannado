<?php
	require('lib/db_info.php');
	require('authentication.php');
	
	//make switch case to do get, post, delete from $_GET array	
	$action = $_GET['action'];
	switch($action)
	{
		case 'get_suggestion': get_suggestion(); break;
		case 'post_suggestion': post_suggestion(); break;
		case 'edit_suggestion': edit_suggestion(); break;
		case 'delete_suggestion': delete_suggestion(); break;
	}
	
	//get_suggestion();

	function get_suggestion(){
		global $conn;
		
		
		//sanatize tho
		$table_name = $_GET['tableName'];
		$suggestion_id = $_GET['id'];
	
		
		if($suggestion_id === null){
			//get all suggestions
			$sql = "SELECT * FROM $table_name";
			
		}else{
			//we are editting, lets get the specific suggestion
			$sql = 	"SELECT * FROM $table_name WHERE suggestion_id = $suggestion_id";
		}
		
		$result = mysqli_query($conn, $sql);
		
		
		if (mysqli_num_rows($result) > 0) {
		    while($rows = mysqli_fetch_assoc($result)) {
				$data[] = array(
					"id" => $rows['suggestion_id'],
					"suggestion_name" => $rows['suggestion_title'],
					"suggestion_category" => $rows['suggestion_category'],
					"suggestion_price" => $rows['suggestion_price']
				);
		    }
		} else {
		    echo "0 results";
		}
		
	
		$json_encoded = json_encode($data, JSON_PRETTY_PRINT);
		
		echo $json_encoded;
	}
	
	function post_suggestion(){
		global $conn;
		
		$data 					= json_decode(file_get_contents("php://input")); 
		$suggestion_name		= $data->name; 
		$suggestion_price		= $data->price;
		$suggestion_category	= $data->category;
		
		$token = $data->jwt;
		$username = $data->username;
		
		//we dont have to worry about checking what the result is, as as soon as it realizes we arent logged in 401 response header sent and caight by HTTP interceptor
		userLoggedIn($token);
		flush();
		
		$sql = "INSERT INTO $username (suggestion_id, suggestion_title, suggestion_category, suggestion_price) VALUES (null, '$suggestion_name', '$suggestion_category', '$suggestion_price')";
		
		if (!mysqli_query($conn, $sql)) {
			echo false;
		} 
		
	}
	
	function edit_suggestion(){
		global $conn;
		
		$data 					= json_decode(file_get_contents("php://input")); 
		$suggestion_name		= $data->name; 
		$suggestion_price		= $data->price;
		$suggestion_category	= $data->category;
		$suggestion_id 			= $data->suggestionId;
		$token 					= $data->jwt;	
		$username 				= $data->username;
		
		//we dont have to worry about checking what the result is, as as soon as it realizes we arent logged in 401 response header sent and caight by HTTP interceptor
		userLoggedIn($token);
		flush();
		
		$sql = "UPDATE $username SET suggestion_title = '$suggestion_name', suggestion_category = '$suggestion_category', suggestion_price = '$suggestion_price' WHERE suggestion_id = $suggestion_id";
		
		if (!mysqli_query($conn, $sql)) {
			echo false;
		} 
		
	}
	
	function delete_suggestion(){
		global $conn;
		
		$tablename = $_GET['tableName'];
		$suggestion_id = $_GET['suggestion_id'];
		$token = $_GET['jwt'];
		
		
		
		//we dont have to worry about checking what the result is, as as soon as it realizes we arent logged in 401 response header sent and caight by HTTP interceptor
		userLoggedIn($token);
		flush();
		
		$sql = "DELETE FROM $tablename WHERE suggestion_id = $suggestion_id";
		
		
		if (!mysqli_query($conn, $sql)) {
			echo false;
		} 
		
	}
	
	
