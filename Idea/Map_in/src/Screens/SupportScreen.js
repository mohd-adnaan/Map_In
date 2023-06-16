import React,{ useState,useEffect } from 'react';
import { Text, View,StyleSheet, Image,} from 'react-native';
import Hyperlink from 'react-native-hyperlink';
import * as Animatable from 'react-native-animatable';

export default function SupportScreen(){

    return(
        <View style={{flex:1,flexDirection:'column',backgroundColor:'#ffffff'}}>
        <View style={{width:'100%',height:'80%',backgroundColor:'#ffffff'}}>
          <View style={{height:'40%',backgroundColor:'#4CAF50'}}>
          
          
          
          </View>
          <Animatable.View animation="slideInUp" style={{backgroundColor:'#ffffff',justifyContent:'center',width:'90%',height:'100%',alignSelf:'center',marginTop:-100,borderRadius:20,elevation:20}}>
          <Animatable.Image  resizeMode='center'
      source={require('../../assets/images/name_logo.png')}
      style={{height:100,width:'100%',alignSelf:'center',marginTop:'2%',}}>
      </Animatable.Image>
          <View style={styles.description}>
            <Text style={{color:'#4CAF50',fontSize:18,textAlign:'center'}}>Version : 1.0</Text>
                <Text style={styles.descriptionText1}>MAP-IN is an Interactive Mobile App for Geo Spatial Data Collection for Field Surveys.</Text>
                
                <Text style={styles.contacts}>For any Technical Support, Contact:</Text>
                <Text style={[styles.contactPerson, {fontSize: 18, fontWeight: 'bold', paddingTop: 10}]}>Khushboo Mirza</Text>
                <Text style={styles.contactPerson}>Scientist/Engineer</Text>
                <Text style={styles.contactPerson}>Regional Remote Sensing Centre - North</Text>
                <Text style={styles.contactPerson}>National Remote Sensing Centre</Text>
                <Text style={styles.contactPerson}>Indian Space Research Organization (ISRO)</Text>
                <Text style={styles.contactPerson}>Department of Space, Government of India, New Delhi</Text>
                <View style={{flexDirection: 'row'}} >
                    <Text style={[styles.contactPerson, {fontSize: 16}]}>Email: </Text>
                    <Hyperlink linkDefault={ true } >
                        <Text style={[styles.contactPerson, {fontSize: 16, color: 'blue', textDecorationLine: 'underline'}]}>khushboo_m@nrsc.gov.in</Text>
                    </Hyperlink>
                </View>
            </View>
          
          </Animatable.View>
        </View>
        
        </View>
    )
   /* return(
    <View style={styles.container}>
            <View>
                
            </View>
            <View style={styles.header}>
                <Text style={styles.heading}>Support</Text>
            </View>
            <ScrollView>
            <View style={styles.description}>
            <Text style={styles.descriptionText1}>MAP-IN Version : 1.0</Text>
                <Text style={styles.descriptionText1}>MAP-IN is a mobile App for marking and drawing shapes on a particular location on Indian Map.</Text>
                <Text style={styles.descriptionText2}>MAP-IN is a mobile App for marking and drawing shapes on a particular location on Indian Map.</Text>
                <Text style={styles.contacts}>For any Technical Support, Contact:</Text>
                <Text style={[styles.contactPerson, {fontSize: 16, fontWeight: 'bold', paddingTop: 10}]}>Khushboo Mirza</Text>
                <Text style={styles.contactPerson}>Scientist/Engineer</Text>
                <Text style={styles.contactPerson}>Regional Remote Sensing Centre - North</Text>
                <Text style={styles.contactPerson}>National Remote Sensing Centre</Text>
                <Text style={styles.contactPerson}>Indian Space Research Organization (ISRO)</Text>
                <Text style={styles.contactPerson}>Department of Space, Government of India, New Delhi</Text>
                <View style={{flexDirection: 'row'}} >
                    <Text style={[styles.contactPerson, {fontSize: 16}]}>Email: </Text>
                    <Hyperlink linkDefault={ true } >
                        <Text style={[styles.contactPerson, {fontSize: 16, color: 'blue', textDecorationLine: 'underline'}]}>khushboo_m@nrsc.gov.in</Text>
                    </Hyperlink>
                </View>
            </View>
            </ScrollView>
        </View>
    )*/
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative',
      padding: 10,
      alignItems:'center',
    //backgroundColor: '#ffffff',
    },
    header: {
        alignItems: 'center',
        paddingTop: 10,
        
    },
    heading: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#4CAF50'
    },
    description:{
        padding: 10,
        
        
       
        borderRadius:20,
        
    },
    descriptionText1:{
        fontSize:18,
        color:'#4CAF50',
        textAlign:'center',
        paddingTop:5,
        
    },
    descriptionText2:{
        fontSize:16,
        color:'#4CAF50',
        textAlign:'justify',
        paddingTop:5,
    },
    contacts:{
        fontSize:16,
        paddingTop:20,
        color:'#4CAF50',
        fontWeight:'bold',
    },
    contactPerson: {
        fontSize:18,
        color:'#4CAF50',
        textAlign:'center'
    },
})

    
