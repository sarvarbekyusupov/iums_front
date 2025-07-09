import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { courseService } from "../service";
import type { CoursesType } from "../types"; 

export const useCourse = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: () => courseService.getCourses(),
  });

  return {
    courses: data,
    isLoading,
    error,
  };
};

export const useCourseCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CoursesType) => courseService.createCourses(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useCourseUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CoursesType }) =>
      courseService.updateCourses(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

export const useCourseDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => courseService.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};