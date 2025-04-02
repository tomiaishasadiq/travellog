import React from 'react';
import { GrMapLocation } from 'react-icons/gr';
import moment from "moment/moment"
import {MdAdd, MdDeleteOutline, MdUpdate, MdClose} from 'react-icons/md'


const ViewTravelStory = ({logInfo, onClose,onEditClick,onDeleteClick}) => {

    
    return(
        <div className='relative'>
            <div className="flex items-center justify-end">
                <div>
                    <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                    <button className='btn-small' onClick={onEditClick}>
                        <MdUpdate className='text-lg'/> UPDATE LOG
                    </button>

                    <button className='btn-small btn-delete' onClick={onDeleteClick}>
                        <MdDeleteOutline className='text-lg'/> Delete
                    </button>

                    <button className='btn-small' onClick={onClose}>
                        <MdClose className='text-lg text-slate-400'/>
                    </button>

                    </div>
                </div>

            </div>
            
            <div>
                    <div className='flex-1 flex flex-col gap-2 py-4'>
                        <h1 className='text-2xl text-slate-950'>
                            {logInfo && logInfo.title}
                        </h1>

                        <div className='flex items-center justify-between gap-3'>
                            <span>
                                {logInfo && moment(logInfo.visitedDate).format("Do MMM YYYY")}
                            </span>

                            <div className='inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 py-2 '>
                                <GrMapLocation className='text-sm'/>
                                {logInfo && logInfo.visitedLocation.map((item,index) => logInfo.visitedLocation.length == index + 1 ? `${item}` : `${item}`)}
                            </div>

                        </div>
                    </div>
                    {logInfo?.imageUrl.map((image, index) => (
                    <img 
                        key={index}
                        src={image} 
                        alt={`Log  ${index + 1}`}
                        className='w-full h-[300px] object-cover rounded-lg'
                    />
                    ))}

                  <div className='mt-4'>
                    <p className='text-sm text-slate-950 leading-6 text-justify whitespace-pre-line'>{logInfo.log}</p>

                 </div>  
                </div>
        </div>
    );
}
export default ViewTravelStory
