import React from "react";
import { Space, Table, Button } from "antd";
import type { CoursesType } from "../../types";
import type { ColumnsType } from "antd/es/table";
import { useCourse, useCourseDelete } from "../../hooks";
import EditCourse from "./EditCourse";

const CoursesList: React.FC = () => {
  const { courses, isLoading } = useCourse();
  const { mutate: deleteCourse, isPending: isDeleting } = useCourseDelete();

  const columns: ColumnsType<CoursesType> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Lessons in a week",
      dataIndex: "lessons_in_a_week",
      key: "lessons_in_a_week",
    },
    {
      title: "Lesson duration",
      dataIndex: "lesson_duration",
      key: "lesson_duration",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <EditCourse course={record} />
          <Button
            danger
            onClick={() => deleteCourse(record.id)}
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
      dataSource={courses}
      loading={isLoading}
      rowKey={(record) => `${record.id}`}
    />
  );
};

export default CoursesList;
