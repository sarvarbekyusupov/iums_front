import React from "react";
import StudentsList from "../../components/students/StudentsList";
import AddStudent from "../../components/students/AddStudent";

const Students: React.FC = () => {
  return (
    <div>
      <AddStudent />
      <StudentsList />
    </div>
  );
};

export default Students;
