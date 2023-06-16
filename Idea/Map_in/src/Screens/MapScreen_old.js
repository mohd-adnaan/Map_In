import React,{ useEffect, useState } from 'react';
import { Text,RefreshControl, TextInput,Button, View,StyleSheet, Alert, Image, TouchableOpacity, ActivityIndicator,Dimensions,Modal,ScrollView,PermissionsAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView,{ MAP_TYPES, PROVIDER_DEFAULT, UrlTile,Marker,MapUrlTile, WMSTile, Polygon, Polyline} from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {attributes} from './attributes';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { openDatabase } from 'react-native-sqlite-storage';



export default function MapScreen({route,navigation}){
  
    const{url,type}=route.params;
    console.log(url,type)
    const { width, height } = Dimensions.get('window');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleLayer,setModalVisibleLayer]=useState(false);
    const [modalVisibleSave,setModalVisibleSave]=useState(false);
    //let url='https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms?service=WMS&tiled=true&version=1.1.1&request=GetMap&layers=india3&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG%3A900913&format=image%2Fjpeg'
    const [urlTemplate,setUrlTemplate]=useState(url)
    const [showButton,setShowButton]=useState(false)
    const [showPolygon,setShowPolygon]=useState(false)
    const [locations,setLocations]=useState([{}])
    const [drawPolygon,setDrawPolygon]=useState(false)
    const [drawPoint,setDrawPoint]=useState(false)
    const [showPoint,setShowPoint]=useState(false)
    const [drawLine,setDrawLine]=useState(false)
    const [showLine,setShowLine]=useState(false)
    const [zoomLevel,setZoomLevel]=useState(0);
    let [imagePath,setImagePath]=useState('')
    const [shapeType,setShapeType]=useState('')
    const db=openDatabase({name:'mapapp.db',location:'default'},
    function () {
      console.log('Success');
      },
      error=>{console.log('Error',error)}
           
      );


    const createTable=async ()=>{
      db.transaction((tx)=>{
        tx.executeSql(
          "CREATE TABLE `mapdb` ( `userName` VARCHAR(20) NULL , `placeName` VARCHAR(50) NULL , `remarks` VARCHAR(200) NULL , `landmark` VARCHAR(100) NULL , `landuseClass` VARCHAR(20) NULL , `dateTime` VARCHAR(50) NULL , `locations` VARCHAR(1000) NULL , `shapeType` VARCHAR(10) NULL );"
        )
      },
      error=>{console.log('Error:',error)}),
      success=>{console.log('Success:',success)}
    }  
    let inputFields=[];
    const handleFormChange = (index,text,attr) => {
      //console.log('index',index,'value',event.target.name)
      let data = [...inputFields];
      
    data[index]= {attr:attr,text:text,index:index}
       inputFields=data
       console.log(inputFields)
    }

    
    console.log(urlTemplate,type)
    

    const saveData = async () => {
      try {
        console.log('saveData')
        console.log(shapeType)
        await AsyncStorage.setItem(
          'inputFields',
          JSON.stringify(inputFields[1].text),
          )
          await AsyncStorage.setItem(
            'shapeType',
          shapeType
        );
    
        retrieveData();
      } catch (error) {
        console.log(error)
      }
    };

    const insertData = async () =>{
      let placeName=inputFields[1].text
      let landmark=inputFields[2].text
      let remarks=inputFields[3].text
      let landuseClass=inputFields[4].text
      let shapeLocations=JSON.stringify(locations)
      let today = new Date();
      let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
      console.log("Place Name",placeName,"landmark",landmark,"remarks",remarks,"landuseClass",landuseClass,"shapeLocation",shapeLocations,"date",date)

      try{
        await db.transaction( async (tx)=>{
       await tx.executeSql("INSERT INTO mapdb ('username','placeName','remarks','landmark','landuseClass','dateTime','locations','shapeType') VALUES ('adnan.jafri7','"+placeName+"','"+remarks+"','"+landmark+"','"+landuseClass+"','"+date+"','"+shapeLocations+"','"+shapeType+"');");
      },
      error=>{console.log('Error:',error)},
      success=>{console.log('Success:',success)})
        
      }
      catch (error) {
        console.log(error)
      }
    };

    const getData=async ()=>{
      try{
        db.transaction((tx)=>{
          tx.executeSql("SELECT * FROM mapdb",
          [],
          (tx,results)=>{
            var len=results.rows.length;
            console.log("Rows:",len)
            for(let i=0;i<len;i++){
            console.log("Row:",i," ",results.rows.item(i))
            
            }
          })
        })
      }
      catch (error) {
        console.log(error)
      }
    }
  
    const validation=()=>{
      if(inputFields.length>4){
        if(inputFields[1].text.length>0 && inputFields[2].text.length>0 && inputFields[3].text.length>0 && inputFields[4].text.length>0){
          createTable();insertData();getData();setModalVisibleSave(!modalVisibleSave)}
          else{
      Alert.alert("All Fields are required.")
    }}
    else{
      Alert.alert("All Fields are required.")
    }
      
    }
    const retrieveData = async () => {
      try {
        console.log('retrievData')
        const value = await AsyncStorage.getItem('inputFields');
        const value2 =await AsyncStorage.getItem('shapeType')
        if (value !== null) {
          // We have data!!
          console.log(value,value2)
          Alert.alert(value,value2)
        }
        else{
          Alert.alert("data not found")
        }
      } catch (error) {
        // Error retrieving data
      }
    };

  const sendData =async ()=>{
    console.log(inputFields[1])
            if(inputFields[1]===undefined){
              Alert.alert("Invalid Place Name")
            }
            else if(inputFields[1].text===""){
              Alert.alert("Invalid Place Name")
            }
            else{
            setModalVisibleSave(!modalVisibleSave);
            saveData()
          }
  };
    
    
    let index=0

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
            }}
          launchCamera(options,(response) => {
            console.log('Response = ', response);
            console.log('response', JSON.stringify(response));
            let res=(response.assets)
            console.log('image path',(res[0].uri))
            setImagePath(res[0].uri)
           
          })
            
            
            console.log('image path',ImagePath)
        } else {
          console.log("Camera permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    };
    
                    
                    let loc=1
    //const [locPolygon,setLocPolygon]=useState[{latitude:'',longitude:'',location:''}]
    
    
const LATITUDE = 19.7;
const LONGITUDE = 80.86;
const LATITUDE_DELTA = 20;
const LONGITUDE_DELTA = 30;
    //const mapLayer=[{url: 'https://tile.openstreetmap.de/{z}/{x}/{y}.png',        
    
        
      // }
        
        
    //]
    
    
    
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems:"center",        
          backgroundColor:"Transparent"               
        }}>
          <MapView
          
      region={{
        latitude:LATITUDE,
        longitude:LONGITUDE,
        latitudeDelta:LATITUDE_DELTA,
        longitudeDelta:LONGITUDE_DELTA
      }}
        provider={undefined}
        mapType={"none"}
        onMapLoaded={()=>{setShowButton(true)}}
        showsUserLocation={true}
        style={[styles.map]}
        showsTraffic={false}
        zoomEnabled={true}
        showsCompass={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        loadingEnabled={true}
        showsBuildings={true}
        minZoomLevel={zoomLevel}
        onPress={(e) => {
          
          
          //Alert.alert(latitude)

          if(drawPolygon){
          console.log(locations)
          let ad=(e.nativeEvent.coordinate)
          let latitude=(ad.latitude)
          let longitude=(ad.longitude)          
         setLocations([...locations,{latitude:latitude,longitude:longitude,location:loc}])
         loc++
         console.log(locations.length);         
         setShowPolygon(true)
         setShapeType('Polygon')}

         if(drawPoint){
          console.log(locations)
          let ad=(e.nativeEvent.coordinate)
          let latitude=(ad.latitude)
          let longitude=(ad.longitude)          
         setLocations([...locations,{latitude:latitude,longitude:longitude,location:loc}])
         loc++
         console.log(locations.length);         
         setShowPoint(true)
         setShapeType('Point')}

         if(drawLine){
          console.log(locations)
          let ad=(e.nativeEvent.coordinate)
          let latitude=(ad.latitude)
          let longitude=(ad.longitude)          
         setLocations([...locations,{latitude:latitude,longitude:longitude,location:loc}])
         loc++
         console.log(locations.length);         
         setShowLine(true)
         setShapeType('Line')}

         
          
          
        }}
          

        >{type==="default" ?
                 <WMSTile
//urlTemplate="https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms?service=WMS&tiled=false&version=1.1.0&request=GetMap&layers=india3&bbox=60,6.0,97,39&width=256&height=256&srs=EPSG%3A4326&format=image%2Fjpeg"
//urlTemplate="https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms?service=WMS&tiled=true&version=1.1.1&request=GetMap&layers=india3&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG%3A900913&format=image%2Fjpeg"
urlTemplate={url}
zIndex={1}
epsgSpec={"EPSG:900913"}
/>
:null}

{type==="osm" ?
                 <UrlTile
//urlTemplate="https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms?service=WMS&tiled=false&version=1.1.0&request=GetMap&layers=india3&bbox=60,6.0,97,39&width=256&height=256&srs=EPSG%3A4326&format=image%2Fjpeg"
//urlTemplate="https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms?service=WMS&tiled=true&version=1.1.1&request=GetMap&layers=india3&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG%3A900913&format=image%2Fjpeg"
urlTemplate={url}
zIndex={1}
epsgSpec={"EPSG:4326"}
/>
:null}
{type==="satellite" ?
                 <UrlTile
//urlTemplate="https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms?service=WMS&tiled=false&version=1.1.0&request=GetMap&layers=india3&bbox=60,6.0,97,39&width=256&height=256&srs=EPSG%3A4326&format=image%2Fjpeg"
//urlTemplate="https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms?service=WMS&tiled=true&version=1.1.1&request=GetMap&layers=india3&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG%3A900913&format=image%2Fjpeg"
urlTemplate={url}
zIndex={1}
epsgSpec={"EPSG:900913"}
/>
:null}

        {showPolygon ?

        locations.map(marker=>(
          <View key={Math.random()}>
          <Marker  key={Math.random()} coordinate={{latitude:marker.latitude,longitude:marker.longitude}}/>
          <Polygon key={Math.random()} coordinates={locations} fillColor={'#000000'} zIndex={5}/>
          </View>
          
        ))
        : null}
         {showPoint ?

locations.map(marker=>(
  <View key={Math.random()}>
  <Marker  key={Math.random()} coordinate={{latitude:marker.latitude,longitude:marker.longitude}}/>
  
  </View>
  
))
: null}

{showLine ?

locations.map(marker=>(
  <View key={Math.random()}>
  <Marker  key={Math.random()} coordinate={{latitude:marker.latitude,longitude:marker.longitude}}/>
  <Polyline key={Math.random()} coordinates={locations} fillColor={'#000000'} zIndex={5}/>
  
  </View>
  
))
: null}

      </MapView>
  
              {showButton ? 
      <View
        
        style={{
            position: 'absolute',//use absolute position to show button on top of the map
            top:'15%',
            padding:12,
            alignSelf: 'flex-end' //for align to right
        }}
    >
        <TouchableOpacity
        onPress={() => setModalVisible(!modalVisible)}
        style={{backgroundColor:"#ffffff",padding:8,marginBottom:15,shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5}}>
        <Icon
  name='pencil-outline'
  type='evilicon'
  color='#000000'
  size={22}
  
/>

          </TouchableOpacity>
      
          <TouchableOpacity
        onPress={() => setModalVisibleLayer(!modalVisibleLayer)}
        style={{backgroundColor:"#ffffff",padding:8,shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5}}>
        <Icon
  name='layers-outline'
  type='evilicon'
  color='#000000'
  size={22}
  
/>

          </TouchableOpacity>
    </View>
    : null}
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
        <TouchableOpacity
            style={[styles.buttonCloseModal]}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Icon
  name='close'
  type='evilicon'
  color='#000000'
  size={22}
  
/>
          </TouchableOpacity>
        <View style={styles.modalView}>
        
          <Text style={styles.modalText}>Draw On Map</Text>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => {setModalVisible(!modalVisible);setDrawPoint(true);setDrawLine(false);setDrawPolygon(false);setShowPoint(true);setShowLine(false);setShowPolygon(false);setLocations([]);setZoomLevel(0)}}
          >
            <Text style={styles.textStyle}>Mark Points</Text>
          </TouchableOpacity>
          <TouchableOpacity

            style={[styles.button, styles.buttonClose]}
            onPress={() => {setModalVisible(!modalVisible);setDrawLine(true);setDrawPoint(false);setDrawPolygon(false);setShowPoint(true);setShowLine(true);setShowPolygon(false);setLocations([])}}
          >
            <Text style={styles.textStyle}>Draw Lines</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => {setModalVisible(!modalVisible);setDrawPolygon(true);setDrawLine(false);setDrawPoint(false);setShowPoint(true);setShowLine(false);setShowPolygon(true);setLocations([])}}
          >
            <Text style={styles.textStyle}>Draw Polygon</Text>
          
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleLayer}
        >
        <View style={styles.centeredView}>
        <TouchableOpacity
            style={[styles.buttonCloseModal]}
            onPress={() => setModalVisibleLayer(!modalVisibleLayer)}
          >
            <Icon
  name='close'
  type='evilicon'
  color='#000000'
  size={22}
  
