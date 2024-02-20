import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import { SubmitPage } from "./Pages/SubmitPage";
import ConversationContextProvider from "./context/ConversationContextProvider";
import { ThankYou } from "./Pages/ThankYou";

function App() {
  return (
    <ConversationContextProvider> 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
            <HomePage />
        } />
        <Route path="/submit/:threadId" element={ 
            <SubmitPage />
        }/>
        <Route path="/thankyou" element={
          <ThankYou />
        }/>
      </Routes>
    </BrowserRouter>
    </ConversationContextProvider>
  );
}

export default App;
