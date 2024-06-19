import { Image, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Wellcome = ({navigation}) => {
    setTimeout(() => {
        navigation.navigate('Bottomtabs')
    }, 2500);
  return (
    <View style={styles.container}>
        <StatusBar 
         barStyle={'dark-content'}
         backgroundColor={'rgba(0, 0, 0,0.2)'}/>
         <Image source={require('../img/logo.png')}
                style={styles.logo}
         />
    </View>
  )
}

export default Wellcome

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fefeff'
    },
    logo:{
        width:125,
        height:125,
    }
})