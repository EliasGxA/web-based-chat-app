import { Send } from "@geist-ui/react-icons";
import React from "react";
import styled from "styled-components";

const InputArea = ({
  setMessage,
  sendMessage,
  message,
}: {
  setMessage: Function;
  sendMessage: Function;
  message: string;
}) => (
  <Form>
    <InputC
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={(event) =>
        event.key === "Enter" ? sendMessage(event) : null
      }
    ></InputC>
    <SendButton onClick={(e) => sendMessage(e)}>
      <Send color="#273443" />
    </SendButton>
  </Form>
);

export default InputArea;

const Form = styled.form`
  position: sticky;
  display: flex;
  justify-content: space-between;
`;
const InputC = styled.input`
  border: none;
  border-radius: 50px;
  padding-left: 4%;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 80%;
  font-size: 1.1em;
  background-color: rgba(80, 133, 139, 0.1);
  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;
const SendButton = styled.button`
  border: none;
  border-radius: 50px;
  width: 5%;
  background-color: transparent;
  margin-right: 2%;
  display: flex;
  justify-content: center;
  align-items: center;

  :hover {
    cursor: pointer;
  }

  @media (max-width: 768px) {
    width: 40px;
  }
`;
