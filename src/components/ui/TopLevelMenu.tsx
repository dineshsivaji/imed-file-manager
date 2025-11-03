import {
  FolderOpenFilled,
  SettingFilled,
  InfoCircleFilled,
  QuestionCircleFilled,
  FileFilled,
  SaveFilled,
  LockFilled,
  FileProtectOutlined,
  FileOutlined,
  SaveOutlined,
  SaveTwoTone,
  LockOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  FolderOpenOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useState } from 'react';

import ModelWithInput from './ModelWithInput';
import OkOnlyModal from './OkOnlyModal';

interface TopLevelMenuProps {
  onOpenFile: () => void;
  onCloseFile: () => void;
}
const TopLevelMenu: React.FC<TopLevelMenuProps> = ({
  onOpenFile,
  onCloseFile,
}) => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const handleMenuClick = (e: any) => {
    console.log('Menu item clicked:', e);
    if (e.key === 'encryptionKey') {
      setShowModal(true); // Show modal when encryptionKey is clicked
    } else if (e.key === 'about') {
      setIsAboutVisible(true); // Show about modal
    } else if (e.key === 'openPlain') {
      onOpenFile(); // Call the passed function to open file dialog
    } else if (e.key === 'closed') {
      // Handle close action here
      onCloseFile();
    }
    clearSelection();
  };

  const clearSelection = () => {
    setSelectedKeys([]);
  };

  return (
    <>
      <Menu
        onClick={handleMenuClick}
        selectedKeys={selectedKeys}
        mode="horizontal"
      >
        <Menu.SubMenu
          key="FileSubMenu"
          title="File"
          icon={<FolderOpenOutlined />}
        >
          <Menu.Item key="openPlain" icon={<FileOutlined />}>
            Open Plain File
          </Menu.Item>
          <Menu.Item key="openEncrypted" icon={<FileProtectOutlined />}>
            Open Encrypted File
          </Menu.Item>
          <Menu.Item key="savePlain" icon={<SaveOutlined />}>
            Save As Plain File
          </Menu.Item>
          <Menu.Item key="saveEncrypted" icon={<SaveTwoTone />}>
            Save As Encrypted File
          </Menu.Item>
          <Menu.Item key="closed" icon={<CloseCircleOutlined />}>
            Close
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          key="SettingsSubMenu"
          title="Settings"
          icon={<SettingOutlined />}
        >
          <Menu.Item key="encryptionKey" icon={<LockOutlined />}>
            Encryption Key
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          key="HelpSubMenu"
          title="Help"
          icon={<QuestionCircleOutlined />}
        >
          <Menu.Item key="about" icon={<InfoCircleOutlined />}>
            About
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
      <ModelWithInput
        isModalVisible={showModal}
        setIsModalVisible={setShowModal}
      />
      <OkOnlyModal
        isModalVisible={isAboutVisible}
        setIsModalVisible={setIsAboutVisible}
      />
    </>
  );
};

export default TopLevelMenu;