/>
          </TouchableOpacity>
        <View style={styles.modalViewLayer}>
        <View style={{flexDirection:'column',justifyContent:'center'}}>
          
          <TouchableOpacity
            style={[styles.buttonLayer]}
            onPress={() => {setModalVisibleLayer(!modalVisibleLayer);console.log(urlTemplate);navigation.navigate('Map',{
              url:'https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms?service=WMS&tiled=true&version=1.1.1&request=GetMap&layers=india3&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG%3A900913&format=image%2Fjpeg',
              type:'default'
         })
         }}
          >
            <Image
        style={styles.layerImage}
        source={require('../../assets/images/default.png')}
      />            
          </TouchableOpacity>
          <Text style={styles.textStyleLayer}>Default</Text>
          </View>
          <View style={{flexDirection:'column',justifyContent:'center'}}>
          
          <TouchableOpacity
            style={[styles.buttonLayer]}
            onPress={() => {setModalVisibleLayer(!modalVisibleLayer);console.log(urlTemplate);navigation.navigate('Map',{
              url:'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/15/13663/23413',
              //url:'https://bhuvan-ras1.nrsc.gov.in/tilecache/tilecache.py?service=WMS&tiled=true&version=1.0.0&request=GetMap&layers=Bhuvan_Lite_Sat_V2&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG%3A900913&format=image%2Fpng',
              type:'satellite',
              
         })
         }}
          >
            <Image
        style={styles.layerImage}
        source={require('../../assets/images/satellite.png')}
      />            
          </TouchableOpacity>
          <Text style={styles.textStyleLayer}>Satellite</Text>
          </View>
          <View style={{flexDirection:'column',justifyContent:'center'}}>
          
          <TouchableOpacity
            style={[styles.buttonLayer]}
            onPress={() => {setModalVisibleLayer(!modalVisibleLayer);console.log(urlTemplate);navigation.navigate('Map',{
              url:'https://tile.openstreetmap.de/{z}/{x}/{y}.png',
              type:'osm'
         })
         }}
          >
            <Image
        style={styles.layerImage}
        source={require('../../assets/images/osm.png')}
      />            
          </TouchableOpacity>
          <Text style={styles.textStyleLayer}>Open Map</Text>
          </View>
         
        </View>
      </View>
    </Modal>




      {drawPolygon  ?   //to draw and show polygon
      <View 
            
            style={{
            position: 'absolute',//use absolute position to show button on top of the map
            top:'80%',
            padding:12,
            alignSelf: 'center', //for align to center
            flexDirection:'row',
            backgroundColor:'#ffffff',
            borderRadius:10,
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
            
        }}>
         <TouchableOpacity

          style={[styles.buttonReset]}
          onPress={() => {setLocations([]);setShowPolygon(false);setDrawPolygon(false);Alert.alert( "Alert",
          "Polygon has been reset. Click on pencil icon to draw the polygon again.",)}}
          >
          <Text style={[styles.textStyle,{color:'#4CAF50'}]}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity

          style={[styles.buttonSave]}
          onPress={() => {if(locations.length<3){Alert.alert("Please mark at least 3 points.")}else{setModalVisibleSave(true)}}}
          >
          <Text style={[styles.textStyle]}>Save</Text>
          </TouchableOpacity>
      </View>
      : null}
    {drawPolygon ?
    <View style={{
            position: 'absolute',//use absolute position to show button on top of the map
            top:'10%',
            padding:12,
            alignSelf: 'center', //for align to center
            flexDirection:'row',
            backgroundColor:'#ffffff',
            borderRadius:10,
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
            
        }}>
          <Text style={[styles.textStyle,{color:'#4CAF50'}]}>Draw the Polygon</Text>
         
      </View>
      : null}

