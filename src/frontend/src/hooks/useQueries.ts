import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { JobType, type Lead } from "../backend";
import { useActor } from "./useActor";

export function useGetAllLeads() {
  const { actor, isFetching } = useActor();
  return useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLeads();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export interface SubmitLeadInput {
  name: string;
  phone: string;
  email: string;
  postcode: string;
  jobType: JobType;
  message: string | null;
}

export function useSubmitLead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<Lead, Error, SubmitLeadInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitLead(
        input.name,
        input.phone,
        input.email,
        input.postcode.toUpperCase(),
        input.jobType,
        input.message,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export { JobType };
