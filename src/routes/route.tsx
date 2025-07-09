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
  TeacherLayout,
  StudentLayout,
  AdminLayout,
  Groups,
  Courses,
  Students,
} from "@pages";


import { LayoutProtect } from "@pages";
import {LoginProtect} from "@pages"; 


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route
        index
        element={
          <LoginProtect>
            <SignIn />
          </LoginProtect>
        }
      />
      <Route path="*" element={<NotFound />} />
      {/* TEACHER */}
      <Route
        path="teacher"
        element={
          <LayoutProtect>
            <TeacherLayout />
          </LayoutProtect>
        }
      >
        <Route path="groups" element={<Groups />} />
        <Route path="courses" element={<Courses />} />
        <Route path="students" element={<Students />} />
      </Route>

      {/* ADMIN */}
      <Route
        path="admin"
        element={
          <LayoutProtect>
            <AdminLayout />
          </LayoutProtect>
        }
      >
        <Route path="groups" element={<Groups />} />
        <Route path="courses" element={<Courses />} />
        <Route path="students" element={<Students />} />
      </Route>

      {/* STUDENT */}
      <Route
        path="student"
        element={
          <LayoutProtect>
            <StudentLayout />
          </LayoutProtect>
        }
      >
        <Route path="groups" element={<Groups />} />
        <Route path="courses" element={<Courses />} />
        <Route path="students" element={<Students />} />
      </Route>
    </Route>
  )
);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
