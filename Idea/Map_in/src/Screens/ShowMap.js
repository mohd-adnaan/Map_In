import React,{ useEffect, useState,useRef } from 'react';
import { Text, View,StyleSheet, Image, TouchableOpacity,BackHandler,Modal,} from 'react-native';
import MapView,{ MAP_TYPES, PROVIDER_DEFAULT, UrlTile,Marker,MapUrlTile, WMSTile, Polygon, Polyline} from 'react-native-maps';

import Icon from 'react-native-vector-icons/Ionicons';

import { openDatabase } from 'react-native-sqlite-storage';

export default function ShowMap({navigation,route}){
    const db=openDatabase({name:'mapapp.db',location:'default'},
    function () {
      console.log('DB Connection Success');
      },
      error=>{console.log('Error',error)}
           
      );
     


      const mapRef = useRef();
      useEffect(() => {
        if (mapRef.current) {          
          mapRef.current.fitToSuppliedMarkers(loc.map(({ _id }) => _id));
        }
      }, [loc]);
    const{shapeType,location,name,landuseClass,url,type}=route.params;
    console.log(location)
    const [loc,setLoc]=useState(JSON.parse(location))
      console.log("location",typeof(loc))

      
      useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          setLoc(JSON.parse(location))
          
          // The screen is focused
          // Call any action
        });
    
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
      }, [navigation]);

      
      
    
    const [showButton,setShowButton]=useState(false)
    const [modalVisibleLayer,setModalVisibleLayer]=useState(false)
    

    const LATITUDE = 19.7;
const LONGITUDE = 80.86;
const LATITUDE_DELTA = 20;
const LONGITUDE_DELTA = 30;

    return(
      <View>
        <MapView
        ref={mapRef}
          
      region={{
        latitude:LATITUDE,
        longitude:LONGITUDE,
        latitudeDelta:LATITUDE_DELTA,
        longitudeDelta:LONGITUDE_DELTA
      }}
        provider={undefined}
        mapType={"none"}
        style={[styles.map]}
        onMapLoaded={()=>{setShowButton(true);mapRef.current.fitToSuppliedMarkers(loc.map(({ _id }) => _id));}}
        showsUserLocation={true}
        showsTraffic={false}
        zoomEnabled={true}
        showsCompass={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        loadingEnabled={true}
        showsBuildings={true}
        
        
        >
            {type==="default" ?
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


        

          <View>
          {shapeType=="Point" ?         
          loc.map(marker=>(
          <View key={Math.random()}>
          <Marker  title={name} description={landuseClass} identifier={marker._id}
          key={Math.random()} coordinate={{latitude:marker.latitude,longitude:marker.longitude}}/>
          <Polyline key={Math.random()} coordinates={loc} strokeWidth={5}  zIndex={5}/>
          </View>
          
          ))
          :null}
          {shapeType=="Line" ?
          loc.map(marker=>(
          <View key={Math.random()}>
          <Marker  title={name} description={landuseClass} identifier={marker._id} 
          key={Math.random()} coordinate={{latitude:marker.latitude,longitude:marker.longitude}}/>
          <Polyline key={Math.random()} coordinates={loc} strokeWidth={5}  zIndex={5}/>
          </View>
          
          ))
          :null}
          {shapeType=="Polygon" ?
          loc.map(marker=>(
          <View key={Math.random()}>
          <Marker  title={name} description={landuseClass} identifier={marker._id}
          key={Math.random()} coordinate={{latitude:marker.latitude,longitude:marker.longitude}}/>
          <Polygon key={Math.random()} coordinates={loc} strokeWidth={5}  zIndex={5}/>
          </View>
          )):null}
          </View>
          
  
          
          
    
        

        </MapView>
        {showButton ? 
      <View
        
        style={{
            position: 'absolute',//use absolute position to show button on top of the map
            top:'10%',
            padding:12,
            alignSelf: 'flex-end' //for align to right
        }}
    >
      
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
            onPress={() => {setModalVisibleLayer(!modalVisibleLayer);navigation.navigate('ShowMap',{
              url:'https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms?service=WMS&tiled=true&version=1.1.1&request=GetMap&layers=india3&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG%3A900913&format=image%2Fjpeg',
              type:'default',
              shapeType:shapeType,
              landuseClass:landuseClass,
              name:name,
              location:location
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
            onPress={() => {setModalVisibleLayer(!modalVisibleLayer);navigation.navigate('ShowMap',{
              url:'https://a.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg?access_token=pk.eyJ1Ijoib3BlbnN0cmVldG1hcCIsImEiOiJja2w5YWt5bnYwNjZmMnFwZjhtbHk1MnA1In0.eq2aumBK6JuRoIuBMm6Gew',
              //url:'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}',
              //url:'https://bhuvan-ras1.nrsc.gov.in/tilecache/tilecache.py?service=WMS&tiled=true&version=1.0.0&request=GetMap&layers=Bhuvan_Lite_Sat_V2&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG%3A900913&format=image%2Fpng',
              type:'satellite',
              shapeType:shapeType,
              landuseClass:landuseClass,
              name:name,
              location:location
              
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
            onPress={() => {setModalVisibleLayer(!modalVisibleLayer);navigation.navigate('ShowMap',{
              url:'https://tile.openstreetmap.de/{z}/{x}/{y}.png',
              type:'osm',
              shapeType:shapeType,
              landuseClass:landuseClass,
              name:name,
              location:location
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