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

      const request = this.httpClient.request(
        config.method.toUpperCase(),
        config.url
      );

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
    }
  }
}
