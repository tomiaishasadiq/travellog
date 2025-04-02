import React, {useRef, useState, useEffect} from 'react'
import { FaRegFileImage }from 'react-icons/fa';
import { MdDeleteOutline } from "react-icons/md"


const ImageSelector = ({image, setImage, handleDeleteImg,  logData }) => {
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
                alt="Selected"
                className="w-full h-[150px] object-cover rounded-lg border-4 " 
                 />
                  <button
                    className="btn-small btn-delete absolute top-2 right-2"
                    onClick={() => handleRemoveChange(index)}
                  >
                    <MdDeleteOutline className="text-lg" />
                  </button>
               
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
