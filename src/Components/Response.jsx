import React, { useContext, useEffect } from 'react'; 
import ReactPlayer from "react-player";
import Message from './Message';
import axios from 'axios';
import ConversationContext from '../context/ConversationContext';
import {useNavigate} from "react-router-dom";

export const Response = ({ audioURL, message, loading, handleStart, threadId}) => {
  const {
    conversationCompleted, 
    setConversationCompleted, 
    setConversation} = useContext(ConversationContext);

  useEffect(() => {
    if (message.includes("submit the conversation now") && !conversationCompleted) {
      setConversationCompleted(true);
    }
  }, [message, conversationCompleted, setConversationCompleted]);
  
  const navigate = useNavigate();
  
  const getConversation = async () => {
    try {
      if (!threadId) return;
      console.log(threadId);
      const response = await axios.get(
        `https://ai-product-manager.onrender.com/assistant/${threadId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      setConversation(response.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  

  return (
    <div className='w-full h-[50vh] flex justify-center items-center'>
      <div className="relative h-[45vh] w-2/3 flex justify-center items-center">
        <button className='absolute right-0 top-5 font-semibold text-white px-4 bg-blue-500 py-2 rounded-md w-auto disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-800' 
              disabled={!conversationCompleted}
              onClick={() => navigate("/submit")}
              style={{
                backgroundColor: conversationCompleted ? 'rgb(37 99 235)' : "rgb(75 85 99)",
                transition: "backgroundColor 1s ease"
              }}  
          >Submit Request</button>
          <div className="w-4/5 flex justify-center items-center h-auto bg-transparent rounded-xl p-2">
            {audioURL &&
              <ReactPlayer url={audioURL} playing width={0} onEnded={conversationCompleted ? getConversation : handleStart} />
            }
              <Message loading={loading} message={message} />
          </div>
      </div>
    </div>
  )
}
