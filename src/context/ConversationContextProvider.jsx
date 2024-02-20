import React, { useState } from 'react';
import ConversationContext from './ConversationContext';

const ConversationContextProvider = ({children}) => {
    const [conversationCompleted, setConversationCompleted] = useState(false);
    const [conversation, setConversation] = useState([]);
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    return(
        <ConversationContext.Provider 
            value={{conversationCompleted, 
                    setConversationCompleted, 
                    conversation, 
                    setConversation,
                    playing, 
                    setPlaying,
                    loading, 
                    setLoading, 
                    processing, 
                    setProcessing}} >
            {children}
        </ConversationContext.Provider>
    )
}

export default ConversationContextProvider;