import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AxiosAngularAdapterService {
  constructor(private readonly httpClient: HttpClient) {}

  get adapter() {
    return <T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
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
        params,
        observe: 'response'
      });

      return request.toPromise().then((response: HttpResponse<T>) => {
        const responseHeaders = response.headers.keys().reduce((headersColl, headerKey) => {
          if (response.headers.has(headerKey)) {
            headersColl[headerKey] = response.headers.get(headerKey);
          }

          return headersColl;
        }, {});

        return {
          data: response.body,
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
          config: config,
          request
        };
      });
    };
  }
}
