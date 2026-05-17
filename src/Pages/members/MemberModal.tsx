import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "@carbon/react";

const MemberModal = () => {
    return (
        <Modal>
            <ModalHeader> Add New Member</ModalHeader>
            <ModalBody>
               
            </ModalBody>
             <ModalFooter>
                    <Button kind="danger"> cancel</Button>
                    <Button > save</Button>
                </ModalFooter>
        </Modal>
    )

}
export default MemberModal;