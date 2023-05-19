import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import { GetServerSideProps } from "next";

import Input from "primitives/Input";

import { sendRequest } from "utils/api";
import { getCurrentUser } from "utils/getCurrentUser";

import { UserInfoInterface } from "types";

function Login() {
  const router = useRouter();
  const [disabledButton, setDisabledButton] = React.useState(true);
  const [loginValue, setLoginValue] = React.useState("");
  const [passwordValue, setPasswordValue] = React.useState("");
  const [errorLogin, setErrorLogin] = React.useState(false);

  React.useEffect(() => {
    if (loginValue === "" || passwordValue.length < 4) return setDisabledButton(true);
    setDisabledButton(false);
  }, [loginValue, passwordValue.length, disabledButton]);

  const handleButtonLogin = React.useCallback(async () => {
    const response = await sendRequest<UserInfoInterface>("/login", {
      login: loginValue,
      password: passwordValue,
    });
    if (!response.success) {
      setErrorLogin(true);
      return;
    }
    router.push("/profile/" + response.data._id);
    setCookie("login", loginValue, { path: "/" });
    setCookie("password", passwordValue, { path: "/" });
  }, [router, loginValue, passwordValue]);

  const handleButtonClick = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.code !== "Enter") return;
      handleButtonLogin();
    },
    [handleButtonLogin],
  );

  return (
    <WrapperLogin onKeyDown={handleButtonClick}>
      <H1>Welcome back!</H1>
      Login
      <Input
        value={loginValue}
        placeholder="Enter your nickname"
        onChange={(ev) => setLoginValue(ev.target.value)}
      />
      Password
      <Input
        type="password"
        value={passwordValue}
        placeholder="Enter your password"
        onChange={(ev) => setPasswordValue(ev.target.value)}
      />
      <Button onClick={handleButtonLogin} disabled={disabledButton}>
        Login
      </Button>
      {errorLogin && <ErrorText>Invalid password or login</ErrorText>}
      <RegisterLink href="/registration">
        Don&apos;t have an account? Register on the site!
      </RegisterLink>
    </WrapperLogin>
  );
}

const WrapperLogin = styled("div")`
  display: flex;
  flex-direction: column;
  margin: auto;
  gap: 10px;
  padding: 120px 10px 0 10px;
`;

const H1 = styled("div")`
  font-size: 32px;
  font-weight: 900;
`;

const RegisterLink = styled(Link)`
  font-size: 14px;
  color: #74a4be;
  width: fit-content;
  display: flex;

  :hover {
    color: #2ba3e7;
  }
`;

const Button = styled("button")`
  background: black;
  color: white;
  padding: 8px 24px;
  border-radius: 4px;
  font-size: 16px;
  border: none;
  transition: 1ms ease-in-out;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  :hover {
    background: #424242;
  }
  :disabled {
    background: #d9d9d9;
    cursor: auto;
  }
`;

const ErrorText = styled("div")`
  font-style: italic;
  color: #e71b1b;
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getCurrentUser(context);
  if (user)
    return {
      props: {},
      redirect: {
        destination: "/profile/" + user._id,
      },
    };

  return {
    props: {},
  };
};

export default Login;
