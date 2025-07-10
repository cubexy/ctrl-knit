export type DatabaseConnectionPresentation =
  | {
      status: {
        type: "status-error" | "status-warning" | "status-success";
        message: string;
        loading: boolean;
      };
      loggedIn: false;
      disabled: boolean;
    }
  | {
      username: string;
      hostname: string;
      dbString: string;
      status: {
        type: "status-error" | "status-warning" | "status-success";
        message: string;
        loading: boolean;
      };
      loggedIn: true;
      disabled: boolean;
    };

export const DEFAULT_DATABASE_CONNECTION_PRESENTATION: DatabaseConnectionPresentation = {
  status: {
    type: "status-error",
    message: "Nicht verbunden",
    loading: false
  },
  loggedIn: false,
  disabled: false
};
