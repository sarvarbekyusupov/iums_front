import React, { useState } from "react";
import { Button, Modal, Form, Input, InputNumber } from "antd";
import type { CoursesType } from "../../types";
import { useCourseCreate } from "../../hooks";

const AddCourse: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { mutate, isPending } = useCourseCreate();

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload: CoursesType = {
      ...values,
      price: Number(values.price),
      lessons_in_a_week: Number(values.lessons_in_a_week),
    };
    mutate(payload);
    setOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Add Course
      </Button>
      <Modal
        title="Add New Course"
        open={open}
        confirmLoading={isPending}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Duration"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lessons_in_a_week"
            label="Lessons in a week"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="lesson_duration"
            label="Lesson duration"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddCourse;
