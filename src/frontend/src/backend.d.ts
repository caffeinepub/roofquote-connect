import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Lead {
    id: bigint;
    postcode: string;
    jobType: JobType;
    name: string;
    createdAt: bigint;
    email: string;
    message?: string;
    phone: string;
}
export enum JobType {
    repair = "repair",
    inspection = "inspection",
    emergency = "emergency",
    replacement = "replacement"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllLeads(): Promise<Array<Lead>>;
    getCallerUserRole(): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    submitLead(name: string, phone: string, email: string, postcode: string, jobType: JobType, message: string | null): Promise<Lead>;
}
