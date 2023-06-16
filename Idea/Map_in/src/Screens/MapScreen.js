import React,{ useEffect, useState,useRef } from 'react';
import { Text,RefreshControl, TextInput,Button, View,StyleSheet, Alert, Image, TouchableOpacity,BackHandler, ActivityIndicator,Dimensions,Modal,ScrollView,PermissionsAndroid} from 'react-native';

import MapView,{AnimatedRegion, MAP_TYPES, PROVIDER_DEFAULT, UrlTile,Marker,MapUrlTile, WMSTile, Polygon, Polyline} from 'react-native-maps';

import Icon from 'react-native-vector-icons/Ionicons';

import {attributes} from './attributes';

import { openDatabase } from 'react-native-sqlite-storage';
import RNLocation from 'react-native-location';
import NetInfo  from "@react-native-community/netinfo";
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import Geolocation from '@react-native-community/geolocation';


export default function MapScreen({route,navigation}){
  
  
  RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
    interval: 10000,
    fastInterval: 5000,
  })
    .then((data) => {
      // The user has accepted to enable the location services
      // data can be :
      //  - "already-enabled" if the location services has been already enabled
      //  - "enabled" if user has clicked on OK button in the popup
    })
    .catch((err) => {
      // The user has not accepted to enable the location services or something went wrong during the process
      // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
      // codes :
      //  - ERR00 : The user has clicked on Cancel button in the popup
      //  - ERR01 : If the Settings change are unavailable
      //  - ERR02 : If the popup has failed to open
      //  - ERR03 : Internal error
    });
    const [geolocation, setGeolocation] = React.useState({
      latitude: 0,
      longitude: 0,
      altitude: 0,
      heading: 0,
      speed: 0,
      accuracy:0
});
  
    const{url,type}=route.params;
    //console.log(url,type)
    const { width, height } = Dimensions.get('window');
    const [initialRegion,setInitialRegion]=useState()
    const [userRegion,setUserRegion]=useState([{}]);
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
    let [imagePath,setImagePath]=useState([])
    const [shapeType,setShapeType]=useState('')
    const [IsOffline,setIsOffline]=useState(false)
    let position=0
    let image1=''
    let image2=''
   
      let placeName=""
      let landmark=undefined
      let remarks=undefined
      let landuseClass=undefined
      let shapeLocations=""
      let today = ""
      let date = ""
    
    const db=openDatabase({name:'mapapp.db',location:'default'},
    function () {
      console.log('DB Connection Success');
      },
      error=>{console.log('Error',error)}
           
      );

      const getCurrentLocation=()=> {
        Geolocation.watchPosition(
            position => {
            let region = {
                    latitude: parseFloat(position.coords.latitude),
                    longitude: parseFloat(position.coords.longitude),
                    latitudeDelta: 5,
                    longitudeDelta: 5
                };
                setInitialRegion(region)
                
            },
            error => console.log(error),
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000
            }
        );
    }
      React.useEffect(() => {
        const watchId = Geolocation.watchPosition((position) => {
          setGeolocation(position.coords);
          console.log(position.coords)
          
          setUserRegion([{latitude:parseFloat(position.coords.latitude),longitude:parseFloat(position.coords.longitude)}])          
        },
        {
          showLocationDialog: true,
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
          distanceFilter: 0
        });
        return () => Geolocation.clearWatch(watchId);
      }, []);

      useEffect(() => {
        getCurrentLocation()
      
          
      
        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
          const offline = !(state.isConnected && state.isInternetReachable);
          console.log("offline:",offline)
          setIsOffline(offline);
        });
      
      
        return () => removeNetInfoSubscription();
      }, []);

      const mapRef = useRef();

      
      

     

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
    
    let index=0

   

    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "App Location Permission",
            message:"App needs access to your location ",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Location permission given");
          
          
        } else {
          Alert.alert("You have denied the permission. App needs the location permission to work.")
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
          
                 
                        
        }}>
          {IsOffline ? alert("No Internet Connection!")
          :
          
       

          
        
          <MapView
          
          
      region={{
        latitude:LATITUDE,
        longitude:LONGITUDE,
        latitudeDelta:LATITUDE_DELTA,
        longitudeDelta:LONGITUDE_DELTA
      }}
      
        provider={undefined}
        mapType={"none"}
        ref={mapRef}
        

        
        onMapLoaded={()=>{setShowButton(true); requestLocationPermission();}}
        showsUserLocation={true}
        style={[styles.map]}
        showsTraffic={false}
        zoomEnabled={true}
        showsCompass={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        loadingEnabled={true}
        //onMapReady={goToInitialLocation()}
        
  
        showsBuildings={true}
        onPress={(e) => {
          
          
          //Alert.alert(latitude)

          if(drawPolygon){
          console.log(locations)
          if(locations.length<15){
          let ad=(e.nativeEvent.coordinate)
          let latitude=(ad.latitude)
          let longitude=(ad.longitude)          
         setLocations([...locations,{latitude:latitude,longitude:longitude}])
         loc++
        // console.log(locations.length);         
         setShowPolygon(true)
         setShapeType('Polygon')}
        else{Alert.alert("Maximum 15 positions are allowed.")}}

         if(drawPoint){
          //console.log(locations)
          let ad=(e.nativeEvent.coordinate)
          let latitude=(ad.latitude)
          let longitude=(ad.longitude)          
         setLocations([{latitude:latitude,longitude:longitude}])
         loc++
         //console.log(locations.length);         
         setShowPoint(true)
         setShapeType('Point')}

         if(drawLine){
          //console.log(locations)
          if(locations.length<15){
          let ad=(e.nativeEvent.coordinate)
          let latitude=(ad.latitude)
          let longitude=(ad.longitude)          
         setLocations([...locations,{latitude:latitude,longitude:longitude}])
         loc++
        // console.log(locations.length);         
         setShowLine(true)
         setShapeType('Line')}
        else{
          Alert.alert("Maximum 15 positions are allowed.")
        }}

         
          
          
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
}

      {showButton?
      <View  style={{
        position: 'absolute',//use absolute position to show button on top of the map
        top:'80%',
        padding:5,        
        backgroundColor: '#ffffff',
        opacity:0.7,
         //for align to right
    }} >
      <Text style={{color:'#000000'}}>{Number((geolocation.latitude).toFixed(4))}, {Number((geolocation.longitude).toFixed(4))}, Acc: {Math.floor( geolocation.accuracy )} m </Text>
      

      </View>:null}
  
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
        animationType="fade"
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
            onPress={() => {setModalVisibleLayer(!modalVisibleLayer);navigation.navigate('Map',{
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
          <Text style={styles.textStyleLayer}>Bhuvan</Text>
          </View>
          <View style={{flexDirection:'column',justifyContent:'center'}}>
          
          <TouchableOpacity
            style={[styles.buttonLayer]}
            onPress={() => {setModalVisibleLayer(!modalVisibleLayer);navigation.navigate('Map',{
              url:'https://a.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg?access_token=pk.eyJ1Ijoib3BlbnN0cmVldG1hcCIsImEiOiJja2w5YWt5bnYwNjZmMnFwZjhtbHk1MnA1In0.eq2aumBK6JuRoIuBMm6Gew',
              //url:'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}',
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
            onPress={() => {setModalVisibleLayer(!modalVisibleLayer);navigation.navigate('Map',{
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
          <Text style={styles.textStyleLayer}>OSM</Text>
          </View>
         
        </View>
      </View>
    </Modal>




      {drawPolygon  ?   //to draw and show polygon
      <View 
            
            style={{
            position: 'absolute',//use absolute position to show button on top of the map
            top:'60%',
            
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
          //onPress={() => {if(locations.length<3){Alert.alert("Please mark at least 3 points.")}else{setModalVisibleSave(true)}}}
          onPress={()=>{if(locations.length<3){Alert.alert("Please mark at least 3 points.")}else{navigation.navigate('FormScreen',{locations:locations,shapeType:shapeType})}}}
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
            top:'60%',
            
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
          onPress={() => {if(locations.length<1){Alert.alert("Please mark at least 1 point.")}else{navigation.navigate('FormScreen',{locations:locations,shapeType:shapeType})}}}
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
          <Text style={[styles.textStyle,{color:'#4CAF50'}]}>Mark the Point</Text>
         
      </View>
      : null}

{drawLine  ?
      <View 
            
            style={{
            position: 'absolute',//use absolute position to show button on top of the map
            top:'60%',
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
          onPress={() => {if(locations.length<2){Alert.alert("Please mark at least 2 points.")}else{navigation.navigate('FormScreen',{locations:locations,shapeType:shapeType})}}}
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
          <Text style={[styles.textStyle,{color:'#4CAF50'}]}>Draw the Line</Text>
         
      </View>
      : null}

{modalVisibleSave ?
<View>

<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleSave}
        >
        <View style={styles.centeredViewSave}>
        <TouchableOpacity
            style={[styles.buttonCloseModal]}
            onPress={() => {setModalVisibleSave(!modalVisibleSave);setImagePath([]);inputFields=[]}}
          >
            <Icon
  name='close'
  type='evilicon'
  color='#000000'
  size={22}
  
/>
          </TouchableOpacity>
        <View style={styles.modalView}>
          
        
          <Text style={styles.modalText}>Capture Photos</Text>
           
          <ScrollView key={Math.random()} style={styles.textInputView}>
          <View style={[styles.points,styles.card,{ flexDirection:'row',alignSelf:'center'}]}>
        
        <TouchableOpacity 
        onPress={() => {
          getLocation();
          if(imagePath.length==2){
            alert("Maximum 2 photos can be uploaded at a time.")
          }
          else if(gpsloc.accvalue==undefined || gpsloc.accvalue==0 || gpsloc.accvalue>10000){
          alert("Accuracy of GPS is "+gpsloc.accvalue+"m. Pleasex wait sometime for accuracy to improve. Ensure you are under open sky!")
        }
        else{ Alert.alert("Capture Photo","Capturing photo with accuracy "+gpsloc.accvalue+ ' m',
        [{ text: 'OK', onPress: () => {                      
          requestCameraPermission()
        }}])}
      }}
        style={[styles.card,styles.points,{alignItems:'flex-start',flexDirection:'row',width:'auto',height:'auto'}]}>
          
              <Icon 
              name='camera-outline'
              type='evilicon'
              color='#4CAF50'
              size={22}
              
            />
            <Text style={{alignSelf:'center',paddingLeft:8,color:'#4CAF50',fontWeight: "bold"}}>Capture</Text>
            
        </TouchableOpacity>
        {console.log("Image Path")}
        {imagePath.map(({path})=>(
          <View key={index++} style={{flexDirection:'row'}}>
        <Image  style={{borderWidth:1,borderColor:'#000000',width:50,height:50,marginLeft:8,alignSelf:'center'}}
        
        source={{uri:`data:image/jpeg;base64,${path}`}}></Image>
        <TouchableOpacity
        onPress={(e) =>{console.log("Length before",imagePath.length)
                        
                      position=path.indexOf(e.target.value)
                        console.log("Path",position)
                      imagePath.splice(position,1)
                        //console.log(imagePath)
                        console.log("Length after",imagePath.length)
                        if(imagePath.length>=1){
                      setImagePath([{path:path}])
                      console.log("Length after",imagePath.length)}
                    else{setImagePath([])}
                    console.log("Length after",imagePath.length)}
                    
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

     

      <Text style={styles.modalText}>Fill the details</Text>
          {attributes.map(({attr,placeHolder,name,maxLength,index})=>(
            <View  key={Math.random()} style={[styles.textInputView]}>
            <Text style={styles.fieldText}>{name}</Text>
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
              <Text style={{color:'#4CAF50',fontSize:13,}}>Point : </Text>
              <Text style={{color:'#4CAF50',fontSize:13}}>{value.latitude}, </Text>
              <Text style={{color:'#4CAF50',fontSize:13}}>{value.longitude}</Text> 
           </View>
          ))}
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
          onPress={() =>{ sendToServer()
            
          }}>
          <Text style={[styles.textStyle,{color:'#4CAF50'}]}>Save to Device</Text>
          </TouchableOpacity>
          <TouchableOpacity
          style={[styles.buttonSave,styles.buttonServer]}
          onPress={() => {sendToServer()}
            }
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
        

       },
       centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor:'rgba(0, 0, 0, 0.5)'
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
        margin:5,
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
        margin:5,
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