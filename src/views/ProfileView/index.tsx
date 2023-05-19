import React from "react";
import styled from "styled-components";
import { GetServerSideProps } from "next";
import { useSelector } from "react-redux";

import ModalItem from "components/ModalItem";

import Collection from "views/ProfileView/Collection";
import Header from "views/ProfileView/Header";

import { RootState } from "store";

import { getCurrentUser } from "utils/getCurrentUser";
import { sendRequest } from "utils/api";

import { UserInfoInterface } from "types";

const ITEMS_COUNT = 8;
const ITEMS_COUNT_MOBILE = 4;
const MOBILE_SCREEN_SIZE = 640;
const GAP_BETWEEN_ITEMS = 10;

function ProfileView() {
  const refCollection = React.useRef<HTMLDivElement | null>(null);

  const user = useSelector((state: RootState) => state.user.userInfo);
  const profileUser = useSelector((state: RootState) => state.profile.profile);

  const [itemSize, setItemSize] = React.useState<number | null>(null);

  const isSameUser = React.useMemo(() => {
    if (!user || !profileUser) return false;
    return user?._id === profileUser?._id;
  }, [user, profileUser]);

  const recalulateItemSize = React.useCallback(() => {
    if (!refCollection.current) return;
    const containerWidth = refCollection.current.offsetWidth;
    const itemsCount = containerWidth > MOBILE_SCREEN_SIZE ? ITEMS_COUNT : ITEMS_COUNT_MOBILE;
    const sizeImage = (containerWidth - GAP_BETWEEN_ITEMS * (itemsCount - 1)) / itemsCount;
    setItemSize(sizeImage);
  }, []);

  React.useEffect(() => {
    if (!profileUser) return;
    recalulateItemSize();
    window.addEventListener("resize", recalulateItemSize);
    () => window.removeEventListener("resize", recalulateItemSize);
  }, [profileUser, recalulateItemSize]);

  if (!profileUser) return null;

  return (
    <WrapperUser>
      <Header />
      <CollectionStyle>
        <Post ref={(ref) => (refCollection.current = ref)}>
          {itemSize && profileUser.collections.length > 0
            ? profileUser.collections.map((collection, index) => (
                <Collection
                  key={index}
                  collectionIndex={index}
                  desk={collection}
                  size={itemSize}
                  rightToEdit={isSameUser}
                />
              ))
            : "No collections("}
        </Post>
      </CollectionStyle>
      <ModalItem rightToEdit={isSameUser} />
    </WrapperUser>
  );
}

const WrapperUser = styled("div")`
  display: flex;
  flex-direction: column;
  margin: auto;
  max-width: 1000px;
  width: 100%;
  gap: 40px;
`;

const CollectionStyle = styled("div")`
  display: flex;
  gap: 30px;
  flex-direction: column;
`;

const Post = styled("div")`
  display: flex;
  gap: 10px;
  flex-direction: column;
  align-items: start;
  width: 100%;
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getCurrentUser(context);
  const userId = context.params?.id;

  const userInformation = await sendRequest<UserInfoInterface[]>("/user", { _id: userId });

  if (!userInformation.success)
    return {
      props: {},
      redirect: {
        destination: "/users",
      },
    };

  return {
    props: {
      user,
      userInformation: userInformation.data,
    },
  };
};

export default React.memo(ProfileView);
