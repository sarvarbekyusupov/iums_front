
import { Outlet, useNavigate } from "react-router-dom";
import {
  MailOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "sub1",
    label: "Menu",
    icon: <MailOutlined />,
    children: [
      {
        key: "g1",
        label: "GROUPS",
        type: "group",
        children: [
        
          { key: "groups", label: "Groups" },
        ],
      },
      {
        key: "g2",
        label: "COURSES",
        type: "group",
        children: [
          { key: "courses", label: "Courses" },
        ],
      },
      {
        key: "g3",
        label: "STUDENTS",
        type: "group",
        children: [
          { key: "students", label: "Students" },
        ],
      },
    ],
  },
];

const Admin = () => {
  const navigate = useNavigate();

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e.key);
    navigate(`/admin/${e.key}`); // 🧭 navigate based on key
  };

  return (
    <div style={{ display: "flex" }}>
      <Menu
        onClick={onClick}
        style={{ width: 256 }}
        defaultSelectedKeys={["groups-list"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={items}
      />
      <div style={{ flex: 1, padding: 24 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
