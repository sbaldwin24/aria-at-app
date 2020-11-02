import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

class ConfigurationModal extends Component {
    render() {
        const {
            show,
            handleClose,
            saveRunConfiguration,
            configurationChanges
        } = this.props;
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Active Test Runs</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h1>
                        The draft results for the following test plans will be
                        lost:
                    </h1>
                    {configurationChanges.map(
                        runDeleted => `${runDeleted.apg_example_name}`
                    )}
                </Modal.Body>
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
    saveRunConfiguration: PropTypes.func,
    configurationChanges: PropTypes.array
};

export default ConfigurationModal;
