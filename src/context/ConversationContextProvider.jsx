import React, { useState } from 'react';
import ConversationContext from './ConversationContext';

const ConversationContextProvider = ({children}) => {
    const [conversationCompleted, setConversationCompleted] = useState(false);
    const [conversation, setConversation] = useState([]);

    return(
        <ConversationContext.Provider 
            value={{conversationCompleted, 
                    setConversationCompleted, 
                    conversation, 
                    setConversation}} >
            {children}
        </ConversationContext.Provider>
    )
}

export default ConversationContextProvider;