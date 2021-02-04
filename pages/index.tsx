// next imports
import Link from "next/link";
import { useRouter } from "next/router";

// styles | geist impots
import {
  Text,
  Button,
  Row,
  Page,
  Modal,
  Input,
  Collapse,
  Spacer,
  useMediaQuery,
} from "@geist-ui/react";
import { ChevronRightCircleFill } from "@geist-ui/react-icons";

// react imports
import { useState, useEffect } from "react";

// firebase
import fire from "../services/firebase";
import { makeId } from "../helpers/db";

const Home = () => {
  const router = useRouter();
  const db = fire.firestore();

  const [myRooms, setMyRooms] = useState([]);
  const [user, setUser] = useState(fire.auth().currentUser);
  const [authenticated, setAuthenticated] = useState(false);
  const [createdRoomName, setCreatedRoomName] = useState("");
  const [roomCodeForJoin, setRoomCodeForJoin] = useState("");
  const [modalJoinVisible, setModalJoinVisible] = useState(false);
  const [modalCreateVisible, setModalCreateVisible] = useState(false);

  const downXS = useMediaQuery("xs", { match: "down" });
  // const downSM = useMediaQuery("sm", { match: "up" });
  // const upMD = useMediaQuery("md", { match: "up" });
  // const upLG = useMediaQuery("lg", { match: "up" });

  useEffect(() => {
    interface RoomDoc {
      name: "string";
      id: "string";
    }
    fire.auth().onAuthStateChanged(function (user) {
      if (user) {
        setUser(fire.auth().currentUser);
        setAuthenticated(true);

        // search my rooms (current user)

        db.collection("rooms")
          .where("owner", "==", user.uid)
          .get()
          .then(function (querySnapshot) {
            let myRooms = [];
            querySnapshot.forEach(function (doc) {
              const newPartialDoc: RoomDoc = {
                name: doc.data().name,
                id: doc.data().roomId,
              };

              /* if (!myRooms.includes(newPartialDoc)) {
                setMyRooms((myRooms) => [...myRooms, newPartialDoc]);
              } */

              myRooms.push(newPartialDoc);
            });

            setMyRooms(myRooms);
          })
          .catch(function (error) {
            console.log("Error getting documents: ", error);
          });
      } else {
        setAuthenticated(false);
      }
    });
  }, []);

  // === modals | handler ===

  // open handler
  const handleModalCreate = () => setModalCreateVisible(true);
  const handleModalJoin = () => setModalJoinVisible(true);

  // close handler
  const handlerCloseModalCreate = () => {
    setModalCreateVisible(false);
    setCreatedRoomName("");
  };
  const handlerCloseModalJoin = () => {
    setModalJoinVisible(false);
    setRoomCodeForJoin("");
  };

  // === submit | handler ===

  // with creation of new room
  const handlerSubmitCreate = () => {
    const newRoomId = makeId(15);
    router.push({
      pathname: "/chat/[room]",
      query: {
        room: createdRoomName,
        roomId: newRoomId,
        type: "create",
      },
    });
  };

  // with join to an existing room
  const handlerSubmitJoin = () => {
    let docRef = db.collection("rooms").doc(roomCodeForJoin);
    let roomName: string;

    // search metadata for desired room and...
    // send query data to dynamic route /chat/room
    docRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          roomName = doc.data().name;
          router.push({
            pathname: "/chat/[room]",
            query: { room: roomName, roomId: roomCodeForJoin, type: "join" },
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  };

  // join to a room previusly created
  const handlerJoin = (roomName: string, roomId: string) => {
    router.push({
      pathname: "/chat/[room]",
      query: { room: roomName, roomId: roomId, type: "join" },
    });
  };

  return (
    <Page>
      {authenticated ? (
        <div>
          <Row justify="center">
            {downXS ? <Text h2>Welcome!</Text> : <Text h1>Welcome!</Text>}
          </Row>
          <Row justify="center">
            {downXS ? (
              <Text h5>Create a new room or join to an existing room</Text>
            ) : (
              <Text h3>Create a new room or join to an existing room</Text>
            )}
          </Row>
          <div
            style={{
              display: "flex",
              flexDirection: downXS ? "column" : "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              onClick={handleModalCreate}
              type="error"
              ghost
              style={{
                marginBottom: downXS ? "10px" : null,
                marginRight: downXS ? null : "10px",
              }}
            >
              Create
            </Button>
            <Button
              onClick={handleModalJoin}
              type="success"
              ghost
              style={{
                marginLeft: downXS ? null : "10px",
              }}
            >
              Join
            </Button>
          </div>
          <Spacer y={5} />

          <Row justify="center">
            <Collapse
              title="My Rooms"
              subtitle="Join the rooms created by you"
              style={{ width: downXS ? "85%" : "75%" }}
            >
              <div style={{}}>
                {myRooms.length === 0 ? (
                  <Text type="secondary">
                    {" "}
                    Hey! There aren't rooms here!{" "}
                    <b> Create your first room now</b>{" "}
                  </Text>
                ) : (
                  myRooms.map((room) => (
                    <Row
                      key={room.id}
                      align="middle"
                      justify={downXS ? "space-between" : "space-between"}
                    >
                      <Text b> {room.name} </Text>
                      {downXS ? null : <Spacer x={5} />}
                      {downXS ? null : (
                        <Text type="secondary"> {room.id} </Text>
                      )}
                      {downXS ? null : <Spacer x={5} />}{" "}
                      <button
                        onClick={() => handlerJoin(room.name, room.id)}
                        style={{ background: "transparent", border: "none" }}
                      >
                        <ChevronRightCircleFill />{" "}
                      </button>
                    </Row>
                  ))
                )}
              </div>
            </Collapse>
          </Row>

          <Modal open={modalCreateVisible} onClose={handlerCloseModalCreate}>
            <Modal.Title>Create a new Room</Modal.Title>
            <Modal.Content>
              <Row justify="center">
                <Input
                  clearable
                  placeholder="Room Name"
                  value={createdRoomName}
                  onChange={(e) => setCreatedRoomName(e.target.value)}
                ></Input>
              </Row>
            </Modal.Content>
            <Modal.Action passive onClick={() => handlerCloseModalCreate()}>
              Cancel
            </Modal.Action>
            <Modal.Action onClick={() => handlerSubmitCreate()}>
              Create
            </Modal.Action>
          </Modal>
          <Modal open={modalJoinVisible} onClose={handlerCloseModalJoin}>
            <Modal.Title>Join to an existing room</Modal.Title>
            <Modal.Content>
              <Row justify="center">
                <Input
                  clearable
                  placeholder="Room id here!"
                  value={roomCodeForJoin}
                  onChange={(e) => setRoomCodeForJoin(e.target.value)}
                ></Input>
              </Row>{" "}
            </Modal.Content>
            <Modal.Action passive onClick={() => setModalJoinVisible(false)}>
              Cancel
            </Modal.Action>
            <Modal.Action
              onClick={() => {
                handlerSubmitJoin();
              }}
            >
              Join
            </Modal.Action>
          </Modal>
        </div>
      ) : (
        <div>
          <Row justify="center">
            {downXS ? (
              <Text h2>Roomie Chat </Text>
            ) : (
              <Text h1>Roomie Chat</Text>
            )}
          </Row>
          <Row justify="center">
            {downXS ? (
              <Text h4 type="secondary">
                Click below to sign in or join
              </Text>
            ) : (
              <Text h2 type="secondary">
                Click below to sign in or join
              </Text>
            )}
          </Row>
          <Row justify="center">
            <Link href="/signup">
              <a>
                {" "}
                <Button type="success-light" size={downXS ? "small" : null}>
                  Get Started
                </Button>{" "}
              </a>
            </Link>
          </Row>
        </div>
      )}
    </Page>
  );
};

export default Home;
