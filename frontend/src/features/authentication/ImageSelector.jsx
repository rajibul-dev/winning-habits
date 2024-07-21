import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaXmark } from "react-icons/fa6";
import { MdCloudUpload } from "react-icons/md";
import styled, { css } from "styled-components";
import Button from "../../ui/Button.jsx";
import PageLevelNotificationToast from "../../ui/PageLevelNotificationToast.jsx";
import useUpdateAvatar from "./useUpdateAvatar.js";
import SpinnerMini from "../../ui/SpinnerMini.jsx";
import { avatarRemoveSelectionXMarkIndex } from "../../styles/zIndexManager.js";

const Container = styled.div`
  padding: 2.4rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  @media (max-height: 27em) {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
`;

const DropzoneArea = styled.div`
  padding: 6rem 2rem;
  border: 1px solid var(--color-grey-400);
  cursor: pointer;
  transition: all 0.1s;

  ${(props) =>
    props.$state === "active"
      ? css`
          box-shadow: inset 0 0 5px 0 var(--color-brand-600);
          border-color: var(--color-brand-600);
          * {
            color: var(--color-brand-600);
            font-weight: 500;
          }
        `
      : ""}

  @media (max-height: 27em) {
    padding-top: 2.4rem;
    padding-bottom: 2.4rem;
  }
`;
const GuideText = styled.p`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  text-align: center;
  color: var(--color-grey-400);
  line-height: 1.5;

  & svg {
    font-size: 8rem;
  }
`;

const PreviewImage = styled.img`
  max-height: 50rem;
`;
const RemoveSelectionButton = styled.button`
  border: none;
  background-color: var(--color-red-500);
  color: #fff;
  padding: 0.5rem;
  border-radius: 50%;
  position: absolute;
  right: 0;
  top: 0;
  z-index: ${avatarRemoveSelectionXMarkIndex};
  transform: translate(50%, -50%);
`;
const UploadButton = styled(Button)`
  display: block;
  width: 100%;
`;

export default function ImageSelector({ onCloseModal }) {
  const [image, setFiles] = useState([]);
  const [rejected, setRejected] = useState([]);
  const { updateAvatar, isUpdatingAvatar, isUpdatedAvatar } = useUpdateAvatar();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      setRejected([]);
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) }),
        ),
      ]);
    }

    if (rejectedFiles?.length) {
      setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
    }
  }, []);

  const removeSelection = () => {
    setFiles([]);
    setRejected([]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/webp": [],
    },
    maxSize: 1024 * 1024 * 10, // 10 MB
  });

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => image.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [image]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!image.length) return;
    updateAvatar(image[0]);
  }

  useEffect(
    function () {
      if (isUpdatedAvatar) {
        onCloseModal();
      }
    },
    [isUpdatedAvatar, onCloseModal],
  );

  return (
    <Container>
      {rejected.length > 0 && (
        <PageLevelNotificationToast
          style={{ marginBottom: ".6rem" }}
          type="error"
        >
          {rejected[0].errors.map((error) => {
            const message = error.message.includes("larger than")
              ? "Image size must be under 10MB"
              : error.message;
            return <p>{message}</p>;
          })}
        </PageLevelNotificationToast>
      )}
      {image.length === 0 && (
        <DropzoneArea {...getRootProps()} $state={isDragActive ? "active" : ""}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <GuideText>
              <MdCloudUpload />
              <span>Drop the image here...</span>
            </GuideText>
          ) : (
            <GuideText>
              <MdCloudUpload />
              <span>
                Drag 'n' drop your image here, or click to select file
              </span>
            </GuideText>
          )}
        </DropzoneArea>
      )}
      {image.length > 0 && (
        <>
          <div
            style={{
              position: "relative",
              width: "fit-content",
              marginInline: "auto",
            }}
          >
            <RemoveSelectionButton onClick={removeSelection}>
              <FaXmark />
            </RemoveSelectionButton>
            <PreviewImage src={image[0].preview} />
          </div>
          <UploadButton onClick={handleSubmit} disabled={isUpdatingAvatar}>
            {!isUpdatingAvatar ? "Upload photo" : <SpinnerMini />}
          </UploadButton>
        </>
      )}
    </Container>
  );
}
