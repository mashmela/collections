import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "styled-components";
import { deleteCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "store";
import { setUser } from "store/userSlice";

function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.userInfo);

  const handleButtonLogout = React.useCallback(async () => {
    deleteCookie("login");
    deleteCookie("password");
    router.push("/users");
    dispatch(setUser(null));
  }, [dispatch, router]);

  return (
    <HeaderStyle>
      <WrapperLinks>
        <StyledLink href="/users">users</StyledLink>
        <StyledLink href="/">Collections</StyledLink>
        {user ? (
          <NameAndLogout>
            <StyledLink href={"/profile/" + user._id}>{user.login}</StyledLink>
            <StyledImage
              onClick={handleButtonLogout}
              src="/icon/logout.png"
              alt=""
              width={18}
              height={18}
            />
          </NameAndLogout>
        ) : (
          <StyledLink href="/login">log in</StyledLink>
        )}
      </WrapperLinks>
    </HeaderStyle>
  );
}

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
`;

const WrapperLinks = styled("div")`
  display: flex;
  margin: auto;
  max-width: 1000px;
  justify-content: space-between;
  padding: 10px 10px;
`;

const HeaderStyle = styled("div")`
  font-weight: 600;
  background: black;
  color: white;
`;

const NameAndLogout = styled("div")`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StyledImage = styled(Image)`
  cursor: pointer;

  &:hover {
    transition: all 0.1s ease-in-out;
    filter: brightness(0.7);
  }
`;

export default React.memo(Header);
