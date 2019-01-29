import axios, { AxiosRequestConfig } from 'axios';
import { setPassword } from 'keytar';

const appName = 'orangemiles';
const redirectUri = process.env.APP_HOST_URL;

interface IOAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export const getAuthenticationUrl = () => process.env.ACCESS_URL;

export const refreshTokens = () => undefined;

export const loadTokens = (username: string, authorizationCode: string) => {
  const authenticationUrl = getAuthenticationUrl();
  const config: AxiosRequestConfig = {
    headers: {
      'content-type': 'application/json',
    },
  };

  const data = {
    grant_type: 'authorization_code',
    client_id: process.env.CLIENT_ID,
    code: authorizationCode,
    redirect_uri: redirectUri,
  };

  return axios
    .post<IOAuthResponse>(authenticationUrl, data, config)
    .then(response => {
      const refreshToken = response.data && response.data.refresh_token;

      if (!refreshToken) {
        // log something
      }

      setPassword(appName, username, refreshToken);
    })
    .catch(error => {
      // log error
    });
};
