import React from "react";
import { Space, Table, Button } from "antd";
import type { GroupsType } from "../types";
import type { ColumnsType } from "antd/es/table";
import { useGroup, useGroupDelete } from "../hooks";
import EditGroup from "./EditGroup";

const GroupList: React.FC = () => {
  const { groups, isLoading } = useGroup();
  const { mutate: deleteGroup, isPending: isDeleting } = useGroupDelete();

  const columns: ColumnsType<GroupsType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Course ID",
      dataIndex: "course_id",
      key: "course_id",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <EditGroup group={record} />
          <Button
            danger
            onClick={() => deleteGroup(record.id)}
            loading={isDeleting}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={groups}
      loading={isLoading}
      rowKey={(record) => `${record.id}`}
    />
  );
};

export default GroupList;