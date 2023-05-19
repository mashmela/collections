import React from "react";
import Image from "next/image";
import Compressor from "compressorjs";
import styled from "styled-components";
import { setCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";

import Input from "primitives/Input";
import StyledButton from "primitives/StyledButton";

import Tool from "components/Tool";

import { RootState } from "store";
import { setProfile } from "store/profileSlice";

import { sendRequest } from "utils/api";

import { UserInfoInterface } from "types";

function ProfileHeader() {
  const dispatch = useDispatch();
  const inputRefAvatar = React.useRef<HTMLInputElement | null>(null);

  const user = useSelector((state: RootState) => state.user.userInfo);
  const profileUser = useSelector((state: RootState) => state.profile.profile);

  const [showConstructor, setShowConstructor] = React.useState(false);
  const [nameCollection, setNameCollection] = React.useState("");
  const [newAvatar, setNewAvatar] = React.useState<string | null>("");
  const [newLogin, setNewLogin] = React.useState("");
  const [editUserInfo, setEditUserInfo] = React.useState(false);

  const isSameUser = React.useMemo(() => {
    if (!user || !profileUser) return false;
    return user?._id === profileUser?._id;
  }, [user, profileUser]);

  React.useEffect(() => {
    setNewAvatar(profileUser?.avatarSrc || "");
    setNewLogin(profileUser?.login || "");
  }, [profileUser]);

  const handleCollectionCreate = React.useCallback(async () => {
    if (!profileUser) return;
    setShowConstructor(false);
    const response = await sendRequest<UserInfoInterface>("/collections/createCollection", {
      _id: profileUser._id,
      name: nameCollection,
    });
    if (!response.success) return;
    dispatch(setProfile(response.data));
  }, [dispatch, nameCollection, profileUser]);

  const handleEditProfile = React.useCallback(() => setEditUserInfo((value) => !value), []);

  const handleEditAvatar = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    if (!ev.target.files) return;
    const file = ev.target.files[0];
    if (!file) return;

    new Compressor(file, {
      maxWidth: 200,
      maxHeight: 200,
      success(result) {
        const fileReader = new FileReader();
        fileReader.onload = (ev) => {
          if (!ev.target) return;
          setNewAvatar(ev.target.result as string);
        };
        fileReader.readAsDataURL(result);
      },
    });
  }, []);

  const onDivClick = React.useCallback(() => {
    if (inputRefAvatar.current === null) return;
    inputRefAvatar.current.click();
  }, []);

  const handleButtonClick = React.useCallback(async () => {
    if (!profileUser) return;
    if (!editUserInfo) setShowConstructor(true);
    const response = await sendRequest<UserInfoInterface>("/editUserInfo", {
      _id: profileUser._id,
      login: newLogin,
      avatarSrc: newAvatar,
    });
    if (!response.success) return;
    setCookie("login", newLogin, { path: "/" });
    dispatch(setProfile({ ...profileUser, login: newLogin }));
    setEditUserInfo(false);
  }, [dispatch, editUserInfo, newAvatar, newLogin, profileUser]);

  if (!profileUser) return null;

  return (
    <WrapperInfo>
      <WrapperSpaceBetween>
        {editUserInfo ? (
          <Info>
            <WrapperAvatarEditor>
              <StyledImage
                onClick={onDivClick}
                width={100}
                height={100}
                src={newAvatar || "/images/wherePhoto.png"}
                alt="Avatar"
              />
            </WrapperAvatarEditor>
            <input
              style={{ display: "none" }}
              onChange={handleEditAvatar}
              ref={inputRefAvatar}
              type="file"
            />
            <div>
              <div>
                <Input value={newLogin} onChange={(ev) => setNewLogin(ev.target.value)} />
              </div>
            </div>
          </Info>
        ) : (
          <Info>
            <StyledImage
              onClick={onDivClick}
              width={100}
              height={100}
              src={profileUser.avatarSrc || "/images/wherePhoto.png"}
              alt="Avatar"
            />
            <div>
              <div>{profileUser.login}</div>
            </div>
          </Info>
        )}
        {isSameUser && (
          <WrapEdit>
            <Tool
              onClick={handleEditProfile}
              src={editUserInfo ? "/icon/close.png" : "/icon/pencil.png"}
              width={18}
              height={18}
            />
            <StyledButton
              disabled={editUserInfo ? (newLogin === "" ? true : false) : false}
              onClick={handleButtonClick}
            >
              {editUserInfo ? "save" : "new collection"}
            </StyledButton>
          </WrapEdit>
        )}
      </WrapperSpaceBetween>
      {showConstructor && (
        <InfoPosts>
          <WrapName>
            <NameCollections>Collection name</NameCollections>
            <Input
              placeholder="Enter collection name"
              value={nameCollection}
              onChange={(ev) => setNameCollection(ev.target.value)}
            />
          </WrapName>
          <Tool
            onClick={() => setShowConstructor(false)}
            src="/icon/close.png"
            width={18}
            height={18}
          />
          <ButtonSavecollection style={{ marginLeft: "auto" }} onClick={handleCollectionCreate}>
            save
          </ButtonSavecollection>
        </InfoPosts>
      )}
    </WrapperInfo>
  );
}

const WrapEdit = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
`;

const WrapperAvatarEditor = styled("div")`
  cursor: pointer;
  :hover {
    transition: all 0.25s ease-in-out;
    filter: brightness(0.9);
  }
`;

const WrapperSpaceBetween = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const WrapperInfo = styled("div")`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  font-weight: bold;
  font-size: 36px;
  gap: 16px;
`;

const StyledImage = styled(Image)`
  border-radius: 50%;
  object-fit: cover;
`;

const Info = styled("div")`
  display: flex;
  gap: 30px;
  align-items: center;
`;

const WrapName = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoPosts = styled("div")`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: baseline;
`;

const ButtonSavecollection = styled("button")`
  background: white;
  color: black;
  padding: 4px 20px;
  border-radius: 4px;
  font-size: 16px;
  border: solid black 1px;
  transition: 1ms ease-in-out;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  :hover {
    transition: all 0.1s ease-in-out;
    background: #424242;
    color: white;
  }
  :disabled {
    background: #d9d9d9;
    cursor: auto;
  }
`;

const NameCollections = styled("div")`
  font-size: 18px;
  font-weight: 600;
  display: flex;
  gap: 8px;
`;

export default React.memo(ProfileHeader);
