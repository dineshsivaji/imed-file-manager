import React, { useState } from 'react';
import { Button, Modal, Typography } from 'antd';

const { Title, Paragraph } = Typography;

interface ModalWithInputProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
}
const OkOnlyModal: React.FC<ModalWithInputProps> = ({
  isModalVisible,
  setIsModalVisible,
}) => {
  //   const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const handleOk = () => setIsModalVisible(false);

  return (
    <>
      <Modal
        title="IMED File Manager"
        open={isModalVisible}
        onOk={handleOk} // The default handler for the "OK" button
        onCancel={handleOk} // Optional: Map Escape/backdrop click to "OK" action
        // 🔑 Key Property 1: Hide the default Cancel button
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <Paragraph>
          IMED (In Memory Encrypt Decrypt) File Manager is an in-memory secure
          file management application designed to protect your sensitive files
          with advanced encryption. The decrypted data never leaves your
          system's memory, ensuring maximum security.
        </Paragraph>
        <Paragraph>
          If it is encrypted, IMED can open, edit, and save it securely. If it
          is not encrypted, IMED can encrypt it for you.
        </Paragraph>
        <Paragraph>Developed by Dinesh Sivaji</Paragraph>
      </Modal>
    </>
  );
};

export default OkOnlyModal;
