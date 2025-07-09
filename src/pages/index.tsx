import { lazy } from "react";

const SignIn = lazy(() => import("./auth/sign-in"));
const SignUp = lazy(() => import("./auth/sign-up"));
const NotFound = lazy(() => import("./not-found/not-found"));
const TeacherLayout = lazy(() => import("./teacher-layout/teacher"));
const StudentLayout = lazy(() => import("./student-layout/student"));
const AdminLayout = lazy(() => import("./admin-layout/admin"));
const Groups = lazy(() => import("./groups/groups"));
const Courses = lazy(() => import("./courses/courses"));
const Students = lazy(() => import("./students/students"));
const LoginProtect = lazy(() => import("./protected-rotes/login-protect"));
const LayoutProtect = lazy(() => import("./protected-rotes/layout-protect"));

export { SignIn, SignUp, NotFound, TeacherLayout, StudentLayout, AdminLayout, Groups, Courses, Students, LoginProtect, LayoutProtect };
