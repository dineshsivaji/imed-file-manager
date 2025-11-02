import {
  FolderOpenFilled,
  SettingFilled,
  InfoCircleFilled,
  QuestionCircleFilled,
  FileFilled,
  SaveFilled,
  LockFilled,
} from '@ant-design/icons';
// import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useState } from 'react';

// type MenuItem = Required<MenuProps>['items'][number];

// const items: MenuItem[] = [
//   {
//     label: 'File',
//     key: 'SubMenu',
//     icon: <FolderOpenFilled />,
//     children: [
//       {
//         type: 'group',
//         // label: 'Item 1',
//         children: [
//           { label: 'Open', key: 'setting:1', icon: <FileOutlined /> },
//           { label: 'Save', key: 'setting:2', icon: <SaveOutlined /> },
//         ],
//       },
//     ],
//   },
// ];

const TopLevelMenu = () => {
  const [selectedKeys, setSelectedKeys] = useState([]); // Initialize with an empty array

  const handleMenuClick = (e: any) => {
    console.log('click ', e);
    clearSelection();
  };

  const clearSelection = () => {
    setSelectedKeys([]); // This will clear the selected state
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
    </>
  );
};

export default TopLevelMenu;
