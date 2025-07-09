import React from "react";
import { Space, Table, Button } from "antd";
import type { StudentsType } from "../../types";
import type { ColumnsType } from "antd/es/table";
import { useStudent, useStudentDelete } from "../../hooks";
import EditStudent from "./EditStudent";

const StudentsList: React.FC = () => {
  const { students, isLoading } = useStudent();
  const { mutate: deleteStudent, isPending: isDeleting } = useStudentDelete();

  const columns: ColumnsType<StudentsType> = [
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Date of Birth",
      dataIndex: "date_of_birth",
      key: "date_of_birth",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <EditStudent student={record} />
          <Button
            danger
            onClick={() => deleteStudent(record.id)}
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
      dataSource={students}
      loading={isLoading}
      rowKey={(record) => `${record.id}`}
    />
  );
};

export default StudentsList;
