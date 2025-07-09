import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studentService } from "../service";
import type { StudentsType } from "../types"; 

export const useStudent = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["students"],
    queryFn: () => studentService.getStudents(),
  });

  return {
    students: data,
    isLoading,
    error,
  };
};

export const useStudentCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StudentsType) => studentService.createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useStudentUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: StudentsType }) =>
      studentService.updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useStudentDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => studentService.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};