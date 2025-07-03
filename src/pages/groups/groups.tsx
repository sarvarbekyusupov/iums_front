import React, { useEffect, useState } from "react";
import { groupService } from "../../service/groups.service";
import GroupList from "../../components/GroupsList";
import AddGroup from "../../components/AddGroup";
import type { GroupsType } from "../../types/groups";

const Groups = () => {
  const [groups, setGroups] = useState<GroupsType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await groupService.getGroups();
      setGroups(data);
    } catch (err) {
      console.error("Failed to fetch groups", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGroup = async (newGroup: GroupsType) => {
    try {
      await groupService.createGroups(newGroup);
      await fetchGroups(); // refresh the list
    } catch (err) {
      console.error("Failed to add group", err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div>
      <AddGroup onSave={handleAddGroup} />
      <GroupList data={groups} loading={loading} />
    </div>
  );
};

export default Groups;
