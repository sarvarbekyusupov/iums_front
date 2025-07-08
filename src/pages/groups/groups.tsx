import React from "react";
import GroupList from "../../components/GroupsList";
import AddGroup from "../../components/AddGroup";

const Groups: React.FC = () => {
  return (
    <div>
      <AddGroup />
      <GroupList />
    </div>
  );
};

export default Groups;
