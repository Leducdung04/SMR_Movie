import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import React from 'react';

const SuatChieu = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
    
        <View style={styles.content}>
          {/* Nội dung màn hình */}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập thông tin"
          />
        </View>
    </KeyboardAvoidingView>
  );
};

export default SuatChieu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    // Các phần nội dung màn hình khác
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});
