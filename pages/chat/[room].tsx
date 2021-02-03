// style impots
import styled from "styled-components";
import { useToasts, Loading, Row, Modal, Text } from "@geist-ui/react";

// next imports
import { useRouter } from "next/router";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

// react imports
import { useEffect, useState } from "react";

// local imports
import Infobar from "../../components/InfoBar";
import InputArea from "../../components/InputArea";
import Messages from "../../components/Messages";

import fire from "../../services/firebase";
import { logout } from "../../helpers/auth";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { room, roomId, type } = context.query;

  return {
    props: { room, roomId, type }, // will be passed to the page component as props
  };
};

const Chat = ({
  room,
  roomId,
  type,
}: {
  room: string;
  roomId: string;
  type: string;
}) => {
  const router = useRouter();

  const auth = fire.auth;
  const db = fire.firestore();

  const [user, setUser] = useState(auth().currentUser);
  const [roomName, setRoomName] = useState(room);
  const [chats, setChats] = useState([]);
  const [content, setContent] = useState("");
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [modalInfoVisible, setModalInfoVisible] = useState(false);

  const [, setToast] = useToasts();

  useEffect(() => {
    fire.auth().onAuthStateChanged(function (user) {
      if (user) {
        setUser(auth().currentUser);
        setLoadingUser(false);
      } else {
        setLoadingUser(true);
      }
    });

    setLoadingChats(true);

    //=== on create new room ===
    if (type === "create") {
      if (roomId) {
        // create "rooms collection" at first time
        // create new room document
        try {
          db.collection("rooms").doc(roomId).set({
            name: roomName,
            roomId: roomId,
            owner: user.uid,
          });

          setToast({
            text: `Room created. Share your room id code: ${roomId}`,
            type: "success",
            delay: 10000,
          });
        } catch (error) {
          console.log("createRoom", error.message);
        }
      }
    }

    // read chats for this room
    try {
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .onSnapshot((snap) => {
          const chats = snap.docs.map((doc) => ({
            //   id: doc.id,
            ...doc.data(),
          }));

          chats.sort(function (a, b) {
            return a.timestamp - b.timestamp;
          });

          setChats(chats);
          setLoadingChats(false);
        });
    } catch (error) {
      console.log("readchats", error.message);
    }
  }, []);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    try {
      db.collection("rooms").doc(roomId).collection("messages").add({
        content: content,
        timestamp: Date.now(),
        uid: user.uid,
        sender: user.displayName,
        senderEmail: user.email,
      });
      setContent("");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlerLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.log("logout error: ", err.message);
    }
  };

  const formatTime = (timestamp: string | number | Date) => {
    const d = new Date(timestamp);
    const time = `${d.getDate()}/${
      d.getMonth() + 1
    }/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    return time;
  };

  const handlerModal = () => setModalInfoVisible(true);
  const closeHandlerModal = () => setModalInfoVisible(false);

  return (
    <OuterContainer>
      {!loadingUser ? (
        <Container>
          <Infobar
            room={roomName}
            handlerLogout={handlerLogout}
            handlerModal={handlerModal}
          />
          <Messages messages={chats} />
          <InputArea
            message={content}
            setMessage={setContent}
            sendMessage={handleSubmit}
          />{" "}
          <Modal open={modalInfoVisible} onClose={closeHandlerModal}>
            <Modal.Title>Info!</Modal.Title>
            <Modal.Subtitle>
              Share this code and... happy chatting
            </Modal.Subtitle>
            <Modal.Content>
              <Row justify="center">
                <Text>
                  {" "}
                  room code: <Text b> {roomId} </Text>{" "}
                </Text>
              </Row>
            </Modal.Content>
          </Modal>
        </Container>
      ) : (
        <Row style={{ padding: "10px 0" }}>
          <Loading>Loading</Loading>
        </Row>
      )}
    </OuterContainer>
  );
};

export default Chat;

const OuterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  //background-color: rgba(39, 52, 67);

  @media (min-width: 320px) and (max-width: 480px) {
    //height: 100%;
  }
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #ffffff;
  border-radius: 8px;
  height: 85%;
  width: 70%;

  @media (max-width: 1024px) {
    width: 100%;
    height: 100%;
  }

  @media (min-width: 1024px) and (max-width: 1920px) {
    width: 60%;
  }
`;
