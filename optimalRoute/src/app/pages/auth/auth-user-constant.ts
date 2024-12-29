export interface AuthUser {
    login: string | null;
    password: string | null;
    adminRole: boolean | null;
}

export const authUser: AuthUser = {
    login: null,
    password: null,
    adminRole: null,
};
