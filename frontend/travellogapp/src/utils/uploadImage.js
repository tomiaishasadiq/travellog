import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) =>{
    const formData = new FormData();
    imageFile.forEach((image) => {
        formData.append('images', image);
    });
    try{
        const response = await axiosInstance.post('/image-upload', formData, {
            headers:{
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data;
    }catch(error){
        console.error("Error uploading the image", error);
        throw error;
    }
}

export default uploadImage;