import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Message from '../Message'

interface IProps {
  pages?: {
    data: Message[],
    conversationId: string,
  }[];
  setConversation: Dispatch<SetStateAction<Message[]>>;
  currConversationId: string;
}

const MessageContainer = ({ pages, currConversationId, setConversation }: IProps) => {
  
  if (!pages) {
    return <div>something went wrong</div>
  }
  
  return (
    <div>
      {pages
        ?.reduce((sum, next) => {
        return [...next.data, ...sum]
      }, [] as Message[])
        .map(message => (
          <Message
              content={message}
              setConversation={setConversation}
              key={message._id || message.time}
              currConversationId={pages[0].conversationId}
            />
        ))
    } 
    </div>
  )
}

export default MessageContainer