import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../Screen/Home';
import SuatChieu from '../Screen/SuatChieu';
import NotificationScreen from '../Screen/NotificationScreen';
import SettingScreen from '../Screen/SettingScreen';

const Tab = createBottomTabNavigator();

const Bottomtabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{ tabBarShowLabel: true, headerShown: false }}
      activeColor="#94d0ee"
      barStyle={{ backgroundColor: '#ffffff' }}
      shifting={false}
    >
      <Tab.Screen
        name="Trang chủ"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => {
            let iconSource = focused
              ? require('../img/homechon.png')
              : require('../img/home.png');
            return (
              <View>
                <Image source={iconSource} style={{ width: 22, height: 22 }} />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Chiếu phim"
        component={SuatChieu}
        options={{
          tabBarIcon: ({ color, focused }) => {
            let iconSource = focused
              ? require('../img/moviechon.png')
              : require('../img/movie.png');
            return (
              <View>
                <Image source={iconSource} style={{ width: 22, height: 22 }} />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Hộp thư"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ color, focused }) => {
            let iconSource = focused
              ? require('../img/openmailchon.png')
              : require('../img/openmail.png');
            return (
              <View>
                <Image source={iconSource} style={{ width: 22, height: 22 }} />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Hồ sơ"
        component={SettingScreen}
        options={{
          tabBarIcon: ({ color, focused }) => {
            let iconSource = focused
              ? require('../img/userchon.png')
              : require('../img/user.png');
            return (
              <View>
                <Image source={iconSource} style={{ width: 22, height: 22 }} />
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default Bottomtabs;
