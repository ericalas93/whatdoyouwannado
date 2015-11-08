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
		
		//make sure the table being requested in the right table name and not something like an injection command
		$accepted_tables = get_tables();
		
		if(in_array($table_name, $accepted_tables)){
			$table_name = htmlspecialchars($table_name);
			
			if($suggestion_id === null){
				//get all suggestions
				//since we cant prepare 
				$sql = $conn->prepare("SELECT * FROM $table_name");
				if(!$sql){
					echo 'invalid';
				}
				
			}else{
				$suggestion_id = htmlspecialchars($suggestion_id);
				//we are editting, lets get the specific suggestion
				$sql = $conn->prepare("SELECT * FROM $table_name WHERE suggestion_id = ?");
				$sql->bind_param("i", $suggestion_id);
			}
			
			
			$sql->execute();
			$result = $sql->get_result();
			
			if ($result->num_rows > 0) {
			    while($rows = $result->fetch_assoc()) {
					$data[] = array(
						"id" => $rows['suggestion_id'],
						"suggestion_name" => $rows['suggestion_title'],
						"suggestion_category" => $rows['suggestion_category'],
						"suggestion_price" => $rows['suggestion_price'], 
						"suggestion_weather" => $rows['suggestion_weather'], 
						"suggestion_time" => $rows['suggestion_time'], 
						"suggestion_temperature" => $rows['suggestion_temp']
					);
			    }
			} else {
			    echo 'invalid';
			}
			
		
			$json_encoded = json_encode($data, JSON_PRETTY_PRINT);
			
			echo $json_encoded;	
			
		}
		else{
			//someone is trying to send another type of table name
			echo 'invalid';
		}
				
	}
	
	function post_suggestion(){
		global $conn;
		
		$data 									= json_decode(file_get_contents("php://input")); 
		$suggestion_name						= $data->name; 
		$suggestion_price						= $data->price;
		$suggestion_category					= $data->category;		
		$suggestion_acceptable_time				= $data->acceptableTime;
		$suggestion_acceptable_temperature		= $data->acceptableTemperature;
		$suggestion_acceptable_condition		= $data->acceptableCondition;
		
		$token = $data->jwt;
		$username = $data->username;
		
		//we dont have to worry about checking what the result is, as as soon as it realizes we arent logged in 401 response header sent and caight by HTTP interceptor
		userLoggedIn($token);
		flush();
		
		//lets make sure we have a valid table
		$accepted_tables = get_tables();
		if(in_array($username, $accepted_tables)){
			$username = htmlspecialchars($username);
			if($sql = $conn->prepare("INSERT INTO $username (suggestion_id, suggestion_title, suggestion_category, suggestion_price, suggestion_time, suggestion_weather, suggestion_temp) VALUES (null, ?, ?, ?, ?, ?, ?)")){
				$sql->bind_param('ssssss', $suggestion_name, $suggestion_category, $suggestion_price, $suggestion_acceptable_time, $suggestion_acceptable_condition, $suggestion_acceptable_temperature);
				if($sql->execute()){
					echo true;
				}
				else
					echo $sql->error;
			}
		}
		
		
	}
	
	function edit_suggestion(){
		global $conn;
		
		$data 									= json_decode(file_get_contents("php://input")); 
		$suggestion_name						= $data->name; 
		$suggestion_price						= $data->price;
		$suggestion_category					= $data->category;
		$suggestion_acceptable_time				= $data->acceptableTime;
		$suggestion_acceptable_temperature		= $data->acceptableTemperature;
		$suggestion_acceptable_condition		= $data->acceptableCondition;
		
		
		$suggestion_id 							= $data->suggestionId;
		$token 									= $data->jwt;	
		$username 								= $data->username;
		
		//we dont have to worry about checking what the result is, as as soon as it realizes we arent logged in 401 response header sent and caight by HTTP interceptor
		userLoggedIn($token);
		flush();
		
		$accepted_tables = get_tables();
		if(in_array($username, $accepted_tables)){
			$username = htmlspecialchars($username);
			if($sql = $conn->prepare("UPDATE $username SET suggestion_title = ?, suggestion_category = ?, suggestion_price = ?, suggestion_time = ?, suggestion_weather = ?, suggestion_temp = ? WHERE suggestion_id = ?")){
				$sql->bind_param('sssssss', $suggestion_name, $suggestion_category, $suggestion_price, $suggestion_acceptable_time, $suggestion_acceptable_condition, $suggestion_acceptable_temperature, $suggestion_id);
				if( !($sql->execute()) ){
					echo false;
				}
			}
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
		
		
		$accepted_tables = get_tables();
		if(in_array($tablename, $accepted_tables)){
			$tablename = htmlspecialchars($tablename);
			$suggestion_id = htmlspecialchars($suggestion_id);
			if($sql = $conn->prepare("DELETE FROM $tablename WHERE suggestion_id = ?")){
				$sql->bind_param('s', $suggestion_id);
				if( !($sql->execute()) ){
					echo false;
				}
			}
		}

		
	}
	
	function get_tables(){
		global $conn;
		$tableList = array();
		
		$sql = "SHOW TABLES IN wdywd";
		$result = $conn->query($sql);
		
		
		while($row = $result->fetch_assoc()){
			$tableList[] = $row['Tables_in_wdywd'];
		}
		return $tableList;
	}
	
	
