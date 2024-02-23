import React, { useContext, useEffect, useState } from 'react'; 
import Message from './Message';
import ConversationContext from '../context/ConversationContext';
import { Progress } from "@material-tailwind/react";

export const Response = ({ audioURL, message, handleStart, messageNo, pauseListening}) => {
  const {
    conversationCompleted, 
    setConversationCompleted, setPlaying } = useContext(ConversationContext);
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

  useEffect(() => {
    if (audioURL) {
      const audioElement = new Audio(audioURL);
      setPlaying(true);
      audioElement.addEventListener('ended', () => {
        setPlaying(false);
        if (conversationCompleted) {
          pauseListening();
          console.log("Conversation completed!");
        } else {
          handleStart();
        }
      });
      
      // Create a button and attach a click event listener
      const button = document.createElement('button');
      button.setAttribute('id', 'audioButton');
      button.style.display = 'none';
      document.body.appendChild(button);
  
      const clickButton = () => {
        audioElement.play(); // Play the audio when the button is clicked
        button.removeEventListener('click', clickButton); // Remove the event listener after clicking
        document.body.removeChild(button); // Remove the button after clicking
      };
  
      button.addEventListener('click', clickButton); // Attach the click event listener to the button
  
      // Trigger button click programmatically
      button.click();
    }
  }, [audioURL, conversationCompleted]);
  

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
              <Message message={message} />
          </div>
      </div>
    </div>
  )
}
