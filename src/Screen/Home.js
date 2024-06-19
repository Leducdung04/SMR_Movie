import {
  ActivityIndicator,
  Alert,
  Animated,
  Button,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Video } from "expo-av";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import {Uri_get_list_video,Uri_get_movies_by_id,Ipv4} from '../api/index'

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

const Home = ({ navigation }) => {
  const tabBarHeight = useBottomTabBarHeight(); // chiều cao bottom tab bar

  const [videos, setVideos] = useState([]); // dữ liệu Video api
  const [ActiveIndex, setActiveIndex] = useState(0); // xác nhận vitris thứ tự video đang hiển thị
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setisRefreshing] = useState(false);

  const Animatedvalue = useRef(new Animated.Value(0)).current;
  const disAnimations = {
    transform: [
      {
        rotate: Animatedvalue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: ["0deg", "180deg", "360deg"], // Adjusted outputRange
        }),
      },
    ],
  };

  const getList = async () => {
    try {
      const response = await fetch(Uri_get_list_video);
      const data = await response.json();
      setVideos(data);
      setIsLoading(true);
      console.log("Lấy dữ liệu thành công");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  // xử lý khi loading lại dữ liệu trong flatlist
  const handleRefreshing = () => {
    setisRefreshing(true);
    getList();
    setTimeout(() => {
      setisRefreshing(false);
    }, 3000);
  };
  // xử lý lấy dữ liệu khi vào màn hình
  useEffect(() => {
    getList();
  }, []);

  // render Item Video
  const ItemList = ({ item, isActive, index }) => {
    const url = item.video[0].replace("localhost", Ipv4);
    const videoRef = useRef(null);
    const [dataComment, setdataComment] = useState(item.comment);
    const [isSelectComment, setisSelectComment] = useState(false);
    const [movides, setmovides] = useState("");

    const getMovide = async () => {
      try {
        const response = await fetch(`${Uri_get_movies_by_id}/${item.id_movie}`);
        const data = await response.json();
        setmovides(data);
        console.log("Phim đây ",movides)
      } catch (error) {
        console.log(error);
      }
    };

    // xử lý khi video video hiển thị
    useEffect(() => {
      try {
        if (isActive && videoRef.current) {
          videoRef.current.playAsync();
          Animated.loop(
            Animated.timing(Animatedvalue, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: true,
            })
          ).start();
        }
        return () => {
          if (videoRef.current) {
            videoRef.current.pauseAsync();
            Animated.loop(
              Animated.timing(Animatedvalue, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true,
              })
            ).start();
          }
        };
        getMovide();
      } catch (error) {
        console.log(error)
      }
     
    }, [isActive,Animatedvalue]);
    useEffect(() => {
      getMovide();
    }, [])
    
    // xử lý khi blur ra khỏi màn hình
    useEffect(() => {
      const unsubscribe = navigation.addListener("blur", () => {
        try {
          if (videoRef.current) {
            videoRef.current.stopAsync();
          }
        } catch (error) {
          console.log("Lỗi khi blur khỏi màn home",error)
        }
       
      });
      return unsubscribe;
    }, [navigation]);
    return (
      <View
        style={{
          flex: 1,
          width: widthScreen,
          height: heightScreen - tabBarHeight,
        }}
      >
        <Video
          ref={videoRef}
          style={{ flex: 1, width: widthScreen, height: heightScreen }}
          source={{ uri: url }}
          resizeMode="cover"
          isLooping={true}
          useNativeControls
          // onLoadStart={() => {
          //   console.log("Bắt đầu tải video");
          // }}
          // // onLoad={() => console.log("Video đã tải xong")}
          // onBuffer={() => {
          //   console.log("Video đang được tải vào bộ nhớ đệm");
          // }}
          // onError={(error) => console.log("Lỗi khi tải video:", error)}
          // onEnd={() => console.log("Video đã kết thúc")}
        />
        {/* Đây là ví dụ về cách truy cập vào thông tin của mỗi video */}
        {/* <Text numberOfLines={2} style={styles.itemContent}>{item.content}</Text> */}
        <View style={styles.itemAction}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Movide", { data: movides });
            }}
          >
            <Image
              source={{ uri: movides.img }}
              style={{ width: 50, height: 50, borderRadius: 50}}
            />
          </TouchableOpacity>

          <AntDesign name="heart" size={35} color="white" />
          <TouchableOpacity
            onPress={() => {
              setisSelectComment(true);
            }}
          >
            <FontAwesome name="commenting" size={35} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Showtime", { data: item.id_movie })
            }
          >
            <FontAwesome5 name="ticket-alt" size={35} color="#94d0ee" />
          </TouchableOpacity>
        </View>
        <Text style={styles.text_Movide}>{movides.name}</Text>
        <Text numberOfLines={2} style={styles.itemContent}>
          {item.content}
        </Text>
        <Animated.Image
          style={[styles.img, disAnimations]}
          source={require("../img/download.png")}
        />

        {isSelectComment && (
          <View
            style={{
              position: "absolute",
              height: heightScreen / 1.4,
              width: widthScreen,
              backgroundColor: "#121212",
              bottom: 0,
              borderTopStartRadius: 15,
              borderTopEndRadius: 15,
              alignContent: "space-around",
            }}
          >
            <Text
              style={[{ color: "white", textAlign: "center", marginTop: 15 }]}
            >
              {dataComment.length} Bình luận
            </Text>
            <TouchableOpacity
              onPress={() => {
                setisSelectComment(false);
              }}
              title="Hủy"
              style={{ position: "absolute", end: 0, margin: 10 }}
            >
              <MaterialIcons name="cancel" size={24} color="white" />
            </TouchableOpacity>

            <FlatList
              style={{ flex: 1, marginTop: 20, marginHorizontal: 10 }}
              data={dataComment}
              renderItem={(item) => {
                return (
                  <View
                    style={{
                      height: 50,
                      flexDirection: "row",
                      margin: 10,
                      alignItems: "center",
                    }}
                  >
                    <MaterialIcons
                      name="account-circle"
                      size={40}
                      color="gray"
                    />
                    <Text
                      numberOfLines={2}
                      style={{
                        color: "white",
                        marginStart: 10,
                        fontSize: 17,
                        width: "90%",
                      }}
                    >
                      {dataComment}
                    </Text>
                  </View>
                );
              }}
              keyExtractor={(index) => index}
            ></FlatList>
            <View
              style={{
                width: widthScreen,
                height: 80,
                marginBottom: 10,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="account-circle" size={45} color="white" />
              {/* <TextInput placeholder="" /> */}
              <TextInput
                style={styles.textinput}
                placeholder="add bình luận"
                returnKeyType="send"
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, height: heightScreen - tabBarHeight }}>
        <StatusBar barStyle={"light-content"} />
        {isLoading ? (
          <FlatList
            style={{
              flex: 1,
              width: widthScreen,
              height: heightScreen - tabBarHeight,
              backgroundColor: "white",
            }}
            data={videos}
            renderItem={({ item, index }) => (
              <ItemList
                item={item}
                isActive={ActiveIndex === index}
                index={index}
              />
            )}
            keyExtractor={(item, index) => String(index)}
            pagingEnabled
            onScroll={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.y / (heightScreen - tabBarHeight)
              );
              setActiveIndex(index);
            }}
            refreshing={isRefreshing}
            onRefresh={handleRefreshing}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContent: {
    width: "70%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    color: "white",
    marginStart: 10,
    fontSize: 16,
  },
  text_Movide: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    padding: 10,
    color: "white",
    marginStart: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  itemAction: {
    width: 50,
    height: 300,
    position: "absolute",
    right: 10,
    bottom: 150,
    alignSelf: "center",
    justifyContent: "space-around",
    alignItems: "center",
  },
  img: {
    width: 45,
    height: 45,
    position: "absolute",
    bottom: 10,
    right: 0,
    margin: 10,
  },
  textinput: {
    flex: 1,
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    color: "black",
    fontSize: 16,
  },
});
