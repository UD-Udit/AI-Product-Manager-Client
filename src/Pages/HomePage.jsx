import React, { useEffect, useState, useRef } from "react";
import { Navbar } from "../Components/Navbar";
import { InputBar } from "../Components/InputBar";
import { Response } from "../Components/Response";
import axios from "axios";

function HomePage() {
  const [audioURL, setAudioURL] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [assistantId, setAssistantId] = useState("");
  const [threadId, setThreadId] = useState("");
  const [messageNo, setMessageNo] = useState(0);
  const apiKey = process.env.REACT_APP_API_KEY;

  // WEBSPEECH
  const [ listening, setListening ] = useState(false);
  const [ transcript, setTranscript ] = useState("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (listening) {
      console.log("Listening...");
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event) => {
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (!event.results[i].isFinal) {
            interimTranscript += event.results[i][0].transcript + " ";

          }
        }
        if (interimTranscript !== "") {
          setTranscript(interimTranscript);
          clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setListening(false);
            recognition.stop();
            handleAssistantCall(interimTranscript);
          }, 3000);
        }
      };
      recognition.start();
      return () => {
        clearTimeout(timeoutRef.current);
        recognition.stop();
      };
    }
  }, [listening]);


  const handleAssistantCall = async (prompt) => {
    try {
      setLoading(true);
      if (prompt.trim().length === 0) return;
      const response = await axios.post("https://ai-product-manager.onrender.com/assistant/chat", {
        message: prompt,
        threadId: threadId,
        assistantId: assistantId
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        handleApiCall(response.data.content);
        setMessage("Generating...");
      }
    } catch (e) {
      console.log(e.message);
    } finally {
      setLoading(false);
    }
  }

  const handleApiCall = async (prompt) => {
    try {
      setLoading(true);
      if(prompt.length === 0) return;
      const response = await fetch(`https://api.openai.com/v1/audio/speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(
          { 
            model: 'tts-1',
            voice: "alloy",
            input: prompt
          }),
      });
      if (!response.ok) {
        throw new Error('TTS submission failed');
      }
   
      const audioStream = await response.blob();
      const voiceURL = URL.createObjectURL(audioStream);
      setAudioURL(voiceURL);
      setMessage(prompt);
      setMessageNo((messageNo) => messageNo+1);
      
    }catch (error) {
        setMessage("TTS Error!");
        console.error("Error during API call:", error.message);
    }finally{
      setLoading(false);
    }
  }

  const handleStartConversation = async (language) => {
    try {
      setLoading(true);
      const response = await axios.post("https://ai-product-manager.onrender.com/assistant/", {
        language: language
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { assistantId, content, threadId } = response.data;
      setMessage("Generating...");
      setAssistantId(assistantId);
      setThreadId(threadId);
      handleApiCall(content);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetTranscript = () => {
    setTranscript("");
  }

  const handleStart = () => {
    resetTranscript();
    setListening(true);
  }

  const handleStop = () => {
    setListening(false);
    handleApiCall(transcript);
  }


  return (   
    <div className="w-full bg-[#121112] h-screen flex flex-col gap-2">
      <Navbar />
      <div className=" flex gap-10 md:gap-6 flex-col justify-center items-center">
      
      <Response 
        audioURL={audioURL} 
        message={message} 
        loading={loading} 
        handleStart={handleStart}
        messageNo={messageNo}  />
      <InputBar 
        transcript={transcript} 
        handleStart = {handleStart}
        handleStop={handleStop}
        listening={listening}
        stopListening={() => setListening(false)}
        handleStartConversation={handleStartConversation}
        loading={loading}
        startListening={()=>setListening(true)}
        resetTranscript={resetTranscript}
        threadId={threadId}
      />

        </div>
    </div>
        
  );
}

export default HomePage;

