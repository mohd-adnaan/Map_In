
import * as Animatable from 'react-native-animatable';
import React,{ useEffect, useState } from 'react';
import { Text,TextInput, View,StyleSheet, Alert, Image, TouchableOpacity, ActivityIndicator,ScrollView,PermissionsAndroid} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {attributes} from './attributes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { openDatabase } from 'react-native-sqlite-storage';
import RNLocation from 'react-native-location';
import ImgToBase64 from 'react-native-image-base64';
import { CommonActions } from '@react-navigation/native';
import './global.js';



export default function FormScreen({route,navigation}){
    const db=openDatabase({name:'mapapp.db',location:'default'},
    function () {
      console.log('DB Connection Success');
      },
      error=>{console.log('Error',error)}
           
      );

    const{locations,shapeType}=route.params;
    let requestOptions={}
    const [isLoading,setIsLoading]=useState(false)
    let username=''
    let [imagePath,setImagePath]=useState([])
    let index=0
    const [data,setData]=useState([])
    let url = global.server_url+"saveData.php";
    const [inputFields,setInputFields]=useState([])
    let position=0
    let image1=''
    let image2=''
    const [gpsloc,setGpsLoc]=useState({
      loctext:'Waiting Location Information...',
      location: null,
      accvalue:0,    
      capLocation1: null,
      cappic1time:'',
      capLocation2: null,
      cappic2time:'',
      capLocText:'',
      latitude1:'',
      latitude2:'',
      longitude1:'',
      longitude2:'',
      accuracy1:'',
      accuracy2:'',    
    });
    let inputIndex=0
      let placeName=""
      let landmark=undefined
      let remarks=undefined
      let landuseClass=undefined
      let shapeLocations=""
      let today = ""
      let date = ""
    const handleFormChange = (index,text,attr) => {
      //console.log('index',index,'value',event.target.name)
      let data = [...inputFields];
      
    data[index]= {attr:attr,text:text,index:index}
        setInputFields(data);
       console.log(inputFields)
    }

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        
        getLocation()
        
        // The screen is focused
        // Call any action
      });
  
      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
    }, [navigation]);

    const getLocation = () => {
        RNLocation.configure({
          distanceFilter: 3.0,
          desiredAccuracy: {
            ios: "best",
            android: "highAccuracy"
          },
          // Android only
          androidProvider: "auto",
          interval: 10000, // Milliseconds
          fastestInterval: 10000, // Milliseconds
          maxWaitTime: 10000, // Milliseconds
          // iOS Only
          activityType: "other",
          allowsBackgroundLocationUpdates: false,
          pausesLocationUpdatesAutomatically: true,
          showsBackgroundLocationIndicator: false,
        })
         
        RNLocation.requestPermission({
          ios: "whenInUse",
          android: {
            detail: "fine"
          }
        }).then(granted => {
            if (granted) {   
              //console.log('callin _startUpdatingLocation') ;      
              _startUpdatingLocation();       
            }
          });
      };

      const _startUpdatingLocation = () => {
        let  locationSubscription = RNLocation.subscribeToLocationUpdates(
            locations => {
             // this.setState({ location: locations[0] });
              
              let location= locations[0];
                //  let loctext1='';
            // let loctext = "Waiting Location Information...";
              let latvalue="";
              let lonvalue="";
              let accvalue="";
                latvalue = parseFloat(location.latitude).toFixed(5);
                lonvalue = parseFloat(location.longitude).toFixed(5);
                accvalue = parseFloat(location.accuracy).toFixed(0);
              let  loctext = 'You are at Lat: ' + latvalue + ' Lon: ' + lonvalue + ' (Acc:' + accvalue + ' m)';
              //console.log('get location');
              //console.log('_startUpdatingLocation');
              //console.log("here "+loctext);
              //console.log(data);
              setGpsLoc({
                  
                  location: locations[0],
                  accvalue:accvalue,
                  loctext:loctext
              })
              // setData({
              //     ...data,
              //     location: locations[0],
              //     accvalue:accvalue,
              //     loctext:loctext
              //   })
            }
          );
        };

        const validation=()=>{
          if(inputFields.length>4){
            if(inputFields[1].text.length>0 && inputFields[2].text.length>0 && inputFields[3].text.length>0 && inputFields[4].text.length>0){
              sendToServer();}
              else{
          Alert.alert("All Fields are required.")
        }}
        else{
          Alert.alert("All Fields are required.")
        }
          
        }

        

        const requestCameraPermission = async () => {
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                  title: "App Camera Permission",
                  message:"App needs access to your camera ",
                  buttonNeutral: "Ask Me Later",
                  buttonNegative: "Cancel",
                  buttonPositive: "OK"
                }
              );
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Camera permission given");
                let options = {
                  storageOptions: {
                    skipBackup: true,
                    path: 'images',
                  },
                  maxWidth: 720,
                  maxHeight: 1024,
                  quality: 1.0
              };
                launchCamera(options,(response) => {
                  if (response.didCancel) {
                    console.log('User cancelled image picker');
                  } else if (response.errorCode) {
                    console.log('ImagePicker Error: ', response.errorCode);
                  } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                  } else {
                    console.log('Response = ', response);
                  console.log('response', JSON.stringify(response));
                  let res=(response.assets)
                  //console.log('image path',(res[0].uri))
                  let path=res[0].uri
                  
                  ImgToBase64.getBase64String(path)
                 .then(base64String =>
                 setImagePath([...imagePath,{path:base64String}]))
                .catch(err => alert(err));
                }
                  
                 }
                  )
                  
                  
                 // console.log('image path',imagePath)
              } else {
                console.log("Camera permission denied");
              }
            } catch (err) {
              console.warn(err);
            }
          };

          

        const sendToServer=()=>{
            {
              if(inputFields.length<5){
                Alert.alert("All Fields are required.")
              }
              else{
                createTable();insertData();getData();
              }
            }
          }
      const createTable=async ()=>{
        db.transaction((tx)=>{
          tx.executeSql(
            "CREATE TABLE `mapdb` ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, `userName` VARCHAR(20) NULL , `placeName` VARCHAR(50) NULL , `remarks` VARCHAR(200) NULL , `landmark` VARCHAR(100) NULL , `landuseClass` VARCHAR(20) NULL , `dateTime` VARCHAR(50) NULL , `locations` VARCHAR(1000) NULL , `shapeType` VARCHAR(10) NULL, `sendToServer` VARCHAR(5) NULL, `image1` TEXT NULL, `image2` TEXT NULL );"
          )
        },
        error=>{console.log('Creatable Failed:',error)}),
        success=>{console.log('Creatable Success:',success)}
      }  
     
  
      
      //console.log(urlTemplate,type)
      
  
    
  
      const insertData = async () =>{
        username=await AsyncStorage.getItem("mobile")
        placeName=inputFields[1].text
        landmark=inputFields[2].text
        remarks=inputFields[3].text
        landuseClass=inputFields[4].text
        shapeLocations=JSON.stringify(locations)
        if(imagePath.length==2){
        image1=JSON.stringify(imagePath[0].path)
        image2=JSON.stringify(imagePath[1].path)}
        else{
          image1=JSON.stringify(imagePath[0].path)
        }
        today = new Date();
        date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds()
        //console.log("Place Name",placeName,"landmark",landmark,"remarks",remarks,"landuseClass",landuseClass,"shapeLocation",shapeLocations,"date",date)
  
        try{
         db.transaction( async (tx)=>{
         await tx.executeSql("INSERT INTO mapdb ('userName','placeName','remarks','landmark','landuseClass','dateTime','locations','shapeType', 'sendToServer', 'image1', 'image2') VALUES ('"+username+"','"+placeName+"','"+remarks+"','"+landmark+"','"+landuseClass+"','"+date+"','"+shapeLocations+"','"+shapeType+"','false','"+image1+"', '"+image2+"');");
        },
        error=>{alert("Some error occurred")
          console.log('Insertion Error:',error)},
        success=>{Alert.alert("Alert","Data Saved Successfully",
        [{ text: 'OK', onPress: () => {  navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: 'Map' },
             
            ],
          })
        );   
                                 
          
        }}])
                  
                  
          console.log('Insertion Success:',success)})
          
        }
        catch (error) {
          console.log(error)
        }
      };

      

      /*

      const uploadToServer=async()=>{

        if(inputFields.length>4){
          if(inputFields[1].text.length>0 && inputFields[2].text.length>0 && inputFields[3].text.length>0 && inputFields[4].text.length>0){
             if(inputFields.length<5){
              Alert.alert("All Fields are required.")
            }
            else if(imagePath.length<1){
              alert("Please capture atleast one photo")
            }
            else{
              setIsLoading(true)
              db.transaction((tx)=>{
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS `mapdb` ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, `userName` VARCHAR(20) NULL , `placeName` VARCHAR(50) NULL , `remarks` VARCHAR(200) NULL , `landmark` VARCHAR(100) NULL , `landuseClass` VARCHAR(20) NULL , `dateTime` VARCHAR(50) NULL , `locations` VARCHAR(1000) NULL , `shapeType` VARCHAR(10) NULL, `sendToServer` VARCHAR(5) NULL, `image1` TEXT NULL, `image2` TEXT NULL );"
        )
      },
      error=>{console.log('Creatable Failed:',error)}),
      success=async ()=>{ console.log('Creatable Success:',success)}
      username=await AsyncStorage.getItem("mobile")
      placeName=inputFields[1].text
      landmark=inputFields[2].text
      remarks=inputFields[3].text
      landuseClass=inputFields[4].text
      shapeLocations=JSON.stringify(locations)
      if(imagePath.length==2){
      image1=JSON.stringify(imagePath[0].path)
      image2=JSON.stringify(imagePath[1].path)}
      else{
        image1=JSON.stringify(imagePath[0].path)
      }
      today = new Date();
      date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds()
      //console.log("Place Name",placeName,"landmark",landmark,"remarks",remarks,"landuseClass",landuseClass,"shapeLocation",shapeLocations,"date",date)

      try{
       db.transaction( async (tx)=>{
       await tx.executeSql("INSERT INTO mapdb ('userName','placeName','remarks','landmark','landuseClass','dateTime','locations','shapeType', 'sendToServer', 'image1', 'image2') VALUES ('"+username+"','"+placeName+"','"+remarks+"','"+landmark+"','"+landuseClass+"','"+date+"','"+shapeLocations+"','"+shapeType+"','true','"+image1+"', '"+image2+"' );");
      },
      error=>{setIsLoading(false);alert("Some error occurred")
        console.log('Insertion Error:',error)},
      success= async()=>{
        username=await AsyncStorage.getItem('mobile')
        console.log("username",username)
        const requestOptions = {
          method: 'POST',
          headers: { 'Accept': 'application/json',
              'Content-Type': 'application/json' },
              body:JSON.stringify({mobile:username,placeName:placeName,remarks:remarks,landmark:landmark,landuseClass:landuseClass,dateTime:date,locations:shapeLocations,shapeType:shapeType,image1:image1,image2:image2})
        
      };
      try { 
            
        fetch(
            url, requestOptions,100)
            .then((response) => 
                response.json())
                    .then(response => {
                        console.log("Message: ", 
                        response.Message);
                        if(response.Code==3){  
                          setIsLoading(false)
                        Alert.alert("Data Sent Successfully")
                        }
                        else{alert(response.Message)
                         }
                       
                    }               
                    )
                    .catch((error)=>{
                      setIsLoading(false)
                      Alert.alert("Some Error Occurred!")
                      db.transaction( async (tx)=>{
                        await tx.executeSql("DELETE FROM mapdb WHERE dateTime="+date+";");
                       },
                       error=>{
                        setIsLoading(false)
                       console.log('Insertion Error:',error)},
                       success=>{console.log("Delete Success",success)}
                       )
                      console.log(error)
                      setIsLoading(false)
                    })
                    
                  
                    
            }
    
    catch (error) {
        setIsLoading(false)
        Alert.alert("Some Error Occurred!");
        console.log(error)
        db.transaction( async (tx)=>{
          await tx.executeSql("DELETE FROM mapdb WHERE dateTime="+date+";");
         },
         error=>{
         console.log('Insertion Error:',error)},
         success=>{console.log("Delete Success",success)}
         )
    }
                
                
        console.log('Insertion Success:',success)})
        setIsLoading(false)
        
      }

      catch (error) {
        setIsLoading(false)
        console.log(error)
        Alert.alert("Some error occurred")
      };getData();
            }
}
            else{
        Alert.alert("All Fields are required.")
      }}
      else{
        Alert.alert("All Fields are required.")
      }
        
      }
    */


      const uploadToServer = async ()=>{
        let tmp=[]
        if(inputFields.length>4){
          if(inputFields[1].text.length>0 && inputFields[2].text.length>0 && inputFields[3].text.length>0 && inputFields[4].text.length>0){
             if(inputFields.length<5){
              Alert.alert("All Fields are required.")
            }
           
            else{
              setIsLoading(true)
              db.transaction((tx)=>{
                tx.executeSql(
                  "CREATE TABLE IF NOT EXISTS `mapdb` ( 'id' INTEGER PRIMARY KEY AUTOINCREMENT, `userName` VARCHAR(20) NULL , `placeName` VARCHAR(50) NULL , `remarks` VARCHAR(200) NULL , `landmark` VARCHAR(100) NULL , `landuseClass` VARCHAR(20) NULL , `dateTime` VARCHAR(50) NULL , `locations` VARCHAR(1000) NULL , `shapeType` VARCHAR(10) NULL, `sendToServer` VARCHAR(5) NULL, `image1` TEXT NULL, `image2` TEXT NULL );"
                )
              })
              username=await AsyncStorage.getItem("mobile")
      placeName=inputFields[1].text
      landmark=inputFields[2].text
      remarks=inputFields[3].text
      landuseClass=inputFields[4].text
      shapeLocations=JSON.stringify(locations)
      if(imagePath.length==2){
      image1=JSON.stringify(imagePath[0].path)
      image2=JSON.stringify(imagePath[1].path)}
      else{
        image1=JSON.stringify(imagePath[0].path)
      }
      today = new Date();
      date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds()
      //console.log("Place Name",placeName,"landmark",landmark,"remarks",remarks,"landuseClass",landuseClass,"shapeLocation",shapeLocations,"date",date)
      db.transaction( async (tx)=>{
        await tx.executeSql("INSERT INTO mapdb ('userName','placeName','remarks','landmark','landuseClass','dateTime','locations','shapeType', 'sendToServer', 'image1', 'image2') VALUES ('"+username+"','"+placeName+"','"+remarks+"','"+landmark+"','"+landuseClass+"','"+date+"','"+shapeLocations+"','"+shapeType+"','false','"+image1+"', '"+image2+"' );");
       },
       error=>{setIsLoading(false);alert("Some error occurred")
        console.log('Insertion Error:',error)})

        db.transaction((tx)=>{
          tx.executeSql("select * from mapdb ORDER BY id DESC LIMIT 1;",[],
  
          (tx,results)=>{
            let len=results.rows.length
            console.log("Row:",results.rows.item(0))
            let row=results.rows.item(0)
            console.log("Row:",tmp.length)
            requestOptions = {
              method: 'POST',
              headers: { 'Accept': 'application/json',
                  'Content-Type': 'application/json' },
                  body:JSON.stringify([results.rows.item(0)])
                  
          };
          try { 
                  
          fetch(
                url, requestOptions,100)
                .then((response) => 
                
                    response.json(),
                    )
                        .then(response => {
                          console.log(response)
                            console.log("Message: ", 
                            response.Message);
                            if(response.Code==3){
                              db.transaction((tx)=>{
                                tx.executeSql("update mapdb set sendToServer='true' WHERE id="+results.rows.item(0).id+";")
                              })
                              setIsLoading(false)
                              Alert.alert("Alert!", "Data sent to server successfully.", [
                               
                                { text: "OK", onPress: () => {navigation.dispatch(
                                  CommonActions.reset({
                                    index: 1,
                                    routes: [
                                      { name: 'Map' },
                                     
                                    ],
                                  })
                                );   
                                  
                  
                                  } }
                              ]);
                        
                             }
                            else{setIsLoading(false)
                            Alert.alert("Some Error Occurred")}})
        }
        catch (error) {
          setIsLoading(false)
            Alert.alert("Some Error Occurred!");
            console.log(error)
          
           
        }
            
          })
            })
            setData([tmp])
            
            

           
          }
          }
        }
      }
      

  
      const getData=async ()=>{
        try{
          db.transaction((tx)=>{
            tx.executeSql("SELECT * FROM mapdb",
            [],
            (tx,results)=>{
              var len=results.rows.length;
              //console.log("Rows:",len)
              for(let i=0;i<len;i++){
              //console.log("Row:",i," ",results.rows.item(i))
              
              }
            })
          })
        }
        catch (error) {
          console.log(error)
        }
      }

    return(
        <Animatable.View animation='zoomInUp' style={styles.centeredViewSave}>
        {isLoading ?
        <View style={{backgroundColor:'#ffffff',height:'100%',width:'100%',flexDirection:'column',justifyContent:'center'}}>
          <ActivityIndicator size={70} color="#4CAF50" style={{alignSelf:'center'}} />
        </View>:
    
        <View style={[styles.modalView]}>
          
        
         
           
          <ScrollView style={[styles.textInputView]}>   
 

      
         {attributes.map(({attr,placeHolder,name,maxLength,index})=>(
            <View key={inputIndex++} style={[styles.textInputView]}>
            <Text style={styles.fieldText}>{name}</Text>
            <TextInput  style={[styles.textInput]}
        placeholder={placeHolder}
        returnKeyLabel = {"next"}
        name={attr}
    
        onChangeText={text => {handleFormChange(index,text,attr)}}
        placeholderTextColor="#c2c3c4"
        maxLength={maxLength}
        multiline={false}
        keyboardType="text"
        ></TextInput>
        </View>
        
        ))}
       
    

        <View style={[styles.points,styles.card,{}]}>
          {locations.map(value=>(
            <View key={index++} style={{flexDirection:'row',padding:3}}>
              <Text style={{color:'#4CAF50',fontSize:16,}}>Point : </Text>
              <Text style={{color:'#4CAF50',fontSize:16}}>{Number((value.latitude).toFixed(6))}, </Text>
              <Text style={{color:'#4CAF50',fontSize:16}}>{Number((value.longitude).toFixed(6))}</Text> 
           </View>
          ))}
          
        </View>
        <View style={[styles.points,styles.card,{ flexDirection:'row',alignSelf:'center'}]}>
        
        <TouchableOpacity 
          onPress={() => {
          getLocation()
          if(imagePath.length==2){
            alert("Maximum 2 photos can be uploaded at a time.")
          }
          else if(gpsloc.accvalue==undefined || gpsloc.accvalue==0 || gpsloc.accvalue>30){
          alert("Accuracy of GPS is "+gpsloc.accvalue+"m. Please wait sometime for accuracy to improve. Ensure you are under open sky!")
        }
        else{ Alert.alert("Capture Photo","Capturing photo with accuracy "+gpsloc.accvalue+ ' m',
        [{ text: 'OK', onPress: () => {                      
          requestCameraPermission()
        }}])}
      }}
        style={[styles.card,styles.points,{alignItems:'flex-start',flexDirection:'row',width:'auto',height:'auto'}]}>
          
              <Ionicons 
              name='camera-outline'
              color='#4CAF50'
              size={22}
              
            />
            <Text style={{alignSelf:'center',paddingLeft:8,color:'#4CAF50',fontWeight: "bold"}}>Capture</Text>
            
        </TouchableOpacity>
        
        {imagePath.map(({path})=>(
          <View key={index++} style={{flexDirection:'row'}}>
          
        <Image  style={{borderWidth:1,borderColor:'#000000',width:50,height:50,marginLeft:8,alignSelf:'center'}}
        
        source={{uri:`data:image/jpeg;base64,${path}`}}></Image>
        <TouchableOpacity
        onPress={(e) =>{//console.log("Length before",imagePath.length)
                        
                      position=path.indexOf(e.target.value)
                        //console.log("Path",position)
                      imagePath.splice(position,1)
                        //console.log(imagePath)
                        //console.log("Length after",imagePath.length)
                        if(imagePath.length>=1){
                      setImagePath([{path:path}])
                      //console.log("Length after",imagePath.length)
                      }
                    else{setImagePath([])}
                    //console.log("Length after",imagePath.length)
                    }
                    
        }
        >
        <Icon 
              name='close'
              type='evilicon'
              color='#FF0000'
              size={22}
              
            />
        </TouchableOpacity>
        </View>
        ))}
        
      </View>

        
        
        </ScrollView>
          
          
        
        <View 
            
            style={{      
            
            alignSelf: 'center', //for align to center
            flexDirection:'row',
            height:50
                        
        }}>
         <TouchableOpacity

          style={[styles.buttonSave,styles.buttonServer,{backgroundColor:'#ffffff',marginRight:10}]}
          onPress={() =>{ validation()
            
          }}>
           <Ionicons 
              style={{paddingRight:5}} 
              name='download-outline'
              type='evilicon'
              color='#4CAF50'
              size={22}
              
            />
          <Text style={[styles.textStyle,{color:'#4CAF50'}]}>Save to Device</Text>
          </TouchableOpacity>

          <TouchableOpacity

          style={[styles.buttonSave,styles.buttonServer]}
          onPress={() => {  if(inputFields.length>4){
            if(inputFields[1].text.length>0 && inputFields[2].text.length>0 && inputFields[3].text.length>0 && inputFields[4].text.length>0){
              uploadToServer();}
              else{
          Alert.alert("All Fields are required.")
        }}
        else{
          Alert.alert("All Fields are required.")
        }}
            }
          >
          <Ionicons 
              style={{paddingRight:10}} 
              name='cloud-upload-outline'
              type='evilicon'
              color='#ffffff'
              size={22}
              
            />
          <Text style={[styles.textStyle]}>Send to Server</Text>
          </TouchableOpacity>
      </View>

          
        </View>}

        
        
      </Animatable.View>
    )
}
const styles= StyleSheet.create({
    
    
    
       centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor:'rgba(0, 0, 0, 0.5)'
      },
      modalView: {
        backgroundColor: "white",
        flexDirection:'column',
        alignItems: "center",
        padding:10,
        width:'100%',
        margin:10
        
      },
     
      
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize:18
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize:20
      },

      
      
      buttonSave:{
        borderRadius: 20,
        padding: 10,
        elevation: 10,
        margin:0,
        backgroundColor: "#4CAF50",
        flexDirection:'row',
        justifyContent:'center',
        alignSelf:'center'

      },
      buttonReset:{
        borderRadius: 20,
        padding: 10,        
        elevation: 2,
        color:'#4CAF50',
        margin:5,
        backgroundColor: "#ffffff",
        flexDirection:'column',
        justifyContent:'center',
        
      },
      buttonServer:{
        width:'auto'
      },
      centeredViewSave: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        
      
      },
      textInput:{
        height: 'auto',
        width:'100%',        
        borderWidth: 1,
        padding: 10,
        fontSize:16,
        borderRadius:10,
        backgroundColor:"white",
        color:"black",
        
      },
      fieldText: {
        textAlign: "left",
        fontSize:20,
        color:'#000000'
      },
      textInputView:{
        padding:5,
        width:'100%'
        
      },
      card: {
        backgroundColor: 'white',
        borderRadius: 8,
        width: '95%',
        alignSelf:'center',
        marginVertical: 10,
        padding:10
      },
      points:{
        backgroundColor: "white",
        borderRadius: 20,
        flexDirection:'column',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4
        },
        
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      }
    
    
   
  });