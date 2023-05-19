import React from "react";
import { useDispatch } from "react-redux";
import { GetServerSideProps } from "next";

import ProfileView from "views/ProfileView";

import { setUser } from "store/userSlice";
import { setProfile } from "store/profileSlice";

import { sendRequest } from "utils/api";
import { getCurrentUser } from "utils/getCurrentUser";

import { UserInfoInterface } from "types";

interface UserPageInterface {
  user: UserInfoInterface | null;
  userInformation: UserInfoInterface;
}

function User({ user, userInformation }: UserPageInterface) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setProfile(userInformation));
    if (!user) return;
    dispatch(setUser(user));
  }, [dispatch, user, userInformation]);

  return <ProfileView />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getCurrentUser(context);
  const userId = context.params?.id;

  const userInformation = await sendRequest<UserInfoInterface[]>("/user", { _id: userId });

  if (userInformation.success)
    return {
      props: {
        user,
        userInformation: userInformation.data,
      },
    };

  return {
    props: {},
    redirect: {
      destination: "/users",
    },
  };
};

export default User;
