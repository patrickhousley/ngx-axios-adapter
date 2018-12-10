import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import * as Chance from 'chance';
import { AxiosAngularAdapterService } from './axios-angular-adapter.service';

describe('AxiosAngularAdapterService', () => {
  const chance = new Chance();
  let service: AxiosAngularAdapterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.get(AxiosAngularAdapterService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(AxiosAngularAdapterService);
    expect(httpMock).toBeDefined();
  });

  it('should return an axios adapter', () => {
    expect(service.adapter).toBeDefined();
    expect(typeof service.adapter).toEqual('function');
  });

  it('should use HttpClient to make network calls', () => {
    // Arrange
    const url = chance.url();
    const method = 'get';

    // Act
    service.adapter({ url, method });

    // Assert
    const req = httpMock.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush('');
  });

  it('should send provided headers', () => {
    // Arrange
    const url = chance.url();
    const method = 'get';
    const headers = {
      [chance.guid()]: chance.word(),
      [chance.guid()]: chance.word(),
      [chance.guid()]: chance.word(),
      [chance.guid()]: chance.word(),
      [chance.guid()]: chance.word()
    };

    // Act
    service.adapter({ url, method, headers });

    // Assert
    const req = httpMock.expectOne(url);
    Object.keys(headers).forEach(header => {
      expect(req.request.headers.has(header)).toEqual(true);
      expect(req.request.headers.get(header)).toEqual(headers[header]);
    });
    req.flush('');
  });

  it('should remove the content type header when form data is being submitted', () => {
    // Arrange
    const url = chance.url();
    const method = 'post';
    const headers = {
      [chance.guid()]: chance.word(),
      [chance.guid()]: chance.word(),
      [chance.guid()]: chance.word(),
      [chance.guid()]: chance.word(),
      [chance.guid()]: chance.word(),
      'Content-Type': 'text/json'
    };
    const data = new FormData();

    // Act
    service.adapter({ url, method, headers, data });

    // Assert
    const req = httpMock.expectOne(url);
    Object.keys(headers).forEach(header => {
      if (header === 'Content-Type') {
        expect(req.request.headers.has(header)).toEqual(false);
      } else {
        expect(req.request.headers.has(header)).toEqual(true);
        expect(req.request.headers.get(header)).toEqual(headers[header]);
      }
    });
    req.flush('');
  });

  it('should support basic authentication', () => {
    // Arrange
    const url = chance.url();
    const method = 'get';
    const auth = {
      username: chance.guid(),
      password: chance.guid()
    };

    // Act
    service.adapter({ url, method, auth, headers: {} });

    // Assert
    const req = httpMock.expectOne(url);
    expect(req.request.headers.has('Authorization')).toEqual(true);
    expect(req.request.headers.get('Authorization')).toEqual(
      `Basic ${btoa(`${auth.username}:${auth.password}`)}`
    );
    req.flush('');
  });

  it('should send request params', () => {
    // Arrange
    const url = chance.url();
    const method = 'get';
    const params = {
      [chance.guid()]: chance.word(),
      [chance.guid()]: chance.word(),
      [chance.guid()]: chance.word(),
      [chance.guid()]: chance.word(),
      [chance.guid()]: chance.word()
    };
    const paramString = Object.keys(params)
      .map(param => `${param}=${params[param]}`)
      .join('&');

    // Act
    service.adapter({ url, method, params });

    // Assert
    const req = httpMock.expectOne(`${url}?${paramString}`);
    Object.keys(params).forEach(param => {
      expect(req.request.params.has(param)).toEqual(true);
      expect(req.request.params.get(param)).toEqual(params[param]);
    });
    req.flush('');
  });
});
