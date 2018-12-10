import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AxiosRequestConfig } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AxiosAngularAdapterService {
  constructor(private readonly httpClient: HttpClient) {}

  get adapter() {
    return (config: AxiosRequestConfig) => {
      const { method, url, headers, data, auth, params } = config;

      // Remove content-type for form data
      if (typeof FormData !== 'undefined' && data instanceof FormData) {
        delete headers['Content-Type'];
      }

      // HTTP basic authentication
      if (auth) {
        headers.Authorization = `Basic ${btoa(
          `${auth.username}:${auth.password}`
        )}`;
      }

      const request = this.httpClient.request(method.toUpperCase(), url, {
        body: data,
        headers,
        params
      });

      return request.toPromise().then((response: HttpResponse<any>) => {
        return {
          data: response.body,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          config: config,
          request
        };
      });
    };
  }
}
