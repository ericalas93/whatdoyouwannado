<?php
	require('lib/db_info.php');
	require('jwt/JWT.php');
	
	
	switch($_GET['action'])
	{
		case 'create_user': post_new_user(); break;
		case 'login_user': login_user(); break;
		case 'check_log': userLoggedIn(); break;
	}
	
	
	
	function post_new_user(){
		//make sure the username is aokay and not already taken
		global $conn;
		$data 		= json_decode(file_get_contents('php://input'));
		$username 	= $data->username;
		$email 		= $data->email;
		$password 	= $data->password;
		
		$sql = "INSERT INTO members (member_id, member_name, member_email, member_password) VALUES (null, '$username', '$email', '$password')";
		
		//create a new table for this user and copy and paste the default suggestions
		create_new_member_table($username);
		
		if (mysqli_query($conn, $sql)) {
		   // echo $username;
		   echo create_jwt($username);
		} else {
		    echo "Error: " . $sql . "<br>" . mysqli_error($conn);
		}

	}
	
	function login_user(){
		
	
		global $conn, $loggedIn;
		$data 		= json_decode(file_get_contents('php://input'));
		$username 	= $data->username;
		$password 	= $data->password;

		$sql = "SELECT * FROM members where member_name = '$username'";
		
		$result = mysqli_query($conn, $sql);
		
		if(mysqli_num_rows($result) > 0){
			$row = mysqli_fetch_assoc($result);
			
			if($row['member_password'] !== $password ){
				echo "fail";	
			}else{
				$token = create_jwt($username);
				echo $token;
			} 
			
		}else{
			echo "no such user";
		}
	}
	
	function create_jwt($username){
		$header = '{"typ":"JWT",
	 				"alg":"HS256"}';
	 	
	 	$payload = '{"iss":"Eric Alas",
				 "http://localhost/":true, 
				 "username":"' . $username . '"}';
	
		$JWT = new JWT;
		$token = $JWT->encode($header, $payload, $key);
		
		return $token;
	}
	
	function jwt_valid(){
		$header = '{"typ":"JWT",
	 				"alg":"HS256"}';
	 				
		$token = $JWT->decode($token, $key);
		

	}
	
	function jwt_decode_for_username($token){
		$JWT = new JWT;
		$decodedToken = $JWT->decode($token, $key);
		
		$decodedToken = json_decode($decodedToken);
		$username = $decodedToken->{'username'};
		
		
		return $username;
	}
	
	
	function userLoggedIn(){
		$data 					= json_decode(file_get_contents('php://input'));
		$tokenFromRequest 		= $data->token;
		
		//we got nothing? lets immeditely say no thanks
		if($tokenFromRequest === null)
			echo http_response_code(401);
		
		else{
			$username = jwt_decode_for_username($tokenFromRequest);
			$newToken = create_jwt($username);
			
			
			
			if($tokenFromRequest === $newToken)
				echo 'correct';
			else
				echo http_response_code(401);
		}
	}
	
	function create_new_member_table($username){
		global $conn;
		$sql = "CREATE TABLE $username (
		suggestion_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
		suggestion_title VARCHAR(100) NOT NULL,
		suggestion_category VARCHAR(50) NOT NULL,
		suggestion_price VARCHAR(5) NOT NULL
		)";
		
		if (mysqli_query($conn, $sql)) {
		   //made table a-okay
		   //lets populate it with default values;
		   $sql_copy = "INSERT INTO $username SELECT * FROM default_suggestion";
		   mysqli_query($conn, $sql_copy);
		} 				
	}
