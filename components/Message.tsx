import { useState, useEffect } from "react";
import styled from "styled-components";
import ReactEmoji from "react-emoji";
import fire from "../services/firebase";

const Message = ({
  message: { content, uid, sender, senderEmail },
}: {
  message: {
    content: string;
    uid: string;
    sender: string;
    senderEmail: string;
  };
}) => {
  const [user, setUser] = useState(fire.auth().currentUser);

  useEffect(() => {
    fire.auth().onAuthStateChanged(function (user) {
      if (user) {
        setUser(fire.auth().currentUser);
        // setLoadingUser(false);
      } else {
        //setLoadingUser(true);
      }
    });
  }, []);

  let isSentByCurrentUser = false;
  if (user.uid === uid) {
    isSentByCurrentUser = true;
  }

  const currenUserEmail = user.email.split("@")[0];
  let displayInChatCurrentName = user.displayName || currenUserEmail;

  const displaySenderEmail = senderEmail.split("@")[0];

  let displayInChatAhotherName;

  if (sender) {
    displayInChatAhotherName = sender.trim().toLowerCase();
  } else {
    displayInChatAhotherName = displaySenderEmail;
  }

  return isSentByCurrentUser ? (
    <MessageContainer justifyEnd>
      <SentText pr_10>{displayInChatCurrentName}</SentText>
      <MessageBox backgroundBlue>
        <MessageText colorWhite>{ReactEmoji.emojify(content)}</MessageText>
      </MessageBox>
    </MessageContainer>
  ) : (
    <MessageContainer justifyStart>
      <MessageBox backgroundLight>
        <MessageText colorDark>{ReactEmoji.emojify(content)}</MessageText>
      </MessageBox>
      <SentText pl_10>{displayInChatAhotherName}</SentText>
    </MessageContainer>
  );
};

export default Message;

const MessageContainer = styled.div`
  display: flex;
  justify-content: ${(props) => (props.justifyEnd ? "flex-end" : "flex-start")};
  padding: 0 5%;
  margin-top: 3px;
`;

const SentText = styled.p`
  display: flex;
  align-items: center;
  font-family: Helvetica;
  color: #828282;
  letter-spacing: 0.3px;
  padding-left: ${(props) => (props.pl_10 ? "10px" : null)};
  padding-right: ${(props) => (props.pr_10 ? "10px" : null)};

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;
const MessageBox = styled.div`
  border-radius: 8px;
  padding: 0px 20px;
  color: white;
  height: auto;
  display: inline-block;
  max-width: 70%;
  background: ${(props) => (props.backgroundLight ? "#273443" : "#bbdefb")};
`;

const MessageText = styled.p`
  width: 100%;
  letter-spacing: 0;
  float: left;
  font-size: 1.1rem;
  color: ${(props) => (props.colorWhite ? "#353535" : "white")};

  > img {
    vertical-align: middle;
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;
