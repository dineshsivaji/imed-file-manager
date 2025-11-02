import { useState } from 'react';
import { Button, Modal, Form, Input, Typography, message } from 'antd';

const { Title } = Typography;

interface ModalWithInputProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
}

const ModalWithInput: React.FC<ModalWithInputProps> = ({
  isModalVisible,
  setIsModalVisible,
}) => {
  const [form] = Form.useForm();
  const [inputValue, setInputValue] = useState(''); // <-- Add state

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Received values of form: ', values);
      message.success(`Input saved: "${values.newFolderName}"`);
      setIsModalVisible(false);
      // form.resetFields();
    } catch (errorInfo) {
      console.log('Validation Failed:', errorInfo);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    // form.resetFields();
  };

  return (
    <>
      {/* Remove the button, modal is triggered from menu */}
      <Modal
        title="Enter Encryption Key"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnHidden={true}
      >
        <Form form={form} layout="vertical" name="folder_input_form">
          <Form.Item
            name="newFolderName"
            label=""
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Encryption key cannot be empty!',
              },
            ]}
          >
            <Input.Password
              placeholder="Type your encryption key here..."
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoCapitalize="off"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalWithInput;
