import React, { useState } from "react";
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";
// import dayjs from "dayjs";
import type { GroupsType } from "../types/groups";

const { Option } = Select;

interface Props {
  onSave: (group: GroupsType) => void;
}

const AddGroup: React.FC<Props> = ({ onSave }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload: GroupsType = {
      ...values,
      course_id: Number(values.course_id),
      start_date: values.start_date.format("YYYY-MM-DD"),
      end_date: values.end_date.format("YYYY-MM-DD"),
    };
    onSave(payload);
    setOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Add Group
      </Button>
      <Modal
        title="Add New Group"
        open={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
        destroyOnClose
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="name"
            label="Group Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="course_id"
            label="Course ID"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Option value="new">New</Option>
              <Option value="active">Active</Option>
              <Option value="archived">Archived</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="start_date"
            label="Start Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="end_date"
            label="End Date"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddGroup;
