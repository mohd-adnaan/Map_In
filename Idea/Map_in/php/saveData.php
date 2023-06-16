<?php
    error_reporting(E_ERROR | E_WARNING | E_PARSE);
    include_once ("connection.php");

	$EncodedData = file_get_contents('php://input');
	$DecodedData = json_decode($EncodedData, true);

/*	$username = $DecodedData[0]['username'];
    $placeName=$DecodedData['placeName'];
    $remarks=$DecodedData['remarks'];
    $landmark=$DecodedData['landmark'];
    $landuseClass=$DecodedData['landuseClass'];
    $dateTime=$DecodedData['dateTime'];
    $locations=$DecodedData['locations'];
    $shapeType=$DecodedData['shapeType'];
    $image1=$DecodedData['image1'];
    $image2=$DecodedData['image2']; */
	$code=0; 

        	
			//for($x=0; $x<count($DecodedData); $x=$x+1){
			foreach($DecodedData as $row){	
				$imae=$row['image1'];
				$imae=str_replace("\\n","",$imae);
		$data='data:image/jpeg;base64,'.$imae;
		$data = explode( ',', $data );
		$data2=base64_decode($data[1]);	
		$file = "images/" . uniqid() . '.jpeg';
		$success = file_put_contents($file, $data2);
	
		$imae2=$row['image2'];
		
		if(strlen($imae2)>0){
			$imae2=str_replace("\\n","",$imae2);
		$data='data:image/jpeg;base64,'.$imae2;
		$data = explode( ',', $data );
		$data2=base64_decode($data[1]);	
		$file2 = "images/" . uniqid() . '.jpeg';
		$success = file_put_contents($file2, $data2);}
		else{$file2='';}
		$IQ = "INSERT INTO mapdb (userName,placeName,remarks,landmark,landuseClass,dateTime,locations,shapeType,image1,image2,id) VALUES ('$row[userName]', '$row[placeName]', '$row[remarks]', '$row[landmark]', '$row[landuseClass]', '$row[dateTime]', '$row[locations]','$row[shapeType]','$file','$file2','')";
		//$IQ = "INSERT INTO mapdb (userName,placeName,remarks,landmark,landuseClass,dateTime,locations,shapeType,image1,image2,id) VALUES ('$DecodedData[$x]['username']', '$DecodedData[$x]['placeName']', '$DecodedData[$x]['remarks']', '$DecodedData[$x]['landmark']', '$DecodedData[$x]['landuseClass']', '$DecodedData[$x]['dateTime']', '$DecodedData[$x]['locations']', '$DecodedData[$x]['shapeType']', '$DecodedData[$x]['image1']', '$DecodedData[$x]['image2']','')";
		$result = mysqli_query($db_connection, $IQ);
		
		
//echo $IQ;
		if($result)
		{
			$Message = "Data Sent Successfully.";
			$code=3;
			//$row = mysqli_fetch_row($result);
			
		}
		else
		{
			$Message = "Server Error...Please try later";
			$code=("Error description: " . mysqli_error($db_connection));;
		}
	}
	

    
    
	
	
	$Response = ["Message" => $Message,"Code"=>$code,"Image"=>$imae];
	echo json_encode($Response);

$db_connection->close();
?>