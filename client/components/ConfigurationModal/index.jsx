import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

class ConfigurationModal extends Component {
    render() {
        const { show, handleClose, saveRunConfiguration } = this.props;
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={saveRunConfiguration}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default ConfigurationModal;