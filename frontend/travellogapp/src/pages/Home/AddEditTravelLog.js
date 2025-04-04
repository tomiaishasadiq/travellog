import React,{useState} from 'react';
import {MdAdd, MdUpdate, MdClose} from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/Input/ImageSelector";
import TagInput from "../../components/Input/TagInput"
import axiosInstance from '../../utils/axiosInstance';
import moment from 'moment';
import uploadImage from '../../utils/uploadImage'
import {toast} from "react-toastify";


const AddEditTravelLog = ({logInfo, type, onClose ,getAllTravelLogs}) => {
    const [title, setTitle] = useState(logInfo?.title || "");
    const [logImg, setLogImg] = useState(logInfo?.imageUrl || []);
    const [log, setLog] = useState(logInfo?.log || "");
    const [visitedLocation, setVisitedLocation] = useState(logInfo?.visitedLocation || []);
    const [visitedDate, setVisitedDate] = useState(logInfo?.visitedDate || null);const [error, setError] = useState("");
    
    const addNewTravelLog = async () => {
      try {
        let imageUrl = [];
    
        if (logImg.length > 0) {
          const uploadResponse = await uploadImage(logImg);
          imageUrl = uploadResponse?.imageUrl || [];
        }
    
        if (
          !title || 
          !log || 
          visitedLocation.length === 0 || 
          (logImg.length === 0 || !logImg.some(img => img)) || 
          !visitedDate
        ) {
          setError("All fields are required");
          return;
        }
        
        const requestBody = {
          title,
          log,
          imageUrl,  
          visitedLocation,
          visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
        };
    
        console.log("Request Body:", requestBody);
    
        const response = await axiosInstance.post("/add-travel-log", requestBody);
    
        if (response.data && response.data.log) {
          toast.success("Log Added Successfully");
          getAllTravelLogs();
          onClose();
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      }
    };
    
    const updateTravelLog = async () => {
      const logId = logInfo._id;
  
      try {
        let existingImages = logImg.filter(img => typeof img === 'string'); // Already uploaded
        let newImages = logImg.filter(img => typeof img !== 'string');      // New files
        
        let uploadedUrls = [];
        if (newImages.length > 0) {
          const uploadResponse = await uploadImage(newImages);
          uploadedUrls = uploadResponse?.imageUrl || [];
        }
        
        const imageUrl = [...existingImages, ...uploadedUrls];
        
        const postData = {
          title,
          log,
          imageUrl,
          visitedLocation,
          visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
        };
  
        const response = await axiosInstance.put("/edit-log/" + logId, postData);
  
        if (response.data && response.data.log) {
          toast.success("Log Updated Successfully");
          getAllTravelLogs();
          onClose();
        }
      } catch (error) {
        setError(error.response?.data?.message || "An unexpected error occurred. Please try again.");
      }
    };
   

    const handleAddOrUpdateClick = () => {
      if(!title){
        setError("Please Enter the Title");
        return;
      }
      if(!log){
        setError("Please Enter the Title");
        return;
      }
      setError("");
      if(type === "edit"){
        updateTravelLog();
      }else{
        addNewTravelLog();
      }
    }

    const  handleDeleteLogImg = async () => {
      const deleteImgRes = await axiosInstance.delete("/delete-image", {
        params: {
          imageUrl: logInfo.imageUrl
        },
      })

      if(deleteImgRes){
        const logId = logInfo._id;
        const postData = {
          title,
          log,
          visitedLocation,
          visitedDate: moment().valueOf(),
          imageUrl: [],

        };
        // eslint-disable-next-line
        const response = await axiosInstance.put(
          "/edit-log/" + logId,
          postData
        )
        setLogImg(null)
      }
    }

  return (
    <div className='relative'>
      <div className="flex items-center justify-between">
        <h5 className='text-xl font-medium text-slate-700'>
            {type === "add" ? "Add Log" : "Update Log"}
        </h5>
        <div>
            <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
                {type === 'add' ? (<button className="btn-small"
                onClick={handleAddOrUpdateClick}>
                    <MdAdd className='text-lg' />ADD LOG
                </button> ): (<> 

                <button className='btn-small' onClick={handleAddOrUpdateClick}>
                    <MdUpdate className='text-lg' /> UPDATE LOG
                </button>
                {/* <button className='btn-small btn-delete'onClick={onClose}>
                    <MdDeleteOutline className='text-lg' /> DELETE
                </button> */}
                 
                </>)}
                <button onClick={ () => {onClose()}}>
                    <MdClose className='text-xl text-slate-400' />
                </button>
            </div>
            {error && ( <p className='text-red-500 text-xs pt-2 text-right'>{error}</p>) }
        </div>
      </div>
      <div>
        <div className='flex-1 flex flex-col gap-2 pt-4'>
            <label className='input-label'>TITLE</label>
            <input type="text"
                   className='text-2xl text-slate-950 outline-none'
                   placeholder='The Ultimate Birthday Trip' 
                   value ={title}
                   onChange= {({target}) => setTitle(target.value)}
            />
            <div className='my-3'>
                <DateSelector date ={visitedDate} setDate= {setVisitedDate} />
            </div>
            <ImageSelector 
              image = {logImg}
              setImage={setLogImg}  
              handleDeleteImg={handleDeleteLogImg}
              logData={logInfo}
              />

            <div className='flex flex-col gap-2 mt-4'>
              <label className='input-label'>LOG</label>
              <textarea
                type="text"
                className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                placeholder='About Trip' 
                rows = {10}
                value ={log}
                onChange={({target}) => setLog(target.value)}
              />          
            </div>

            <div className='pt-3'>
              <label className='input-label'>VISITED LOCATION</label>
              <TagInput tags={visitedLocation} setTags= {setVisitedLocation} />
            </div>
        </div>
      </div>
    </div>
  )
}

export default AddEditTravelLog
