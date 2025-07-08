import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { groupService } from "../service";
import type { GroupsType } from "../types"; 

export const useGroup = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["groups"],
    queryFn: () => groupService.getGroups(),
  });

  return {
    groups: data,
    isLoading,
    error,
  };
};

export const useGroupCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GroupsType) => groupService.createGroups(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

export const useGroupUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: GroupsType }) =>
      groupService.updateGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

export const useGroupDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => groupService.deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};
