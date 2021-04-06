import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";

function FileAttachment(props) {
  const [imagePath, setImagePath] = useState(props.imagePath);

  useEffect(() => {
    setImagePath(props.imagePath);
  }, [props.imagePath]);

  return (
    <div>
      <Modal
        show={props.show}
        onHide={props.onHide}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Body>
          {imagePath != null && (
            <>
            <button style={{position: "absolute",float: "right",right: "0px", border: "transparent",    backgroundColor: "transparent",marginTop: "-18px",marginRight: "-8px",fontSize: "large"}}  onClick={props.onHide}>
              <i className="fa fa-window-close" aria-hidden="true"></i></button>
            <img
              style={{ maxHeight: "91vh", maxWidth: "100%" }}
              src={imagePath}
            />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>
            <a
              href={imagePath}
              download=''
              className='image-download-button'
              style={{ color: "white" }}
            >
              Download
            </a>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default FileAttachment;
