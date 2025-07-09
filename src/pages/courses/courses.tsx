import React from "react";
import CoursesList from "../../components/courses/CoursesList";
import AddCourse from "../../components/courses/AddCourse";

const Courses: React.FC = () => {
  return (
    <div>
      <AddCourse />
      <CoursesList />
    </div>
  );
};

export default Courses;
