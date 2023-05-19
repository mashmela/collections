import React from "react";
import Image from "next/image";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { GetServerSideProps } from "next";

import { setUser } from "store/userSlice";

import { getCurrentUser } from "utils/getCurrentUser";
import { sendRequest } from "utils/api";

import { UserInfoInterface } from "types";

interface UsersPageInterface {
  user: UserInfoInterface | null;
  listUsers: UserInfoInterface[];
}

function Users({ user, listUsers }: UsersPageInterface) {
  const router = useRouter();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!user) return;
    dispatch(setUser(user));
  }, [dispatch, listUsers, user]);

  const handleUserClick = React.useCallback(
    (id: number) => router.push("/profile/" + id),
    [router],
  );

  return (
    <WrapperUsers>
      <Headline>Users</Headline>
      {listUsers.map((user, index) => (
        <WrapperUserInfo onClick={() => handleUserClick(user._id)} key={index}>
          <IconUser
            width={80}
            height={80}
            src={user.avatarSrc !== null ? user.avatarSrc : "/images/wherePhoto.png"}
            alt="Avatar"
          />
          <div>{user.login}</div>
        </WrapperUserInfo>
      ))}
    </WrapperUsers>
  );
}

const WrapperUsers = styled("div")`
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 1000px;
  gap: 24px;
  padding-top: 24px;
`;

const IconUser = styled(Image)`
  border-radius: 50%;
  object-fit: cover;
`;

const WrapperUserInfo = styled("div")`
  display: flex;
  gap: 16px;
  align-items: center;
  padding-bottom: 24px;
  border-bottom: 2px #d9d9d9 solid;
  font-size: 24px;
  font-weight: 500;
  cursor: pointer;
`;

const Headline = styled("div")`
  font-size: 32px;
  font-weight: 900;
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getCurrentUser(context);
  const listUsers = await sendRequest<UserInfoInterface[]>("/users");

  return {
    props: {
      listUsers: listUsers.success ? listUsers.data : [],
      user,
    },
  };
};

export default Users;