{drawPoint  ?
      <View 
            
            style={{
            position: 'absolute',//use absolute position to show button on top of the map
            top:'80%',
            padding:12,
            alignSelf: 'center', //for align to center
            flexDirection:'row',
            backgroundColor:'#ffffff',
            borderRadius:10,
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
            
        }}>
         <TouchableOpacity

          style={[styles.buttonReset]}
          onPress={() => {setLocations([]);setShowPoint(false);setDrawPoint(false);Alert.alert( "Alert",
          "Point Marker has been reset. Click on pencil icon to mark the point again.",)}}
          >
          <Text style={[styles.textStyle,{color:'#4CAF50'}]}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity

          style={[styles.buttonSave]}
          onPress={() => {if(locations.length<1){Alert.alert("Please mark at least 1 point.")}else{setModalVisibleSave(true)}}}
          >
          <Text style={[styles.textStyle]}>Save</Text>
          </TouchableOpacity>
      </View>
      : null}
    {drawPoint ?
    <View style={{
            position: 'absolute',//use absolute position to show button on top of the map
            top:'10%',
            padding:12,
            alignSelf: 'center', //for align to center
            flexDirection:'row',
            backgroundColor:'#ffffff',
            borderRadius:10,
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
            
        }}>
          <Text style={[styles.textStyle,{color:'#4CAF50'}]}>Mark the Points</Text>
         
      </View>
      : null}

