<?php
/*
 * Copyright(c)2011 Miguel Angel Nubla Ruiz (miguelangel.nubla@gmail.com). All rights reserved
 */
require_once "jwt/JWT.php";

	$header = '{"typ":"JWT",
	 			"alg":"HS256"}';
	 			
	$payload = '{"iss":"joe",
				 "exp":1300819380,
				 "http://localhost/":true, 
				 "username":"test"}';
	$key = 'har';
	
	
	$JWT = new JWT;
	$token = $JWT->encode($header, $payload, $key);
	$json = $JWT->decode($token, $key);
	
	//echo 'Header: '.$header."\n\n";
	//echo 'Payload: '.$payload."\n\n";
	//echo 'HMAC Key: '.$key."\n\n";
	//echo 'JSON Web Token: '.$token."<br><br>";
	$test = json_decode($json);
	echo	$test->{'username'};
?>