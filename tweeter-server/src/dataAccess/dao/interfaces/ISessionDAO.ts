export interface ISessionDAO {
    createSession(
      token: string,
      alias: string,
      expiresAt: number,
      lastActivity: number
    ): Promise<void>;
    getSession(token: string): Promise<{ token: string; alias: string; expiresAt: number; lastActivity: number } | null>;
    updateSessionActivity(token: string, lastActivity: number, newExpiresAt?: number): Promise<void>;
    deleteSession(token: string): Promise<void>;
  }
  