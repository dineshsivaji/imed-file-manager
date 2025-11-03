import {
  FolderOpenFilled,
  SettingFilled,
  InfoCircleFilled,
  QuestionCircleFilled,
  FileFilled,
  SaveFilled,
  LockFilled,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useState } from 'react';

import ModelWithInput from './ModelWithInput';
import OkOnlyModal from './OkOnlyModal';

interface TopLevelMenuProps {
  onOpenFile: () => void;
}
const TopLevelMenu: React.FC<TopLevelMenuProps> = ({ onOpenFile }) => {
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
          icon={<FolderOpenFilled />}
        >
          <Menu.Item key="openPlain" icon={<FileFilled />}>
            Open Plain File
          </Menu.Item>
          <Menu.Item key="openEncrypted" icon={<FileFilled />}>
            Open Encrypted File
          </Menu.Item>
          <Menu.Item key="savePlain" icon={<SaveFilled />}>
            Save As Plain File
          </Menu.Item>
          <Menu.Item key="saveEncrypted" icon={<SaveFilled />}>
            Save As Encrypted File
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          key="SettingsSubMenu"
          title="Settings"
          icon={<SettingFilled />}
        >
          <Menu.Item key="encryptionKey" icon={<LockFilled />}>
            Encryption Key
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          key="HelpSubMenu"
          title="Help"
          icon={<QuestionCircleFilled />}
        >
          <Menu.Item key="about" icon={<InfoCircleFilled />}>
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
