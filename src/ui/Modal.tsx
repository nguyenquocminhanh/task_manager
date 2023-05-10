import React from 'react';
import { Button, Modal } from "react-bootstrap";

interface ModalProps {
  action: string,
  isModalShow: boolean,
  taskName: string,
  onHandleClose: () => void,
  onConfirm: () => void,
}

const AppModal: React.FC<ModalProps> = props => {  
  return (
    <Modal show={props.isModalShow} onHide={props.onHandleClose}>
      <Modal.Header closeButton>
      
      </Modal.Header>

      <Modal.Body>
        <p>Are you sure you want to {props.action} <b>task {props.taskName}</b>?</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHandleClose}>Close</Button>
        <Button variant="primary" onClick={props.onConfirm}>Save changes</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AppModal;