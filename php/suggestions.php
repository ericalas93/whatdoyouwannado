<?php
	require('lib/db_info.php');
	
	//make switch case to do get, post, delete from $_GET array	
	$action = $_GET['action'];
	switch($action)
	{
		case 'get_suggestion': get_suggestion(); break;
		case 'post_suggestion': post_suggestion(); break;
	}
	
	//get_suggestion();

	function get_suggestion(){
		global $conn;
	
		$sql = "SELECT * FROM default_suggestion";
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
		$data = json_decode(file_get_contents("php://input")); 
		$prod_name = $data->name; 
		$prod_price = $data->price;
		 
		echo json_encode($data);
		
	}
	
