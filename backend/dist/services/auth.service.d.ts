import { RoleType } from '@prisma/client';
interface RegisterParams {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: RoleType;
}
export declare function register(params: RegisterParams): Promise<{
    user: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: import(".prisma/client").$Enums.RoleType;
        department: string;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare function login(email: string, password: string): Promise<{
    user: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: import(".prisma/client").$Enums.RoleType;
        department: string;
    };
    accessToken: string;
    refreshToken: string;
}>;
export declare function refreshToken(token: string): Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare function requestPasswordReset(email: string): Promise<void>;
export declare function resetPassword(token: string, newPassword: string): Promise<void>;
export {};
//# sourceMappingURL=auth.service.d.ts.map