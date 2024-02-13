import React, { useContext, useEffect, useState } from 'react'; 
import Message from './Message';
import ConversationContext from '../context/ConversationContext';
import { Progress } from "@material-tailwind/react";

export const Response = ({ audioURL, message, loading, handleStart, messageNo}) => {
  const {
    conversationCompleted, 
    setConversationCompleted} = useContext(ConversationContext);
    const [progressVal, setProgressVal] = useState(0);

  useEffect(() => {
    if(messageNo === 0) return;
    if(messageNo < 9 && progressVal < 90){
      setProgressVal((progressVal) => progressVal+5);
    }else{
      if(progressVal+2 > 100){
        setProgressVal(99);
      }else{
        setProgressVal((progressVal)=>progressVal+2);
      }
    };
    if ((message.includes("submit the conversation now") || message.includes("आप अगले कदमों के लिए चैट सबमिट कर सकते हैं।")) && !conversationCompleted) {
      setConversationCompleted(true);
    }
  }, [message, messageNo, conversationCompleted, setConversationCompleted]);

  useEffect(()=>{
    if(audioURL){
      const audioElement = new Audio(audioURL);

      audioElement.addEventListener('ended', () => {
        if (conversationCompleted) {
          console.log("Conversation completed!");
        } else {
          handleStart();
        }
      });
      
      audioElement.play();
    }
  }, [audioURL]);

  return (
    <div className='h-[50vh] w-[90%] md:w-2/3 flex flex-col justify-center items-center'>
      {
        message !== ""  && 
        <div className="w-full">
        <div className="mb-2 flex items-center justify-between gap-4">
          <h3 className="text-white">
            Completed
          </h3>
          <h3 className="text-white">
            {conversationCompleted ? "100" : progressVal}%
          </h3>
        </div>
        <Progress value={conversationCompleted ? 100 : progressVal} color="blue" className="bg-transparent" size="sm"/>
        </div>
      }
      <div className="relative h-[45vh] w-full flex items-center justify-center ">
          <div className="w-full md:w-4/5 flex justify-center items-center h-auto bg-transparent rounded-xl p-2">
            {/* {audioURL &&
              <ReactPlayer url={audioURL} playing width={0} onEnded={conversationCompleted ? ()=>{console.log("Conversation completed!");} : handleStart} />
            } */}
              <Message loading={loading} message={message} />
          </div>
      </div>
    </div>
  )
}
