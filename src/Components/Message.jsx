import React from 'react';

const Message = ({ loading, message }) => {
   
  const renderMessage = () => {
    
    if (loading) {
      return "Loading...";
    } else if (message.length === 0) {
      return <span><i>I</i> will assist you in creating your project. <br/> Hit <i className='font-bold'>Start Conversation</i> Button to get started!</span>;
    } else {
      return message;
    }
  };

  return (
    <div className='md:text-2xl text-lg font-semibold relative w-full text-center overflow-y-auto max-h-[45vh] p-2 text-blue-600 text-wrap '>
      {
        renderMessage()
      }
    </div>
  );
};

export default Message;
