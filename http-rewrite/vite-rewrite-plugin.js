import history from './history-plugin';

export default function redirectAll() {
  return {
    name: 'rewrite-all',
    configureServer(server) {
      return () => {
        server.middlewares.use((req, res, next) => {
          history(req, res, next);
        });
      };
    }
  };
}
