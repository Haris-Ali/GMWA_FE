import { environment } from './environments/environment';

const baseUrl = environment.baseUrl;

export const globals = {
  appName: 'GMWA',

  urls: {
    auth: {
      login: baseUrl + '/login',
      logout: baseUrl + '/logout',
      signup: baseUrl + '/signup',
      forgotPassword: baseUrl + '/forgotPassword',
    },

    // MORE API URLS HERE
  },
};
