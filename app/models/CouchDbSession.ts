export type CouchDbSession = {
  info: {
    authenticated: string;
    authentication_db: string;
    authentication_handlers: string[];
  };
  ok: boolean;
  userCtx: {
    name: string;
    roles: string[];
  };
};
