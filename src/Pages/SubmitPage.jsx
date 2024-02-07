import React, { useContext, useState } from 'react'
import ConversationContext from '../context/ConversationContext';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

export const SubmitPage = () => {

  const [email, setEmail] = useState('');
  const {conversation} = useContext(ConversationContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  
  const getSummary = async() => {
    try{
      if(!email){
        setError("Enter email please.")
        return;
      }
      if (!conversation || conversation.length === 0 || !conversation.messages || conversation.messages.length === 0) {
        setError("Oops Conversation is missing!");
        return;
      }
      setLoading(true);
      setError("");
      setMessage("Generating and sending your report to your mail...");
      const response = await axios.post("https://ai-product-manager.onrender.com/prompt/getSummary", {
        email: email,
        conversation: conversation.messages,
      },{
        headers: {
          "Content-Type": "application/json",
        }
      });
      if(!(response.status >= 200 && response.status < 300)){
        setError("Something went wrong");
      }else{
        setMessage("Your Report has been sent to your mail");
        setTimeout(() => {
          navigate("/thankyou");
        }, 3000);
      }
    }catch(e){
      console.log(e.message);
    }
    finally{
      setLoading(false);
    }
  }

  
  const submitConversation = async() => {
    try { 
      if(!email){
        setError("Enter email please.")
        return;
      }
      if (!conversation || conversation.length === 0 || !conversation.messages || conversation.messages.length === 0) {
        setError("Oops Conversation is missing!");
        return;
      }
      setLoading(true);
      setError("");
      setMessage("Saving Conversation...");
      const response = await axios.post("https://ai-product-manager.onrender.com/submitConversation", {
        email: email,
        conversation: conversation.messages,
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (response.status >= 200 && response.status < 300) {
        console.log("Conversation Saved to Database!");
        getSummary();
      } else {
        console.error("Failed to save conversation:", response.statusText);
        setMessage("Failed to save conversation. Please try again later.");
      }
    } catch (error) {
      console.log("Error in saving conversation", error);
      setError("Something went wrong");
    }
  }

  

  return (
    <div className='bg-[#121112] h-screen w-full flex justify-center items-center'>
      <div className="w-1/2 rounded-md p-6 flex flex-col gap-4 justify-center items-center text-white">
            <h2 className='text-center'>
            Thank you for taking the time to discuss your project with me. It was a pleasure learning about your vision and requirements. Rest assured, we will compile our conversation and formulate a detailed plan to ensure the successful execution of the project. To proceed, kindly provide your email for confirmation purposes. I look forward to our collaboration.
            </h2>
            <div className="w-1/2 mt-2 h-auto flex flex-col gap-5">
              <input type="email" placeholder='Please enter your email' value={email} onChange={(e) => setEmail(e.target.value)} className='p-2 px-4 rounded-md bg-transparent outline-none border-blue-500 border-2 font-semibold text-white-700'/>
            </div>

            <div className="min-h-[3vh] w-full text-sm text-red-600 font-semibold text-center">
              {
                error.length !== 0 ? error :
                <p className="text-white">{message && message}</p> 
              }  
            </div>
            <div className="flex gap-4 w-full justify-center items-center">

            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-800 disabled:hover:bg-gray-700"
            onClick={submitConversation}
            disabled={!email}>
              {loading &&
                <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
              
              }
                Submit Request
            </button>
            </div>
        </div>
    </div>
  )
}
