import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";

import Input from "primitives/Input";

import { sendRequest } from "utils/api";

function Registration() {
  const router = useRouter();

  const [disabledButton, setDisabledButton] = React.useState(true);
  const [loginValue, setLoginValue] = React.useState("");
  const [passwordValue, setPasswordValue] = React.useState("");
  const [repeatPasswordValue, setRepeatPasswordValue] = React.useState("");
  const [errorLogin, setErrorLogin] = React.useState(false);
  const [errorPassword, setErrorPassword] = React.useState(false);

  React.useEffect(() => {
    if (loginValue === "" || passwordValue.length < 4) return setDisabledButton(true);
    setDisabledButton(false);
  }, [loginValue, passwordValue.length, disabledButton]);

  const handleButtonRegistration = React.useCallback(async () => {
    if (passwordValue !== repeatPasswordValue) {
      setErrorPassword(true);
      return;
    }
    const response = await sendRequest<{ id: string }>("/registrationUser", {
      login: loginValue,
      password: passwordValue,
    });
    if (!response.success) {
      setErrorLogin(true);
      return;
    }
    router.push("/profile/" + response.data.id);
    setCookie("login", loginValue, { path: "/" });
    setCookie("password", passwordValue, { path: "/" });
  }, [loginValue, passwordValue, repeatPasswordValue, router]);

  const handleButtonClick = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.code !== "Enter") return;
      handleButtonRegistration();
    },
    [handleButtonRegistration],
  );

  return (
    <WrapperRegistration onKeyDown={handleButtonClick}>
      <H1>Welcome!</H1>
      <WrapperHeader>
        Login{errorLogin && <ErrorText>This login is already exists</ErrorText>}
      </WrapperHeader>
      <Input
        value={loginValue}
        placeholder="Enter your nickname"
        onChange={(ev) => setLoginValue(ev.target.value)}
      />
      <WrapperHeader>
        Password{errorPassword && <ErrorText>Password mismatch</ErrorText>}
      </WrapperHeader>
      <Input
        type="password"
        value={passwordValue}
        placeholder="Enter your password"
        onChange={(ev) => setPasswordValue(ev.target.value)}
      />
      Repeat password
      <Input
        type="password"
        value={repeatPasswordValue}
        placeholder="Enter your password"
        onChange={(ev) => setRepeatPasswordValue(ev.target.value)}
      />
      <Button onClick={handleButtonRegistration} disabled={disabledButton}>
        Create account
      </Button>
      <RegisterLink href="/login">
        Do you already have an account?Login to your account !
      </RegisterLink>
    </WrapperRegistration>
  );
}

const WrapperRegistration = styled("div")`
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

const WrapperHeader = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ErrorText = styled("div")`
  font-style: italic;
  color: #e71b1b;
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

export default Registration;
