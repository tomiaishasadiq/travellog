import React,{useState} from 'react';
import {MdAdd, MdDeleteOutline, MdUpdate, MdClose} from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/Input/ImageSelector";

const AddEditTravelLog = ({logInfo, type, onClose ,getAllTravelLogs}) => {
    const [title, setTitle] = useState("");
    const [logImg, setLogImg] = useState([]);
    const [log, setLog] = useState("");
    const [visitedLocation, setVisitedLocation] = useState([]);
    const [visitedDate, setVisitedDate] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    const handleAddOrUpdateClick = () => {}

    const  handleDeleteLogImg = () => {}
  return (
    <div>
      <div className="flex items-center justify-between">
        <h5 className='text-xl font-medium text-slate-700'>
            {type === "add" ? "Add Story" : "Update Story"}
        </h5>
        <div>
            <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
                {type === 'add' ? <button className="btn-small"
                onClick={ () => {}}>
                    <MdAdd className='text-lg' />ADD LOG
                </button> : <> 

                <button className='btn-small' onClick={handleAddOrUpdateClick}>
                    <MdUpdate className='text-lg' /> UPDATE LOG
                </button>

                <button className='btn-small btn-delete'onClick={onClose}>
                    <MdDeleteOutline className='text-lg' /> DELETE
                </button>
                </>}
              
                <button 
                onClick={ () => {onClose()}}
                >
                    <MdClose className='text-xl text-slate-400' />
                </button>


            </div>
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
              coverImage={coverImage}
              setCoverImage={setCoverImage}
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
        </div>
      </div>
    </div>
  )
}

export default AddEditTravelLog
