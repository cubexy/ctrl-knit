const LOCAL_STORAGE_KEYS = {
  REMOTE_DB_HOSTNAME: "remoteDbHostname",
  REMOTE_DB_NAME: "remoteDbName",
  THEME: "theme",
  VISITED: "hello"
};

export type RemoteDbHostInfo = {
  hostname: string;
  dbName: string;
} | null;

type ThemeIdentifier = "mylight" | "mydark";

export class LocalStorageController {
  static setRemoteDb(hostname: string, dbName: string) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.REMOTE_DB_HOSTNAME, hostname);
    localStorage.setItem(LOCAL_STORAGE_KEYS.REMOTE_DB_NAME, dbName);
  }

  static getRemoteDb(): RemoteDbHostInfo {
    if (typeof window === "undefined") {
      return null;
    }
    const hostname = localStorage.getItem(LOCAL_STORAGE_KEYS.REMOTE_DB_HOSTNAME);
    const dbName = localStorage.getItem(LOCAL_STORAGE_KEYS.REMOTE_DB_NAME);
    if (!hostname || !dbName) {
      return null;
    }
    return { hostname, dbName };
  }

  static setTheme(theme: string) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, theme);
  }

  static getTheme(fallback: ThemeIdentifier): ThemeIdentifier {
    if (typeof window === "undefined") {
      return fallback;
    }
    const theme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
    return (theme as ThemeIdentifier) || fallback;
  }

  static setIntroCompleted() {
    localStorage.setItem(LOCAL_STORAGE_KEYS.VISITED, "1");
  }

  static getIntroCompleted() {
    if (typeof window === "undefined") {
      return false;
    }
    const visited = localStorage.getItem(LOCAL_STORAGE_KEYS.VISITED);
    return visited === "1";
  }
}
