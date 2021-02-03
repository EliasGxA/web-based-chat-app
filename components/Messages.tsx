import React from "react";
import styled from "styled-components";
import ScrollToBottom from "react-scroll-to-bottom";

import Message from "./Message";

const Messages = ({
  messages,
}: {
  messages: Array<{
    content: string;
    uid: string;
    sender: string;
    senderEmail: string;
    timestamp: number;
  }>;
}) => {
  //console.log(messages);

  return (
    <ScToBottom>
      {messages.map((message, i) => (
        <div key={i}>
          <Message message={message} />
        </div>
      ))}
    </ScToBottom>
  );
};

export default Messages;

const ScToBottom = styled(ScrollToBottom)`
  padding: 3px 0;
  overflow: auto;
  flex: auto;
  // background-color: #ededed;
`;
