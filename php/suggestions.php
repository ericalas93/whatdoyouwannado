<?php
	require('lib/db_info.php');
	
	//make switch case to do get, post, delete from $_GET array	
	
	
	get_suggestion();

	function get_suggestion(){
		global $conn;
	
		$sql = "SELECT * FROM default_suggestion";
		$result = mysqli_query($conn, $sql);
		
		
		if (mysqli_num_rows($result) > 0) {
		    while($rows = mysqli_fetch_assoc($result)) {
				$data[] = array(
					"id" => $rows['suggestion_id'],
					"suggestion_name" => $rows['suggestion_name'],
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
	
