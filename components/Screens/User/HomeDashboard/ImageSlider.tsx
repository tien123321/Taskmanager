import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Animated, Dimensions } from 'react-native';

// Danh sách hình ảnh
const images = [
  'https://tse2.mm.bing.net/th?id=OIP.h3U-yGZNxT8PkF5vlRnnxgHaEK&pid=Api&P=0&h=220',
  'https://tse3.mm.bing.net/th?id=OIP.r8hfdBhlYQiXJD7o0ycWDwHaFN&pid=Api&P=0&h=220',
  'https://img5.thuthuatphanmem.vn/uploads/2021/07/15/anh-3d-dep-buon_043316269.jpg',
  'https://tse1.mm.bing.net/th?id=OIF.AGDZ9fxTPX0W6DyaFSldtg&pid=Api&P=0&h=220',
  'https://freenice.net/wp-content/uploads/2021/08/hinh-ve-dep-bang-but-chi-nhan-vat-hoat-hinh.jpg',
];

// Lấy kích thước màn hình
const { width } = Dimensions.get('window');

const ImageSlider = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);  // Ảnh hiện tại
  const [nextImageIndex, setNextImageIndex] = useState(1); // Ảnh tiếp theo
  const fadeAnim = useRef(new Animated.Value(0)).current;  // Giá trị animation fade

  useEffect(() => {
    const interval = setInterval(() => {
      // Cập nhật chỉ mục ảnh hiện tại và ảnh tiếp theo
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      setNextImageIndex((prevIndex) => (prevIndex + 1) % images.length);

      // Bắt đầu animation fade khi thay đổi ảnh
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1, // Đưa ảnh sang trạng thái hiện tại
          duration: 3700, // Thời gian hiệu ứng fade
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0, // Làm mờ ảnh
          duration: 300, // Thời gian hiệu ứng fade
          useNativeDriver: true,
        }),
      ]).start();
      
    }, 4000); // Mỗi 4 giây thay đổi ảnh

    return () => clearInterval(interval); // Dọn dẹp khi component bị unmount
  }, []);

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    // Kiểm tra xem ảnh có phải là ảnh hiện tại hay không
    const imageIndex = index === 0 ? currentImageIndex : nextImageIndex;

    return (
      <View style={styles.imageContainer}>
        <Animated.Image
          source={{ uri: images[imageIndex] }}
          style={[
            styles.image,
            {
              opacity: fadeAnim, // Áp dụng hiệu ứng mờ dần
            },
          ]}
        />
      </View>
    );
  };

  return (
    <FlatList
      data={[images[currentImageIndex], images[nextImageIndex]]} // Chỉ truyền 2 ảnh vào FlatList
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: width, // Chiếm toàn bộ chiều ngang màn hình
    height: 200,  // Chiều cao của hình ảnh
    marginRight: 10,
    overflow: 'hidden',
  },
  image: {
    width: '96%',               // Đảm bảo ảnh chiếm hết chiều rộng
    height: '100%',              // Đảm bảo ảnh chiếm hết chiều cao
    resizeMode: 'cover',         // Đảm bảo ảnh phủ hết khu vực mà không bị méo
    borderRadius: 10,            // Bo góc ảnh
    shadowColor: '#000',         // Màu của bóng
    shadowOffset: { width: 0, height: 5 }, // Vị trí của bóng
    shadowOpacity: 0.3,          // Độ mờ của bóng
    shadowRadius: 8,             // Kích thước bóng
    elevation: 5,                // Dành cho Android
    marginHorizontal: 10,        // Khoảng cách từ ảnh đến các thành phần khác ở hai bên
  },
});

export default ImageSlider;
