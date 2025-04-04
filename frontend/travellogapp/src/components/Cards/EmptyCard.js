import React from 'react'

const EmptyCard = ({imgSrc, message}) => {
  return (
    <div className='flex flex-col items-center justify-center mt-20'>
        <img src={imgSrc} alt='No Logs' className='w-[300px]'/>

        <p className='2-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5'>{message}</p>
      
    </div>
  )
}

export default EmptyCard
