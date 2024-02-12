import React from 'react';
import { MdOutlineDone } from "react-icons/md";

export const ThankYou = () => {
  return (
    <div className='bg-[#121112] h-screen w-full flex justify-center items-center'>
      <div className="w-4/5 md:w-1/2 rounded-md p-6 flex flex-col gap-4 justify-center items-center text-white">
            <div className="flex rounded-full bg-blue-500 justify-center items-center text-white font-extrabold text-3xl p-2">
                <MdOutlineDone />
            </div>
            <h2 className='text-center'>
            
            Thank you for sharing your vision with us. We're looking forward to working on this meaningful project together. If you have any additional thoughts or questions in the future, feel free to reach out. You can check your mail for final report.
            
            </h2>
        </div>
    </div>
  )
}
