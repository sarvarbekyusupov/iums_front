// import { authService } from "@service";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { setItem } from "../../helpers";

// const SignIn = () => {
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [role, setRole] = useState('')
//     const navigate = useNavigate()
//     const submit =async()=>{
//         const payload = {email, password}
//         const res = await authService.signIn(payload, role)
//         if (res?.status ===201) {
//             setItem('access_token', res.data.access_token)
//             setItem('role', role)
//             navigate(`/${role}`)
//         }
//     }


//     return (
//       <div>
//         <input
//           type="email"
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//         />
//         <input
//           type="passwrod"
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="password"
//         />
//         <select onChange={(e) => setRole(e.target.value)}>
//           <option value="teacher">teacher</option>
//           <option value="student">student</option>
//           <option value="admin">admin</option>
//           <option value="lid">lid</option>
//         </select>
//         <button onClick={submit}>submit</button>
//       </div>
//     );

// };

// export default SignIn;

import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { authService } from "@service";
import { setItem } from "../../helpers";

const { Option } = Select;

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    const { email, password, role } = values;
    setLoading(true);

    try {
      const res = await authService.signIn({ email, password }, role);

      if (res?.status === 201) {
        setItem("access_token", res.data.access_token);
        setItem("role", role);
        navigate(`/${role}`);
      } else {
        message.error("Invalid credentials or role");
      }
    } catch (err) {
      console.error(err);
      message.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ role: "student" }}
      style={{ maxWidth: 400, margin: "auto", marginTop: 40 }}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "Invalid email format!" },
        ]}
      >
        <Input placeholder="Email" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>

      <Form.Item label="Role" name="role" rules={[{ required: true }]}>
        <Select>
          <Option value="teacher">Teacher</Option>
          <Option value="student">Student</Option>
          <Option value="admin">Admin</Option>
          <Option value="lid">Lid</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Sign In
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignIn;
