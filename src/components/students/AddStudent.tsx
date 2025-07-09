import React, { useState } from "react";
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";
import type { StudentsType } from "../../types";
import { useStudentCreate } from "../../hooks";

const { Option } = Select;

const AddStudent: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { mutate, isPending } = useStudentCreate();

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload: StudentsType = {
      ...values,
      date_of_birth: values.date_of_birth.format("YYYY-MM-DD"),
    };
    mutate(payload);
    setOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Add Student
      </Button>
      <Modal
        title="Add New Student"
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

export default AddStudent;
