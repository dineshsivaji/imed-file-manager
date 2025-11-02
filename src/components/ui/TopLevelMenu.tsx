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

const TopLevelMenu = () => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const handleMenuClick = (e: any) => {
    if (e.key === 'encryptionKey') {
      setShowModal(true); // Show modal when encryptionKey is clicked
    } else if (e.key === 'about') {
      setIsAboutVisible(true); // Show about modal
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
          <Menu.Item key="open" icon={<FileFilled />}>
            Open
          </Menu.Item>
          <Menu.Item key="save" icon={<SaveFilled />}>
            Save
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
