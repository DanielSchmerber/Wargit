
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface Project {
    id: number;
    name?: Nullable<string>;
    preview?: Nullable<string>;
    description?: Nullable<string>;
    owner?: Nullable<User>;
    members?: Nullable<Nullable<User>[]>;
    branches?: Nullable<Nullable<Branch>[]>;
}

export interface User {
    id: number;
    name?: Nullable<string>;
    minecraftUUID?: Nullable<string>;
    projects?: Nullable<Nullable<Project>[]>;
}

export interface Branch {
    id: number;
    name: string;
    schematic?: Nullable<string>;
    commits?: Nullable<Nullable<Commit>[]>;
}

export interface Commit {
    id: number;
    schematic?: Nullable<string>;
    user?: Nullable<User>;
    timestamp?: Nullable<number>;
    branch?: Nullable<Branch>;
    message?: Nullable<string>;
}

export interface CommitResult {
    successful?: Nullable<boolean>;
    dubious?: Nullable<boolean>;
    error_message?: Nullable<boolean>;
    dubious_message?: Nullable<boolean>;
    commit?: Nullable<Commit>;
}

export interface AuthPayload {
    access_token: string;
    user: User;
}

export interface Diff {
    x: number;
    y: number;
    z: number;
    from: string;
    to: string;
}

export interface IQuery {
    getUser(id?: Nullable<number>): Nullable<User> | Promise<Nullable<User>>;
    getProjects(): Nullable<Nullable<Project>[]> | Promise<Nullable<Nullable<Project>[]>>;
    getProject(id?: Nullable<number>): Nullable<Project> | Promise<Nullable<Project>>;
}

export interface IMutation {
    createProject(name?: Nullable<string>, description?: Nullable<string>, width?: Nullable<number>, height?: Nullable<number>, length?: Nullable<number>): Nullable<Project> | Promise<Nullable<Project>>;
    createDiff(projectID?: Nullable<number>, branchID?: Nullable<number>, schematic?: Nullable<string>): Nullable<Nullable<Diff>[]> | Promise<Nullable<Nullable<Diff>[]>>;
    commitToProject(commitMessage?: Nullable<string>, projectID?: Nullable<number>, branchID?: Nullable<number>, schematic?: Nullable<string>): Nullable<Commit> | Promise<Nullable<Commit>>;
    login(username: string, password: string): AuthPayload | Promise<AuthPayload>;
    register(username: string, password: string): AuthPayload | Promise<AuthPayload>;
}

type Nullable<T> = T | null;
