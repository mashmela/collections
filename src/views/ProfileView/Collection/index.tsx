import React from "react";
import Image from "next/image";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import Input from "primitives/Input";
import Tool from "components/Tool";

import { RootState } from "store";
import { setProfile } from "store/profileSlice";
import { setItemModalState } from "store/modalSlice";

import { sendRequest } from "utils/api";

import { CollectionInterface, UserInfoInterface, UserItemInterface } from "types";

const MAX_DISPLAYED_ITEMS = 7;

interface CollectionComponentInterface {
  desk: CollectionInterface;
  size: number;
  collectionIndex: number;
  rightToEdit: boolean;
}

function CollectionComponent({
  desk,
  collectionIndex,
  size,
  rightToEdit,
}: CollectionComponentInterface) {
  const dispatch = useDispatch();

  const profileUser = useSelector((state: RootState) => state.profile.profile);

  const [showAll, setShowAll] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [valueNameCollection, setValueNameCollection] = React.useState(desk.name);

  const items = React.useMemo(() => {
    if (showAll) return desk.items;
    return desk.items.slice(0, rightToEdit ? MAX_DISPLAYED_ITEMS : MAX_DISPLAYED_ITEMS + 1);
  }, [desk.items, rightToEdit, showAll]);

  const handleEditCollection = React.useCallback(async () => {
    setEditMode((value) => !value);
    if (!profileUser) return;
    const response = await sendRequest<UserInfoInterface>("/collections/renameCollection", {
      _id: profileUser._id,
      indexCollection: collectionIndex,
      name: valueNameCollection,
    });

    if (!response.success) return;
    dispatch(setProfile(response.data));
  }, [collectionIndex, dispatch, profileUser, valueNameCollection]);

  const handleDeleteItem = React.useCallback(
    async (index: number) => {
      if (!profileUser) return;
      setEditMode(false);
      const response = await sendRequest<UserInfoInterface>("/collections/deleteCollectionItem", {
        _id: profileUser._id,
        indexCollection: collectionIndex,
        indexItem: index,
      });
      if (!response.success) return;
      dispatch(setProfile(response.data));
    },
    [collectionIndex, dispatch, profileUser],
  );

  const addItem = React.useCallback(() => {
    dispatch(
      setItemModalState({
        action: "create",
        indexCollection: collectionIndex,
      }),
    );
  }, [collectionIndex, dispatch]);

  const openItem = React.useCallback(
    (item: UserItemInterface, index: number) => {
      dispatch(
        setItemModalState({
          action: "update",
          indexCollection: collectionIndex,
          indexItem: index,
          item,
        }),
      );
    },
    [collectionIndex, dispatch],
  );

  const handleDeleteCollection = React.useCallback(async () => {
    if (!profileUser) return;
    const response = await sendRequest<UserInfoInterface>("/collections/deleteCollection", {
      _id: profileUser._id,
      indexCollection: collectionIndex,
    });
    if (!response.success) return;
    dispatch(setProfile(response.data));
  }, [collectionIndex, dispatch, profileUser]);

  const handleShowMore = React.useCallback(() => setShowAll((value) => !value), []);

  return (
    <Post>
      <InfoPosts>
        {editMode ? (
          <Input
            placeholder="Enter collection name"
            value={valueNameCollection}
            onChange={(ev) => setValueNameCollection(ev.target.value)}
          />
        ) : (
          <NameCollection>
            {valueNameCollection} <CountItems>({desk.items.length})</CountItems>
          </NameCollection>
        )}
        {rightToEdit && (
          <WrapperTools>
            {editMode ? (
              <>
                <Tool
                  onClick={handleDeleteCollection}
                  src="/icon/trash.png"
                  width={24}
                  height={24}
                />
                <Tool
                  onClick={() => setEditMode((value) => !value)}
                  src="/icon/close.png"
                  width={20}
                  height={20}
                />
              </>
            ) : null}
            <Tool onClick={handleEditCollection} src="/icon/pencil.png" width={18} height={18} />
          </WrapperTools>
        )}
      </InfoPosts>
      <WrapperItemsCollection>
        {items.map((item, index) => (
          <WrapperImagePost key={index}>
            <div style={{ position: "relative", width: size, height: size }}>
              <ImagePost
                onClick={() => openItem(item, index)}
                src={item.imageSrc !== null ? item.imageSrc : "/images/wherePhoto.png"}
                alt="Avatar"
                fill
              />
            </div>
            <Tier>
              {editMode ? (
                <Image
                  onClick={() => handleDeleteItem(index)}
                  src="/icon/round-close.png"
                  alt=""
                  width={18}
                  height={18}
                />
              ) : (
                item.rank
              )}
            </Tier>
            <Description style={{ maxWidth: size }}>{item.title}</Description>
          </WrapperImagePost>
        ))}
        {rightToEdit ? (
          <AddItemImageContainer style={{ width: size, height: size }} onClick={addItem}>
            <Image src="/icon/Plus.png" alt="" width={32} height={32} />
          </AddItemImageContainer>
        ) : null}
      </WrapperItemsCollection>
      <ButtonOpen rotateButton={showAll} onClick={handleShowMore}>
        {desk.items.length > 7 && <Image src="/icon/Open.png" alt="" width={28} height={15} />}
      </ButtonOpen>
    </Post>
  );
}

const Post = styled("div")`
  display: flex;
  gap: 10px;
  flex-direction: column;
  align-items: start;
  width: 100%;
`;

const InfoPosts = styled("div")`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: baseline;
`;

const NameCollection = styled("div")`
  font-size: 18px;
  font-weight: 600;
  display: flex;
  gap: 8px;
`;

const WrapperItemsCollection = styled("div")`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const WrapperImagePost = styled("div")`
  display: flex;
  flex-direction: column;
  position: relative;
  flex-derection: space-between;
}`;

const WrapperTools = styled("div")`
  display: flex;
  gap: 20px ;
  align-items: center;
}`;

const AddItemImageContainer = styled("div")`
  width: 120px;
  height: 120px;
  border-radius: 10%;
  cursor: pointer;
  background: rgb(236, 236, 236);
  display: flex;
  justify-content: center;
  align-items: center;

  :hover {
    transition: all 0.15s ease-in-out;
    filter: brightness(0.9);
  }
`;

const ButtonOpen = styled("button")<{ rotateButton: boolean }>`
  margin: 0 auto;
  background: none;
  border-radius: 10%;
  border: none;
  transition: 1ms ease-in-out;
  cursor: pointer;
  height: 28px;

  &:hover {
    transition: all 0.1s ease-in-out;
    filter: brightness(0.7);
    background: none;
  }

  img {
    transform: rotate(${({ rotateButton }) => (rotateButton ? "180deg" : "0deg")});
    transition: all 0.4s ease-in-out;
  }
`;

const ImagePost = styled(Image)`
  border-radius: 10%;
  object-fit: cover;
  cursor: pointer;
  position: relative;
  display: flex;
`;

const Description = styled("div")`
  display: inline-block;
  font-size: 14px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const CountItems = styled("div")`
  color: grey;
`;

const Tier = styled("div")`
  width: 28px;
  height: 28px;
  position: absolute;
  top: 0;
  right: 0;
  background: #00000075;
  border-radius: 0 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  color: white;

  img {
    filter: brightness(7);
    cursor: pointer;
  }
`;

export default React.memo(CollectionComponent);
