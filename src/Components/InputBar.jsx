import React, { useContext, useState } from "react";
import { FaMicrophone } from "react-icons/fa6";
import { FaStop } from "react-icons/fa6";
import { IoIosPause } from "react-icons/io";
import ConversationContext from "../context/ConversationContext";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";



export const InputBar = ({
  transcript,
  handleStart,
  handleStop,
  listening,
  stopListening,
  handleStartConversation,
  loading,
  startListening,
  resetTranscript,
  threadId
}) => {
  const [started, setStarted] = useState(false);
  const { conversationCompleted } = useContext(ConversationContext);
  const [pause, setPause] = useState(false);
  const navigate = useNavigate();
  const [language, setLanguage] = useState("");
  const [error, setError] = useState(false);


  const handlePause = () => {
    setPause(false);
    startListening();
  }

  const handleChange = (e) => {
    setLanguage(e.target.value);
  }

  const handleClick = () => {
    setError(false);
    if(language === ""){
      setError(true);
      return;
    }
    handleStartConversation(language);
    setStarted(true);
  }

  return (
    <div className=" w-full flex justify-center items-center flex-col">
      <div className=" w-4/5 md:w-1/2 min-h-[7vh] flex justify-center items-center">
        <p className="text-md text-white font-semibold text-center">
          {transcript}
        </p>
      </div>
      <div className=" w-full md:w-3/5 flex justify-end px-6 py-2 rounded-lg text-lg tracking-wider">
        <div className="w-full flex md:flex-row flex-col justify-center gap-5 md:gap-10 items-center">
          {!started ? (
            <>
            <div>
            <select
              className={`rounded-md outline-none bg-[#6161611e]  border-[1px]
                            ${error?"border-red-900":"border-white"}
                            p-2 px-6 text-white cursor-pointer appearance-auto `}
              id="language"
              value={language}
              onChange={handleChange}
            >
              <option value="" className="bg-[#1e1c1c8d] rounded-md text-white disabled:text-blue-gray-800" disabled>Select Language</option>
              <option value="English" className="bg-[#1e1c1c8d] rounded-md text-white">English</option>
              <option value="Hindi" className="bg-[#1e1c1c8d] rounded-md text-white">Hindi</option>
            </select>

            </div>

            <div
              className=" rounded-md bg-[#6586e7] p-2 px-6 items-center text-white font-semibold
                    transition ease-in-out duration-200 cursor-pointer"
              onClick={handleClick}
            >
              Start Conversation
            </div>
            </>
            
          ) : (
            <div className="flex justify-center items-center gap-6">
              <button
                  className={`rounded-full bg-gray-500 w-12 h-12 items-center flex justify-center cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-800`}
                  disabled={conversationCompleted || loading}
                >
                  <FaStop
                    className="text-white text-2xl"
                    onClick={() => {
                      resetTranscript();
                      stopListening();
                    }}
                  />
                </button>
                
              <button
                className={`rounded-full bg-[#7C9DFF] w-14 h-14 items-center flex justify-center cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-800`}
                disabled={conversationCompleted || loading}
              >
                {listening ? (
                  <PiDotsThreeOutlineFill
                    className="text-white text-2xl animate-ping"
                    onClick={handleStop}
                  />
                ) : (
                  <FaMicrophone
                    className="text-white text-2xl"
                    onClick={pause ? handlePause : handleStart}
                  />
                )}
              </button>

              <button
                  className={`rounded-full bg-gray-600  w-12 h-12 items-center flex justify-center cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-800`}
                  onClick={() => {stopListening(); setPause(true)}}
                  disabled={conversationCompleted || loading}
                >
                  <IoIosPause className="text-white text-2xl" />
                </button>
            </div>
          )}
        </div>
      </div>
      {
        started &&
        <button className='mt-4 font-semibold text-white px-4 bg-blue-500 py-2 rounded-md w-auto disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-800' 
              disabled={!conversationCompleted}
              onClick={() => navigate(`/submit/${threadId}`)}
              style={{
                backgroundColor: conversationCompleted ? 'rgb(37 99 235)' : "rgb(75 85 99)",
                transition: "backgroundColor 1s ease"
              }}  
          >Submit Request</button>
      }
      
    </div>
  );
};
