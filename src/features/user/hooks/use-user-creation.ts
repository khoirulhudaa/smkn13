import { UserCreationModel } from "@/core/models";
import { userService } from "@/core/services";
import { useMutation } from "@tanstack/react-query";

export const useUserCreation = () => {
  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; payload: UserCreationModel }) =>
      userService.updateUser(vars.id, vars.payload),
  });

  const update = (id: number, payload: UserCreationModel) =>
    updateMutation.mutateAsync({ id, payload });

  const isLoading = updateMutation.isPending;

  // const updateMutationTeacher = useMutation({
  //   mutationFn: (vars: { id: number; payload: UserCreationModel }) =>
  //     userService.updateTeacher(vars.id, vars.payload),
  // });

  // const updateTeacher = (id: number, payload: UserCreationModel) =>
  //   updateMutationTeacher.mutateAsync({ id, payload });

  return {
    isLoading,
    update,
    // updateTeacher
  };
};