{drawLine  ?
      <View 
            
            style={{
            position: 'absolute',//use absolute position to show button on top of the map
            top:'80%',
            padding:12,
            alignSelf: 'center', //for align to center
            flexDirection:'row',
            backgroundColor:'#ffffff',
            borderRadius:10,
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
            
        }}>
         <TouchableOpacity

          style={[styles.buttonReset]}
          onPress={() => {setLocations([]);setShowLine(false);setDrawLine(false);Alert.alert( "Alert",
          "Lines Marker has been reset. Click on pencil icon to draw the Line again.",)}}
          >
          <Text style={[styles.textStyle,{color:'#4CAF50'}]}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity

          style={[styles.buttonSave]}
          onPress={() => {if(locations.length<2){Alert.alert("Please mark at least 2 points.")}else{setModalVisibleSave(true)}}}
          >
          <Text style={[styles.textStyle]}>Save</Text>
          </TouchableOpacity>
      </View>
      : null}
    {drawLine ?
    <View style={{
            position: 'absolute',//use absolute position to show button on top of the map
            top:'10%',
            padding:12,
            alignSelf: 'center', //for align to center
            flexDirection:'row',
            backgroundColor:'#ffffff',
            borderRadius:10,
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
            
        }}>
          <Text style={[styles.textStyle,{color:'#4CAF50'}]}>Draw the Lines</Text>
         
      </View>
      : null}

