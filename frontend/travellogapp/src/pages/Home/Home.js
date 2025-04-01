import React, { useEffect, useState } from 'react'
import { ToastContainer,toast } from 'react-toastify';
import Navbar from '../../components/Navbar'
import TravelLogCard from '../../components/Cards/TravelLogCard'
import AddEditTravelLog from '../Home/AddEditTravelLog'
import { useNavigate } from 'react-router';
import axiosInstance from './../../utils/axiosInstance';
import {MdAdd} from 'react-icons/md'
import Modal from 'react-modal'

const Home = () => {
  let navigate = useNavigate();
  const [ userInfo, setUserInfo ] = useState(null);
  const [ allLogs, setUserLogs ] = useState([]);

  const [openAddEditModal, setOpenAddEditModal] = useState({isShown:false, type: "add", data: null});

  const getUserInfo = async () => {
    try{
      const response = await axiosInstance.get("/get-user");
      if(response.data && response.data.user){
        setUserInfo(response.data.user)
      }
    }catch(error){
      if(error.response.status === 401){
        localStorage.clear();
        navigate("/login");
      }
    }
  }

  const getAllTravelLogs = async () => {
    try{
      const response = await axiosInstance.get("/get-all-logs");
      if(response.data && response.data.logs){
        setUserLogs(response.data.logs)
      }
    }catch(error){
        console.log("An unexpected error occurred.Please try again.");
    }
  }

  const handleEditLog = async (data) => {}
  const handleViewLog = async (data) => {}

  const updateIsFavourite = async (logData) => {
    const logId = logData._id;
    try{
       const response = await axiosInstance.put("/update-favourites/" + logId, {isFavourite: !logData.isFavourite,});
       if(response.data && response.data.log){
        toast.success("Log Update Successfully");
        getAllTravelLogs();
       }
    }catch(error){
        console.log("An unexpected error occurred.Please try again.");
    }
  }


  useEffect( () => {
    getAllTravelLogs();
    getUserInfo();
    return () => {}
  }, [])
  return (
    <>
      <Navbar userInfo= {userInfo}/>
      <div className="container mx-auto py-10">
        <div className='flex gap-7'>
          <div className='flex-1'>
            {allLogs.length > 0 ? (<div className='grid grid-cols-2 gap-4'>
              {allLogs.map((item)=> {
                return (<TravelLogCard 
                  key= {item._id}
                  imgUrl= {item.imageUrl}
                  title = {item.title}
                  log = {item.log}
                  date= {item.visitedDate}
                  visitedLocation= {item.visitedLocation}
                  placesVisited= {item.placesVisited}
                  isFavourite= {item.isFavourite}
                  onEdit={()=> handleEditLog(item)}
                  onClick={()=> handleViewLog(item)}
                  onFavouriteClick= {()=> updateIsFavourite(item)}
                  
                  />);
              })}
            </div>
            ) : (<>Empty Card Here</>)}
          </div>
          <div className='w-[320px]'></div>
        </div>
      </div>
        



      <Modal
      isOpen={openAddEditModal.isShown}
      onRequestClose={() => {}}
      style={{
        overlay: {
          backgroundColor: "rgba(0,0,0,0.2)",
          zIndex:999
        }
      }} 
      appElement={document.getElementById("root")}
      className="model-box"
      >
        <AddEditTravelLog
          type = {openAddEditModal.type}
          logInfo={openAddEditModal.data}
          onClose = { () => {
            setOpenAddEditModal({isShown:false, type: "add", data: null})
          }}
          getAllTravelLogs={getAllTravelLogs}
        />
      </Modal>
      <button className='w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10'
      onClick={() => {setOpenAddEditModal({isShown:true, type: "add", data: null})}}
      >
          <MdAdd className="text-[32px] text-white"/>
      </button>

     <ToastContainer/>
    </>
  )
}

export default Home
