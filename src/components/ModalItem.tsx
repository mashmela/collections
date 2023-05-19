import React from "react";
import Image from "next/image";
import Compressor from "compressorjs";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import Input from "primitives/Input";
import Select from "primitives/Select";
import StyledButton from "primitives/StyledButton";

import { RootState } from "store";
import { setProfile } from "store/profileSlice";
import { setItemModalState } from "store/modalSlice";

import { sendRequest } from "utils/api";

import { UserInfoInterface, UserItemInterface } from "types";

const DEFAULT_RANK_VALUE = "Выбрать";

interface ModalInterface {
  rightToEdit: boolean;
}

function ModalItem({ rightToEdit }: ModalInterface) {
  const dispatch = useDispatch();

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const modalState = useSelector((state: RootState) => state.modals.itemModalState);
  const profileUser = useSelector((state: RootState) => state.profile.profile);

  const [isLoading, setIsLoading] = React.useState(false);
  const [modalItem, setModalItem] = React.useState<UserItemInterface | null>(null);

  const cantSaveItem = React.useMemo(
    () => !modalItem || modalItem.rank === DEFAULT_RANK_VALUE || modalItem.title === "",
    [modalItem],
  );

  React.useEffect(() => {
    if (modalState === null) return;

    if (modalState.action === "create") {
      setModalItem({ description: "", imageSrc: null, rank: DEFAULT_RANK_VALUE, title: "" });
      return;
    }

    if (!modalState.item) return;
    setModalItem({ ...modalState.item });
  }, [modalState]);

  const handleFileChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      if (!ev.target.files || !modalItem) return;
      const file = ev.target.files[0];
      if (!file) return;

      new Compressor(file, {
        maxWidth: 400,
        maxHeight: 400,

        success(result) {
          const fileReader = new FileReader();
          fileReader.onload = (ev) => {
            if (!ev.target) return;
            setModalItem({ ...modalItem, imageSrc: ev.target.result as string });
          };
          fileReader.readAsDataURL(result);
        },
      });
    },
    [modalItem],
  );

  const handleDescriptionChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!modalItem) return;
      setModalItem({ ...modalItem, description: event.target.value });
    },
    [modalItem],
  );

  const handleTitleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!modalItem) return;
      setModalItem({ ...modalItem, title: event.target.value });
    },
    [modalItem],
  );

  const handleRankChange = React.useCallback(
    (value: string) => {
      if (!modalItem) return;
      setModalItem({ ...modalItem, rank: value });
    },
    [modalItem],
  );

  const handleModalClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => event.stopPropagation(),
    [],
  );

  const handleImageClick = React.useCallback(() => {
    if (!rightToEdit || inputRef.current === null) return;
    inputRef.current.click();
  }, [rightToEdit]);

  const handleModalClickOutside = React.useCallback(() => {
    dispatch(setItemModalState(null));
    setModalItem(null);
  }, [dispatch]);

  const handleItemUpdate = React.useCallback(async () => {
    if (!modalItem || !profileUser || modalState?.action !== "update") return;

    const { title, description, imageSrc, rank } = modalItem;
    if (title === "" || rank === DEFAULT_RANK_VALUE) return;

    setIsLoading(true);
    const response = await sendRequest<UserInfoInterface>("/collections/editCollectionItem", {
      _id: profileUser._id,
      indexCollection: modalState.indexCollection,
      indexItem: modalState.indexItem,
      updateItem: { title, rank, imageSrc, description },
    });
    setIsLoading(false);
    handleModalClickOutside();
    if (!response.success) return;
    dispatch(setProfile(response.data));
  }, [handleModalClickOutside, dispatch, modalItem, profileUser, modalState]);

  const handleItemCreate = React.useCallback(async () => {
    if (!modalItem || !profileUser || modalState?.action !== "create") return;

    const { title, description, imageSrc, rank } = modalItem;
    if (title === "" || rank === DEFAULT_RANK_VALUE) return;

    setIsLoading(true);
    const response = await sendRequest<UserInfoInterface>("/collections/createCollectionItem", {
      _id: profileUser._id,
      indexCollection: modalState.indexCollection,
      item: {
        title,
        rank,
        imageSrc,
        description,
      },
    });
    setIsLoading(false);
    handleModalClickOutside();
    if (!response.success) return;
    dispatch(setProfile(response.data));
  }, [handleModalClickOutside, dispatch, modalItem, modalState, profileUser]);

  const handleSaveButtonClick = React.useCallback(() => {
    if (!modalState) return;
    modalState.action === "update" ? handleItemUpdate() : handleItemCreate();
  }, [handleItemCreate, handleItemUpdate, modalState]);

  const itemImage = React.useMemo(() => {
    if (modalState === null || !modalItem) return null;

    if (modalState.action === "create")
      return modalItem.imageSrc ? (
        <Image fill src={modalItem.imageSrc} alt="" />
      ) : (
        <>
          <Image width={100} height={100} src="/icon/camera.png" alt="" /> Choose photo
        </>
      );

    return <Image fill src={modalItem.imageSrc || "/images/wherePhoto.png"} alt="" />;
  }, [modalItem, modalState]);

  if (modalState === null || !modalItem) return null;

  return (
    <ModalBack onClick={handleModalClickOutside}>
      <Modal onClick={handleModalClick}>
        <ModalContent>
          <AddPhoto onClick={handleImageClick}>{itemImage}</AddPhoto>
          <ModalSettings>
            <Wpapper>
              Title
              <Input value={modalItem.title} disabled={!rightToEdit} onChange={handleTitleChange} />
            </Wpapper>
            <Wpapper>
              Rank
              <Select
                placeholder="Выбрать"
                options={["S", "A", "B", "C", "D"]}
                value={modalItem.rank}
                onChange={handleRankChange}
                disabled={!rightToEdit}
              />
            </Wpapper>
            <Wpapper>
              Description
              <TextAreaStyled
                value={modalItem.description}
                disabled={!rightToEdit}
                onChange={handleDescriptionChange}
              />
            </Wpapper>
            {rightToEdit && (
              <StyledButton disabled={cantSaveItem || isLoading} onClick={handleSaveButtonClick}>
                save
              </StyledButton>
            )}
          </ModalSettings>
          <input
            style={{ display: "none" }}
            onChange={handleFileChange}
            ref={(el) => (inputRef.current = el)}
            type="file"
          />
        </ModalContent>
      </Modal>
    </ModalBack>
  );
}

const ModalBack = styled("div")`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
`;

const Modal = styled("div")`
  background-color: #fefefe;
  padding: 40px;
  position: relative;
  cursor: auto;
`;

const ModalSettings = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AddPhoto = styled("div")`
  color: #aaa;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  width: 400px;
  height: 400px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: dashed 3px #aaa;
  position: relative;

  img {
    object-fit: contain;
  }
`;

const ModalContent = styled("div")`
  display: flex;
  gap: 30px;
`;

const Wpapper = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TextAreaStyled = styled("textarea")`
  font-size: 16px;
  outline: none;
  border-radius: 8px;
  height: 200px;
  border: solid 1px #aaa;
  width: 400px;
  padding: 12px;
  box-sizing: border-box;
  resize: none;

  &:disabled {
    color: black;
    background-color: white;
  }
`;

export default React.memo(ModalItem);
