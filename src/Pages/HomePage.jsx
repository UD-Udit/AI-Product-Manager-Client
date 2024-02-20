import React, { useEffect, useState, useRef, useContext } from "react";
import { Navbar } from "../Components/Navbar";
import { InputBar } from "../Components/InputBar";
import { Response } from "../Components/Response";
import axios from "axios";
import baseURL from "../config";
import ConversationContext from "../context/ConversationContext";

function HomePage() {
  const [audioURL, setAudioURL] = useState(null);
  const [message, setMessage] = useState("");
  const [assistantId, setAssistantId] = useState("");
  const [threadId, setThreadId] = useState("");
  const [messageNo, setMessageNo] = useState(0);
  const apiKey = process.env.REACT_APP_API_KEY;
  const {setLoading, setProcessing} = useContext(ConversationContext);

  // WEBSPEECH
  const [ listening, setListening ] = useState(false);
  const [ transcript, setTranscript ] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    let recognition = null;
    if (listening) {
      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = true;
      recognition.onresult = (event) => {
        const currentTranscript = event.results[event.results.length - 1][0].transcript;
          setListening(false);
          setTranscript(currentTranscript);
          handleAssistantCall(currentTranscript);
      };
      recognition.playinline = true;
      recognitionRef.current = recognition;
      recognition.start();
    }

    const timeoutId = setTimeout(() => {
      if (transcript.trim() !== '') {
        setListening(false);
        if (recognition) {
          recognition.stop();
        }
      }
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
      if (recognition) {
        recognition.stop();
      }
    };
  }, [listening, transcript]);

// AI Assistant for generating response
const handleAssistantCall = async (prompt) => {
  try {
    setLoading(true);
    if (prompt.trim().length === 0) return;
    const response = await axios.post(`${baseURL}/assistant/chat`, {
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

// OpenAI TTS for voice
const handleApiCall = async (prompt) => {
  try {
    setProcessing(true);
    if(prompt.length === 0) {
      setLoading(false);
      return;
    };
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
    setProcessing(false);
  }
}

const handleStartConversation = async (language) => {
  try {
    setLoading(true);
    const response = await axios.post(`${baseURL}/assistant/`, {
      language: language
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { assistantId, content, threadId } = response.data;
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
  recognitionRef.current.onresult = null;
  recognitionRef.current.stop();
  handleAssistantCall(transcript);
}


const pauseListening = () => {
  if (recognitionRef.current) {
    setListening(false);
    recognitionRef.current.onresult = null;
    recognitionRef.current.stop();
  }
}


  return (   
    <div className="w-full bg-[#121112] h-screen flex flex-col gap-2">
      <Navbar />
      <div className=" flex gap-10 md:gap-6 flex-col justify-center items-center">
      
      <Response 
        audioURL={audioURL} 
        message={message} 
        handleStart={handleStart}
        messageNo={messageNo}
        pauseListening={pauseListening}  />
      <InputBar 
        transcript={transcript} 
        handleStart = {handleStart}
        handleStop={handleStop}
        listening={listening}
        pauseListening={pauseListening}
        handleStartConversation={handleStartConversation}
        startListening={()=>setListening(true)}
        resetTranscript={resetTranscript}
        threadId={threadId}
      />

        </div>
    </div>
        
  );
}

export default HomePage;

