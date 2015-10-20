<?php
	 
	/****** Database Details *********/
	 
	$host = "localhost"; 
	$user = "root"; 
	$pass = "root"; 
	$database = "wdywd";
	
	$conn = mysqli_connect($host, $user, $pass, $database);
	if (!$conn) {
	    die("Connection failed: " . mysqli_connect_error());
	}

 
?>