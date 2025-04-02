import React, { useEffect, useState } from 'react'
import { ToastContainer,toast } from 'react-toastify';
import Navbar from '../../components/Navbar'
import TravelLogCard from '../../components/Cards/TravelLogCard'
import AddEditTravelLog from '../Home/AddEditTravelLog';
import ViewTravelStory from '../Home/ViewTravelStory';
import { useNavigate } from 'react-router';
import axiosInstance from './../../utils/axiosInstance';
import {MdAdd} from 'react-icons/md'
import Modal from 'react-modal'
import EmptyCard from '../../components/Cards/EmptyCard'
import { DayPicker } from 'react-day-picker';
import moment from 'moment';
import FilterInfoTitle from '../../components/Cards/FilterInfoTitle';
import {getEmptyCardMessage, getEmptyCardImg} from '../../utils/helper'

const Home = () => {
  let navigate = useNavigate();
  const [ userInfo, setUserInfo ] = useState(null);
  const [ allLogs, setAllLogs ] = useState([]);

  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState("")
  const[dateRange, setDateRange] = useState({form:null,to:null })

  const [openAddEditModal, setOpenAddEditModal] = useState({isShown:false, type: "add", data: null});

  const [openViewModal, setOpenViewModal] = useState({
    isShown:false, type: "add", data: null
  })
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
        setAllLogs(response.data.logs)
      }
    }catch(error){
        console.log("An unexpected error occurred.Please try again.");
    }
  }

  const handleEditLog = async (data) => {
    setOpenAddEditModal({isShown:true, type: "edit", data: data})

  }
  const handleViewLog = async (data) => {
    setOpenViewModal({isShown:true, data})
  }

  const updateIsFavourite = async (logData) => {
    const logId = logData._id;
    try{
       const response = await axiosInstance.put("/update-favourites/" + logId, {isFavourite: !logData.isFavourite,});
       if(response.data && response.data.log){
        toast.success("Log Update Successfully");

        if(filterType === "search" && searchQuery){
          onSearchLog(searchQuery);
        }else if(filterType === "date"){
          filterLogsbyDate(dateRange)
        }else{
          getAllTravelLogs();
        }      
       }
    }catch(error){
        console.log("An unexpected error occurred.Please try again.");
    }
  }

  const deleteTravelLog = async (data) => {
    const logId = data._id;
    try{
      const response = await axiosInstance.delete("/delete-log/" + logId);

      if(response.data && !response.data.error){
        toast.error("Log Deleted Successfully");
        setOpenViewModal((prevState) => ({...prevState, isShown: false}))
        getAllTravelLogs();
      }

    }catch(error){
      console.log("An unexpected error occurred. Please try again")
    }

  }

  const onSearchLog = async (query) => {
    try{
      const response = await axiosInstance.get("/search/" , {
        params: {
          query,

        }
      });

      if(response.data && response.data.logs){
        setFilterType("search");
        setAllLogs(response.data.logs)
      }

    }catch(error){
      console.log("An unexpected error occurred. Please try again")
    }
  }

  const handleClearSearch = () => {
      setFilterType("");
      getAllTravelLogs();
  }

  const filterLogsbyDate = async (day) => {
    try{
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;

      if(startDate && endDate){
        const response = await axiosInstance.get("/travel-logs/filter", {
          params: {startDate, endDate},
        });

        if(response.data && response.data.logs){
          setFilterType("date");
          setAllLogs(response.data.logs);
        }
      }

    }catch(error){
      console.log("An unexpected error occurred. Please try again")
    }
  }

  const handleDayClick = (day) => {
    setDateRange(day);
    filterLogsbyDate(day);
}

const resetFilter = () => {
  setDateRange({from: null, to: null});
  setFilterType("");
  getAllTravelLogs();
}

  useEffect( () => {
    getAllTravelLogs();
    getUserInfo();
    return () => {}
    // eslint-disable-next-line
  }, [])
  return (
    <>
      <Navbar 
        userInfo= {userInfo} 
        searchQuery={searchQuery} 
        setSearchQuery= {setSearchQuery} 
        onSearchNote={onSearchLog} 
        handleClearSearch={handleClearSearch}/>

      <div className="container mx-auto py-10">

          <FilterInfoTitle
           filterType={filterType}
           filterDates={dateRange}
           onClear= {() => {
            resetFilter();
           }}
          
          />
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
                  isFavourite= {item.isFavourite}
                  onEdit={()=> handleEditLog(item)}
                  onClick={()=> handleViewLog(item)}
                  onFavouriteClick= {()=> updateIsFavourite(item)}
                  
                  />);
              })}
            </div>
            ) : (<EmptyCard imgSrc= {getEmptyCardImg(filterType)} 
                            message={getEmptyCardMessage(filterType)}
                            
                            />)}
          </div>
          <div className='w-[350px]'>
            <div className='bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg'></div>
              <div className='p-3'>
                <DayPicker
                  captionLayout='dropdown-buttons'
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                />

              </div>
          </div>
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

        <Modal
        isOpen={openViewModal.isShown}
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
          <ViewTravelStory  
            logInfo={openViewModal.data || null}
            onClose ={() => {setOpenViewModal((prevState) => ({...prevState, isShown: false}))}}
            onEditClick={() =>  
              {setOpenViewModal((prevState) => ({...prevState, isShown: false}))
                handleEditLog(openViewModal.data || null)}}
            onDeleteClick={() => {
              deleteTravelLog(openViewModal.data || null)
            }}
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
