import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

const NotificationScreen = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [anh, setanh] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
      console.log("ảnh chọn đây ",result.assets[0])
      setanh({
        uri: result.assets[0].uri,
        type: result.assets[0].mimeType || 'image/jpeg',
        name: result.assets[0].fileName || result.assets[0].uri.split('/').pop(),
      });
    }
  };

  const addBills = async () => {
    try {
      const date = new Date();
      const day = date.getDate(); 
      const month = date.getMonth() + 1; 
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      const dulieuthem = new FormData();
      dulieuthem.append('payment_amount', 90000);
      dulieuthem.append('Number_of_tickets', 2);
      dulieuthem.append('Payment_methods', 1);
      dulieuthem.append('date', `${day}/${month}/${year}`);
      dulieuthem.append('time', `${hours}:${minutes}`);
      dulieuthem.append('id_user', '663b1b0095121af8cf26fe17');
      dulieuthem.append('status', 0);

      if (anh) {
        dulieuthem.append('img', {
          uri: anh.uri,
          type: anh.type,
          name: anh.name,
        });
      }

      const response = await fetch('http://192.168.1.6:3000/api/add-bills', {
        method: 'POST',
        body: dulieuthem,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        console.log('Thêm bills thành công');
        console.log("dữ liệu đây ",dulieuthem)
      } else {
        console.log('Failed to add bills', response.status);
      }
    } catch (error) {
      console.log('Lỗi khi thêm bills', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={pickImage} style={{ marginBottom: 20 }}>
        <Text>Chọn ảnh từ thư viện</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginBottom: 20 }} />
      )}

      <TouchableOpacity onPress={addBills} style={{ backgroundColor: 'blue', padding: 10 }}>
        <Text style={{ color: 'white' }}>Thêm Bills</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({});
