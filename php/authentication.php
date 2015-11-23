<?php
	require('lib/db_info.php');
	require('jwt/JWT.php');
	require('mysqlnd_polyfill.php');
	
	
	switch($_GET['action'])
	{
		case 'create_user': post_new_user(); break;
		case 'login_user': login_user(); break;
		case 'check_log': userLoggedIn(); break;
		case 'test': test(); break;
		default: break;
	}
	
	
	
	function post_new_user(){
		//make sure the username is aokay and not already taken
		global $conn;
		$data 		= json_decode(file_get_contents('php://input'));
		$username 	= htmlspecialchars($data->username);
		$email 		= htmlspecialchars($data->email);
		$password 	= htmlspecialchars($data->password);
		
		$password_hash = password_hash($password, PASSWORD_DEFAULT);
		
		//check if username is already taken
		
		if($sql = $conn->prepare("SELECT * FROM members where member_name = ?")){
					
			$sql->bind_param('s', $username);
			$sql->execute();
			$result = get_result_fill($sql);
			$username_count = count(array_shift($result));

			if($username_count > 0 )
			{
				//we already have that user name taken. 
				echo "taken";
				
			}else{
				if($sql = $conn->prepare("INSERT INTO members (member_id, member_name, member_email, member_password) VALUES (null, ?, ?, ?)")){
					$sql->bind_param('sss', $username, $email, $password_hash);
					if($sql->execute()){
						//create a new table for this user and copy and paste the default suggestions
						create_new_member_table($username);
						echo create_jwt($username);
					}else{
						echo "Error";
					}
				}
			}
			
		}else{
			echo "fail";
		}

		
		
	}
	
	function login_user(){
		global $conn;
	
		$data 		= json_decode(file_get_contents('php://input'));
		$username 	= htmlspecialchars($data->username);
		$password 	= htmlspecialchars($data->password);
		
		if($sql = $conn->prepare("SELECT * FROM members where member_name = ?")){
					
			$sql->bind_param('s', $username);
			$sql->execute();
			$result = get_result_fill($sql);
			
			$data = array_shift($result);


			if(count($data) > 0 )
			{
				if( !password_verify($password, $data['member_password']) ){
					echo "fail";	
				}else{
					$token = create_jwt($username);
					echo $token;
				} 
			}else{
				echo "no such user";
			}

			
		}else{
			echo "fail";
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
	
	
	function userLoggedIn($tokenFromRequest = null){
		//if we are calling userLoggedIn() from suggestions.php then it wont be null and no need to check from the POST data, as there is none
		if($tokenFromRequest === null){
			$data 					= json_decode(file_get_contents('php://input'));
			$tokenFromRequest 		= $data->token;
		}
		
		//we got nothing? lets immeditely say no thanks
		if($tokenFromRequest === null)
			echo http_response_code(401);
		
		else{
			$username = jwt_decode_for_username($tokenFromRequest);
			$newToken = create_jwt($username);
			
			
			
			if($tokenFromRequest === $newToken){
				echo true;
			}
				
			else{
				echo http_response_code(401);
			}
				
		}
	}
	
	function create_new_member_table($username){
		global $conn;
		$sql = "CREATE TABLE $username (
		suggestion_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
		suggestion_title VARCHAR(100) NOT NULL,
		suggestion_category VARCHAR(50) NOT NULL,
		suggestion_price VARCHAR(5) NOT NULL, 
		suggestion_time VARCHAR(10) NOT NULL, 
		suggestion_weather VARCHAR(100) NOT NULL,
		suggestion_temp VARCHAR(5) NOT NULL
		)";
		
		if (mysqli_query($conn, $sql)) {
		   //made table a-okay
		   //lets populate it with default values;
		   $sql_copy = "INSERT INTO $username SELECT * FROM default_suggestion";
		   mysqli_query($conn, $sql_copy);
		} 				
	}

