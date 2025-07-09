import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, InputNumber } from "antd";
import type { CoursesType } from "../../types";
import { useCourseUpdate } from "../../hooks";

interface Props {
  course: CoursesType;
}

const EditCourse: React.FC<Props> = ({ course }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { mutate: updateCourse, isPending } = useCourseUpdate();

  useEffect(() => {
    if (course) {
      form.setFieldsValue(course);
    }
  }, [course, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload: CoursesType = {
      ...values,
      id: course.id,
      price: Number(values.price),
      lessons_in_a_week: Number(values.lessons_in_a_week),
    };
    updateCourse({ id: course.id, data: payload });
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit</Button>
      <Modal
        title="Edit Course"
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

export default EditCourse;
