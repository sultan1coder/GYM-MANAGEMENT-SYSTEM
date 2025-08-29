export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (password: string, hash: string) => Promise<boolean>;
export interface AccessTokenPayload {
    id: string;
    role: string;
}
export interface RefreshTokenPayload {
    id: string;
    tokenVersion: number;
}
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export declare const generateToken: (payload: AccessTokenPayload) => string;
export declare const generateRefreshToken: (payload: RefreshTokenPayload) => string;
export declare const verifyAccessToken: (token: string) => AccessTokenPayload | null;
export declare const verifyRefreshToken: (token: string) => RefreshTokenPayload | null;
export declare const generateTokenPair: (userId: string, role: string, tokenVersion: number) => TokenPair;
//# sourceMappingURL=auth.d.ts.map