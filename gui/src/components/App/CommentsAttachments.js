import { func } from "prop-types";
import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import FileAttachment from "./FileAttachment";

function CommentsAttachments(props) {
  const [commentPath, setCommentPath] = useState("");
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    setCommentPath(
      `${props.config.wrapper.url}comment/${props.commentData.comment_id}/attachment/${props.commentData.fileName}`
    );
  }, []);
  //   var extension = props.commentData.fileName[props.index]
  //     .split(".")
  //     .pop()
  //     .toUpperCase();
  //   console.log(extension);
  return (
    <>
      <FileAttachment
        show={showModal}
        onHide={() => setShowModal(false)}
        imagePath={commentPath}
      />
      <div
        style={{
          width: "100%",
          height: "100px",
          cursor: "pointer",
          backgroundColor: "white"
        }}
      >
        <div
          className='thumbnail_preview'
          onClick={() => setShowModal(true)}
          style={{
            width: "30%",
            height: "100px",
            float: "left"
          }}
        >
          <img src={commentPath} style={{ width: "100%", height: "100%" }} />
        </div>
        <div className='attachment_info'>
          <div
            className='attachment_filename'
            style={{
              width: "50%",
              height: "100%",
              float: "left",
              paddingLeft: "10px",
              marginTop: "35px"
            }}
          >
            <span
              style={{
                marginBottom: "30px",
                float: "left",
                width: "100%",
                fontWeight: "bold"
              }}
            >
              {props.fileName}
            </span>
          </div>
          <div
            className='attachment_download'
            style={{
              width: "20%",
              float: "left",
              height: "100px",
              paddingTop: "35px"
            }}
          >
            <a href={commentPath} download='' className='image-download-button'>
              <span className='fa fa-download'> </span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommentsAttachments;
