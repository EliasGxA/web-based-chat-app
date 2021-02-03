// next imports
import Link from "next/link";
import { useRouter } from "next/router";

// styles imports
import {
  Text,
  Button,
  Row,
  Input,
  Page,
  Spacer,
  useToasts,
  useMediaQuery,
} from "@geist-ui/react";
import styled from "styled-components";

// react imports
import { useState } from "react";
import { signup, signInWithGoogle } from "../helpers/auth";

const SignUp = () => {
  const router = useRouter();

  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setToast] = useToasts();
  const [authorizing, setAuthorizing] = useState({
    withGoogle: false,
    withEmail: false,
  });

  const downXS = useMediaQuery("xs", { match: "down" });

  const handleChange = (e) => {
    switch (e.target.name) {
      case "email":
        setEmail(e.target.value);
        break;

      case "password":
        setPassword(e.target.value);
        break;

      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    setAuthorizing((prevState) => ({ ...prevState, withEmail: true }));

    e.preventDefault();
    setError("");
    try {
      await signup(email, password);

      router.push("/");
    } catch (err) {
      setError(err.message);
      setToast({
        text: err.message,
        type: "error",
      });
    }
    // update authorizing state
    setAuthorizing((prevState) => ({ ...prevState, withEmail: false }));
  };

  const googleSignIn = async () => {
    setAuthorizing((prevState) => ({ ...prevState, withGoogle: true }));

    try {
      const result = await signInWithGoogle();
      const { user } = result;

      if (!user) {
        throw new Error("That was an issue authorizing");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(err.message);
      setToast({
        text: err.message,
        type: "error",
      });
    }

    // update authorizing state
    setAuthorizing((prevState) => ({ ...prevState, withGoogle: false }));
  };

  return (
    <Page>
      <form onSubmit={handleSubmit}>
        <Row justify="center">
          {downXS ? (
            <Text h2>
              Sign Up to
              <Link href="/">
                <a> Roomie </a>
              </Link>
            </Text>
          ) : (
            <Text h1>
              Sign Up to
              <Link href="/">
                <a> Roomie </a>
              </Link>
            </Text>
          )}
        </Row>
        <Row justify="center">
          <Text size={downXS ? 16 : null}>
            {" "}
            Fill in the form below to create an account.
          </Text>
        </Row>

        <Row justify="center" style={{ marginBottom: "2px" }}>
          <InputContainer>
            <Input
              //icon={<Mail />}
              width={downXS ? "100%" : "350px"}
              placeholder="Email"
              name="email"
              type="email"
              onChange={handleChange}
              value={email}
            ></Input>
          </InputContainer>
        </Row>
        <Spacer y={0.2} />
        <Row justify="center">
          <InputContainer>
            <Input.Password
              //icon={<Key />}
              width={downXS ? "100%" : "350px"}
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={password}
              type="password"
            />
          </InputContainer>
        </Row>
        <Spacer y={0.2} />
        <Row justify="center">
          {error ? (
            <Text size={downXS ? 14 : 16} type="error">
              There is an error here! Check your Network
            </Text>
          ) : null}
        </Row>
        <Spacer y={1} />
        <Row justify="center">
          <Button
            loading={authorizing.withEmail}
            htmlType="submit"
            style={{ width: "350px" }}
            type="success"
          >
            Sign up
          </Button>
        </Row>
        <Spacer y={0.3} />

        <Row justify="center">
          <Button
            loading={authorizing.withGoogle}
            style={{ width: "350px" }}
            type="secondary"
            onClick={googleSignIn}
          >
            Sign up with Google
          </Button>
        </Row>
        <Line />
        <Row justify="center">
          <Text size={downXS ? 14 : 18} type="secondary">
            Already have an account?
            <Link href="/login">
              <a>
                {" "}
                <Button auto ghost>
                  {" "}
                  Login{" "}
                </Button>{" "}
              </a>
            </Link>
          </Text>
        </Row>
      </form>
    </Page>
  );
};

export default SignUp;

const Line = styled.hr`
  width: 350px;
  margin-top: 20px;
  margin-bottom: -10px;
`;

const InputContainer = styled.div`
  width: 350px;
`;
