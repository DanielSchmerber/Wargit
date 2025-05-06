
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
    branch?: Nullable<Nullable<Branch>[]>;
    message?: Nullable<string>;
}

export interface IQuery {
    getUser(id?: Nullable<number>): Nullable<User> | Promise<Nullable<User>>;
    getUsers(): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
    getProjects(): Nullable<Nullable<Project>[]> | Promise<Nullable<Nullable<Project>[]>>;
    getProject(id?: Nullable<number>): Nullable<Project> | Promise<Nullable<Project>>;
}

export interface IMutation {
    createUser(name?: Nullable<string>): Nullable<User> | Promise<Nullable<User>>;
    createProject(name?: Nullable<string>, description?: Nullable<string>, owner?: Nullable<number>): Nullable<Project> | Promise<Nullable<Project>>;
    commitToProject(commitMessage?: Nullable<string>, projectID?: Nullable<number>, branchID?: Nullable<number>, schematic?: Nullable<string>): Nullable<Commit> | Promise<Nullable<Commit>>;
}

type Nullable<T> = T | null;