{modalVisibleSave ?
<View>

<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleSave}
        onRequestClose={() => {
          
          setModalVisibleSave(!modalVisibleSave);
        }}>
        <View style={styles.centeredViewSave}>
        <TouchableOpacity
            style={[styles.buttonCloseModal]}
            onPress={() => setModalVisibleSave(!modalVisibleSave)}
          >
            <Icon
  name='close'
  type='evilicon'
  color='#000000'
  size={22}
  
/>
          </TouchableOpacity>
        <View style={styles.modalView}>
          
        
          <Text style={styles.modalText}>Fill the Details</Text>
           
          <ScrollView key={index++} style={styles.textInputView}>
          {attributes.map(({attr,placeHolder,name,maxLength,index})=>(
            <View key={index++} style={styles.textInputView}>
            <Text style={styles.fieldText}>{name}</Text>
            {console.log(placeHolder)}
            <TextInput key={index}  style={[styles.textInput]}
        placeholder={placeHolder}
        returnKeyLabel = {"next"}
        name={attr}
        onChangeText={text => handleFormChange(index,text,attr)}
        placeholderTextColor="#c2c3c4"
        maxLength={maxLength}
        multiline={false}
        keyboardType="text"
        ></TextInput>
        </View>
        ))}

        <View style={[styles.points,styles.card,{alignItems:'center'}]}>
          {locations.map(value=>(
            <View key={index++} style={{flexDirection:'row',padding:3}}>
              <Text style={{color:'#4CAF50',fontSize:13,}}>Point {index}: </Text>
              <Text style={{color:'#4CAF50',fontSize:13}}>{value.latitude}, </Text>
              <Text style={{color:'#4CAF50',fontSize:13}}>{value.longitude}</Text> 
           </View>
          ))}
        </View>

        <View style={[{width:'auto',height:'auto', flexDirection:'row', alignSelf:'flex-start',marginLeft:10}]}>
        
          <TouchableOpacity 
          onPress={() => requestCameraPermission()}
          style={[styles.card,styles.points,{alignItems:'flex-start',flexDirection:'row',width:'auto',height:'auto'}]}>
            
                <Icon 
                name='camera-outline'
                type='evilicon'
                color='#4CAF50'
                size={22}
                
              />
              <Text style={{alignSelf:'center',paddingLeft:8,color:'#4CAF50',fontWeight: "bold"}}>Capture</Text>
              
          </TouchableOpacity>
          <Image style={{borderWidth:1,borderColor:'#000000',width:50,height:50,marginLeft:8,alignSelf:'center'}}
          
          source={{uri:imagePath}}></Image>
          {console.log('image',imagePath)}
          
        </View>
        
        </ScrollView>
          
          
        
        <View 
            
            style={{      
            padding:12,
            alignSelf: 'center', //for align to center
            flexDirection:'row',
            backgroundColor:'#ffffff',
            borderRadius:10,
                        
        }}>
         <TouchableOpacity

          style={[styles.buttonReset,styles.buttonServer]}
          onPress={() =>{validation()}}>
          <Text style={[styles.textStyle,{color:'#4CAF50'}]}>Save to Device</Text>
          </TouchableOpacity>

          <TouchableOpacity

          style={[styles.buttonSave,styles.buttonServer]}
          onPress={() => {
            validation()
           
          }}
          >
          <Text style={[styles.textStyle]}>Send To Server</Text>
          </TouchableOpacity>
      </View>

          
        </View>

        
        
      </View>
    </Modal>

    </View>
