import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'

const Textinputedit = (props) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <TextInput {...props}
          
      style={{flex:1,height:50,backgroundColor:'gray',borderRadius:20,marginHorizontal:10}}
    />  
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
export default Textinputedit
const styles=StyleSheet.create({
    container:{
        flex:1
    }
})
  