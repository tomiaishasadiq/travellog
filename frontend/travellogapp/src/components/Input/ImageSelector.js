import React, {useRef, useState, useEffect} from 'react'
import { FaRegFileImage }from 'react-icons/fa';
import { MdDeleteOutline } from "react-icons/md"
import { FaStar } from "react-icons/fa";

const ImageSelector = ({image, setImage, handleDeleteImg, coverImage, setCoverImage, logData }) => {
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState([]);


    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            setImage((prev) => (Array.isArray(prev) ? [...prev, ...files] : files)); 
            const urls = files.map((file) => URL.createObjectURL(file));
            setPreviewUrl((prev) => (Array.isArray(prev) ? [...prev, ...urls] : urls));
        }
    };
    
    
    const handleSetCoverImage = async (index) => {
        if (!logData) {
          console.error("Log data is missing");
          return;
        }
        const logId = logData._id; 
        if (!image || image.length === 0) return;
        
        const coverImageFile = image[index];
        setCoverImage(coverImageFile); 
        
        const formData = new FormData();
        formData.append("logId", logId);  
        formData.append("coverImageUrl", previewUrl[index]); 
    
        try {
          const response = await fetch("http://localhost:8000/set-cover-image", {
            method: "POST",
            body: JSON.stringify({ logId, coverImageUrl: previewUrl[index] }),
            headers: { "Content-Type": "application/json" },
          });
    
          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.message);
          }
    
          console.log("Cover image updated:", result);
        } catch (error) {
          console.error("Error setting cover image:", error.message);
        }
      };
      
    

    const onChooseFile = () => {
        inputRef.current.click();
    }
    
    // const handleRemoveChange = () => {
    //     setImage(null);
    //     handleDeleteImg()
    // }
    const handleRemoveChange = (index) => {
        setPreviewUrl((prev) => prev.filter((_, i) => i !== index));
        setImage((prevImages) => prevImages.filter((_, i) => i !== index));
    
        if (coverImage === image[index]) {
            setCoverImage(null);
        }
    };
    
    

    // useEffect(() => {
    //     if(typeof image === 'string'){
    //         setPreviewUrl(image)
    //     }else if(image){
    //         setPreviewUrl(URL.createObjectURL(image))
    //     }else{
    //         setPreviewUrl(null);
    //     }
    //     return () => {
    //         if(previewUrl && typeof previewUrl === 'string' && !image){
    //             URL.revokeObjectURL(previewUrl);
    //         }

    //     }
    // }, [image])


    useEffect(() => {
        return () => {
          previewUrl.forEach((url) => URL.revokeObjectURL(url));
        };
      }, [previewUrl]);
    




      return (
        <div>
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleImageChange}
            multiple
            className="hidden"
          />
    
          {/* Image Grid */}
          {previewUrl.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {previewUrl.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Selected ${index}`}
                    className={`w-full h-[150px] object-cover rounded-lg ${
                    coverImage === index ? "border-4 border-cyan-500" : ""
                    }`}
                />
                <button
                    className="absolute bottom-2 left-2 bg-white px-2 py-1 text-xs rounded shadow-md"
                    onClick={() => handleSetCoverImage(index)}>

                    {coverImage === index ? "Cover Image" : "Set as Cover"}
                </button>

                  <button
                    className="btn-small btn-delete absolute top-2 right-2"
                    onClick={() => handleRemoveChange(index)}
                  >
                    <MdDeleteOutline className="text-lg" />
                  </button>
                  {/* Cover Star Icon */}
                {coverImage === index && (
                    <FaStar className="absolute top-2 left-2 text-yellow-400 text-xl" />
                )}
                </div>
              ))}
            </div>
          )}
    
          {/* Add more pics */}
          <button
            className="w-full mt-4 flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50 p-4"
            onClick={onChooseFile}
          >
            <div className="w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100">
              <FaRegFileImage className="text-xl text-cyan-500" />
            </div>
            <p className="text-sm text-slate-500">
              {previewUrl.length > 0 ? "Add More Images" : "Browse Image Files To Upload"}
            </p>
          </button>
        </div>
      );
}

export default ImageSelector
