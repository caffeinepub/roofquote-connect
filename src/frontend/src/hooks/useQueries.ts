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

export function useGetAllLeadsPublic() {
  const { actor, isFetching } = useActor();
  return useQuery<Lead[]>({
    queryKey: ["leadsPublic"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLeadsPublic();
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

export function useClaimAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (actor as any)._initializeAccessControl();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}

export function useResetAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (actor as any).resetAdminAccess();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    },
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
