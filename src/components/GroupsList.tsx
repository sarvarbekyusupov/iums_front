import React from "react";
import { Table } from "antd";
import type { GroupsType } from "../types/groups";
import type { ColumnsType } from "antd/es/table";

interface Props {
  data: GroupsType[];
  loading: boolean;
}

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
];

const GroupList: React.FC<Props> = ({ data, loading }) => {
  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey={(record) => `${record.name}-${record.start_date}`}
    />
  );
};

export default GroupList;
