import Popover from "@geist-ui/react";
import React from "react";

import styled from "styled-components";
import { MessageCircle, LogOut, Users, Info } from "@geist-ui/react-icons";

const InfoBar = ({
  room,
  handlerLogout,
  handlerModal,
}: {
  room: string;
  handlerLogout: Function;
  handlerModal: Function;
}) => (
  <InfoBarContainer>
    <LeftInnerContainer>
      <MessageCircle color="#353535" />
      <RoomName>{room}</RoomName>
    </LeftInnerContainer>
    <RightInnerContainer>
      <IconButton>
        <Info color="#353535" onClick={() => handlerModal()} />
      </IconButton>
      <IconButton>
        <LogOut color="#353535" onClick={() => handlerLogout()} />
      </IconButton>
    </RightInnerContainer>
  </InfoBarContainer>
);

export default InfoBar;

const InfoBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #bbdefb;
  border-radius: 4px 4px 0 0;
  height: 40px;
  width: 100%;
`;
const LeftInnerContainer = styled.div`
  flex: 0.5;
  display: flex;
  align-items: center;
  margin-left: 5%;
`;
const RightInnerContainer = styled.div`
  display: flex;
  flex: 0.5;
  justify-content: flex-end;
  margin-right: 2%;
`;

const RoomName = styled.h3`
  margin-left: 5%;
  color: #353535;

  @media (max-width: 280px) {
    font-size: 18px;
  }
`;

const IconButton = styled.button`
  background-color: transparent;
  margin-left: 10px;
  border: none;

  :hover {
    cursor: pointer;
  }
`;
