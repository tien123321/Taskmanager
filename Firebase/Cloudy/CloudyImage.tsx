import axios from 'axios';

export const uploadImageToCloudinary = async (imageUri: string) => {
  const cloudName = 'dglbyjwmt';
  const uploadPreset = 'MyTaskImage';

  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  } as any);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.secure_url; // Trả về link ảnh sau khi upload
  } catch (error) {
    console.error('Lỗi upload Cloudinary:', error);
    throw error;
  }
};
