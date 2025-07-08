import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import type { GroupsType } from "../types";
import { useGroupUpdate } from "../hooks";

const { Option } = Select;

interface Props {
  group: GroupsType;
}

const EditGroup: React.FC<Props> = ({ group }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { mutate: updateGroup, isPending } = useGroupUpdate();

  useEffect(() => {
    if (group) {
      form.setFieldsValue({
        ...group,
        start_date: dayjs(group.start_date),
        end_date: dayjs(group.end_date),
      });
    }
  }, [group, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload: GroupsType = {
      ...values,
      id: group.id,
      course_id: Number(values.course_id),
      start_date: values.start_date.format("YYYY-MM-DD"),
      end_date: values.end_date.format("YYYY-MM-DD"),
    };
    updateGroup({ id: group.id, data: payload });
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit</Button>
      <Modal
        title="Edit Group"
        open={open}
        confirmLoading={isPending}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
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

export default EditGroup;
