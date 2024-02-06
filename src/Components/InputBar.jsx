import React, { useContext, useState } from "react";
import { FaMicrophone } from "react-icons/fa6";
import { FaStop } from "react-icons/fa6";
import { IoIosPause } from "react-icons/io";
import ConversationContext from "../context/ConversationContext";
import { PiDotsThreeOutlineFill } from "react-icons/pi";

export const InputBar = ({
  transcript,
  handleStart,
  handleStop,
  listening,
  stopListening,
  handleStartConversation,
  loading,
  startListening,
  browserSupportsContinuousListening,
  resetTranscript
}) => {
  const [started, setStarted] = useState(false);
  const { conversationCompleted } = useContext(ConversationContext);
  const [pause, setPause] = useState(false);
  


  const handlePause = () => {
    setPause(false);
    if(browserSupportsContinuousListening){
      startListening({continuous: true});
    }
  }

  return (
    <div className=" w-full flex justify-center items-center flex-col">
      <div className="w-1/2 min-h-[7vh] flex justify-center items-center">
        <p className="text-md text-white font-semibold text-center">
          {transcript}
        </p>
      </div>
      <div className="w-3/5 flex justify-end px-6 py-2 rounded-lg text-lg tracking-wider">
        <div className="w-full flex justify-center gap-10 items-center">
          {!started ? (
            <div
              className=" rounded-xl bg-[#7C9DFF] p-4 px-6 items-center text-white font-semibold
                    transition ease-in-out duration-200 cursor-pointer"
              onClick={() => {
                handleStartConversation();
                setStarted(true);
              }}
            >
              Start Conversation
            </div>
          ) : (
            <>
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
              
            </>
          )}
        </div>
      </div>
    </div>
  );
};