: null}



      </View>  
  
      
      
    )
   
    
  }
  

  const styles= StyleSheet.create({
    
    
    touchable:{
      width: 350,
      height:40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#4CAF50',
      margin:10,
      borderRadius:10
  
    },
    map: {
        width: '100%',
        height: '120%',
        marginTop:'50%'

       },
       centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
      },
      modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 5,
        flexDirection:'column',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 10,
        width:200,
        elevation: 2,
        margin:10,
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#4CAF50",
        flexDirection:'column',
        justifyContent:'center'
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize:20
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize:20
      },
      buttonCloseModal:{
        backgroundColor:'#ffffff',
        borderRadius:10,
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        padding:5
      },
      modalViewLayer: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        flexDirection:'row',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      layerImage:{
        width:70,
        height:70,
        borderWidth:1,
        borderRadius: 10,
        borderColor:'#000000',
        elevation: 2,
        margin:12,
      },
      textStyleLayer: {
        color: "#000000",
        fontWeight: "bold",
        textAlign: "center",
        fontSize:16
      },
      buttonSave:{
        borderRadius: 20,
        padding: 10,
        width:100,
        elevation: 2,
        margin:10,
        backgroundColor: "#4CAF50",
        flexDirection:'column',
        justifyContent:'center'

      },
      buttonReset:{
        borderRadius: 20,
        padding: 10,
        width:100,
        elevation: 2,
        color:'#4CAF50',
        margin:10,
        backgroundColor: "#ffffff",
        flexDirection:'column',
        justifyContent:'center',
        borderColor:'4CAF50',
      },
      buttonServer:{
        width:'auto'
      },
      centeredViewSave: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding:25
      
      },
      textInput:{
        height: 'auto',
        width:'auto',        
        borderWidth: 1,
        padding: 10,
        fontSize:16,
        borderRadius:10,
        backgroundColor:"white",
        color:"black"
      },
      fieldText: {
        textAlign: "left",
        fontSize:20,
        color:'#000000'
      },
      textInputView:{
        padding:5,
        
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