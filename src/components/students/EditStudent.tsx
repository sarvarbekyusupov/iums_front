import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import type { StudentsType } from "../../types";
import { useStudentUpdate } from "../../hooks";

const { Option } = Select;

interface Props {
  student: StudentsType;
}

const EditStudent: React.FC<Props> = ({ student }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { mutate: updateStudent, isPending } = useStudentUpdate();

  useEffect(() => {
    if (student) {
      form.setFieldsValue({
        ...student,
        date_of_birth: dayjs(student.date_of_birth),
      });
    }
  }, [student, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload: StudentsType = {
      ...values,
      id: student.id,
      date_of_birth: values.date_of_birth.format("YYYY-MM-DD"),
    };
    updateStudent({ id: student.id, data: payload });
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit</Button>
      <Modal
        title="Edit Student"
        open={open}
        confirmLoading={isPending}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="date_of_birth"
            label="Date of Birth"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditStudent;
