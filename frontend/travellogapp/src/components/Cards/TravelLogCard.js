import React from 'react'
import moment from "moment/moment"
import { FaHeart } from 'react-icons/fa6';
import { GrMapLocation } from 'react-icons/gr';
import { FaTags } from "react-icons/fa6";
import { HiLocationMarker } from "react-icons/hi";

const TravelLogCard = ({
    imgUrl,
    title ,
    log ,
    date,
    visitedLocation=[], 
    placesVisited= [],
    tags= [],
    isFavourite,
    onEdit,
    onClick,
    onFavouriteClick,
}) => {
  return (
    <div className='border rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer '>
      <img 
          src={imgUrl[0]} 
          alt={title} 
          className='w-full h-56 object-cover rounded-lg'
          onClick={onClick} 
      />

      <button className='w-12 h-12 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute top-4 right-4' 
      onClick={onFavouriteClick}
      > 
        <FaHeart className={`icon-btn ${isFavourite ? "text-red-500" : "text-white"}`}/>
      </button>

        <div className='p-4' onClick={onClick}>
            <div className='flex items-center gap-3'>
                <div className='flex-1'>
                    <h6 className='text-sm font-medium'>{title}</h6>
                    <span className='text-xs text-slate-500'>
                        {date ? moment(date).format("Do MMM YYYY") : "-"}
                    </span>
                </div>
            </div>
            <p className='text-xs text-slate-600 mt-2'>{log?.slice(0,60)}</p>
            {/* <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1">
                <GrMapLocation className='text-sm'/>
                {visitedLocation.map((item,index) => visitedLocation.length === index + 1 ? `${item}` : `${item},`)}
            </div>

            <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1">
                <HiLocationMarker className='text-sm'/>
                {placesVisited.map((item,index) => placesVisited.length === index + 1 ? `${item}` : `${item},`)}
            </div>
          
            <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1">
                <FaTags className='text-sm'/>
                {tags.map((item,index) => tags.length === index + 1 ? `${item}` : `${item},`)}
            </div> */}
           
              <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1">
                  <GrMapLocation className='text-sm'/>
                  {visitedLocation.join(', ')}
              </div>

              
              {placesVisited && placesVisited.length > 0 && (
                <div className="places-visited">
                  <HiLocationMarker className="icon" />
                  <span>{placesVisited.join(', ')}</span>
                </div>
              )}

          
              {tags && tags.length > 0 && (
                <div className="tags">
                  <FaTags className="icon" />
                  <span>{tags.join(', ')}</span>
                </div>
              )}

         </div>
    </div>
  )
}

export default TravelLogCard
