import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

class ConfigurationModal extends Component {
    render() {
        const { show, handleClose, saveRunConfiguration } = this.props;
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Hi</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={saveRunConfiguration}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

ConfigurationModal.propTypes = {
    show: PropTypes.bool,
    handleClose: PropTypes.func,
    saveRunConfiguration: PropTypes.func
};

export default ConfigurationModal;
