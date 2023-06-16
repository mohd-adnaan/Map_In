<?php
	error_reporting(E_ERROR | E_WARNING | E_PARSE);
    include_once ("connection.php");

	$EncodedData = file_get_contents('php://input');
	$DecodedData = json_decode($EncodedData, true);

	$name=test_input($DecodedData['name']);
	$mobile = test_input($DecodedData['mobile']);
    $email = test_input($DecodedData['email']);
    $address = test_input($DecodedData['address']);
    $city = test_input($DecodedData['city']);
    $state = test_input($DecodedData['state']);
    $pincode = test_input($DecodedData['pincode']);
	$mob_model=test_input($DecodedData['mob_model']);
	$os_version=test_input($DecodedData['os_version']);
	$code=0;

	if(strlen($mobile)==10 && strlen($name)>1 && strlen($email)>4 && strlen($pincode)==6 ) {

	$SQ = "SELECT * from users WHERE mobile = $1 ";
	$check = pg_query_params($db_connection, $SQ, Array($mobile));
	if ( pg_num_rows($check)>0 )
	{
		$Message = "An account with this phone number already exist!";
		$code=1;
		
	}
	else
	{
		$IQ = "INSERT INTO users (name, mobile, email, address, city, state, pincode,mob_model,os_version,id) VALUES ('$name', '$mobile', '$email', '$address', '$city', '$state', '$pincode','$mob_model','$os_version','')";

		$result = pg_query($db_connection, $IQ);
//echo $IQ;
		if($result)
		{
			$Message = "Successfully Registered!";
			$code=3;
			//$row = mysqli_fetch_row($result);
			
		}
		else
		{
			$Message = "Server Error...Please try later";
			$code=2;
		}
	}
}
else	{$Message="Missing parameters";
		 $code=4;
		}
	
	$Response = ["Message" => $Message,"Code"=>$code];
	echo json_encode($Response);

$db_connection->close();
?>