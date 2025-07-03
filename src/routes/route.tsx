import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "../App";
import {
  NotFound,
  SignIn,
  SignUp,
  TeacherLayout,
  StudentLayout,
  AdminLayout,
  Groups,
} from "@pages";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<SignIn />} />
      <Route path="sign-up" element={<SignUp />} />
      <Route path="*" element={<NotFound />} />
      {/* TEACHER */}
      <Route path="teacher" element={<TeacherLayout />}>
        <Route path="groups" element={<Groups />} />
      </Route>

      {/* ADMIN */}
      <Route path="admin" element={<AdminLayout />}>
        <Route path="groups" element={<Groups />} />
      </Route>

      {/* STUDENT */}
      <Route path="student" element={<StudentLayout />}>
        <Route path="groups" element={<Groups />} />
      </Route>
    </Route>
  )
);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
