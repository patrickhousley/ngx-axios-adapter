import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import * as Chance from 'chance';
import { AxiosAngularAdapterService } from './axios-angular-adapter.service';
import { AxiosError } from 'axios';

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
    const req = httpMock.expectOne(url);
    req.flush('');

    // Assert
    expect(req.request.method).toEqual('GET');
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
    const req = httpMock.expectOne(url);
    req.flush('');

    // Assert
    Object.keys(headers).forEach(header => {
      expect(req.request.headers.has(header)).toEqual(true);
      expect(req.request.headers.get(header)).toEqual(headers[header]);
    });
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
    const req = httpMock.expectOne(url);
    req.flush('');

    // Assert
    Object.keys(headers).forEach(header => {
      if (header === 'Content-Type') {
        expect(req.request.headers.has(header)).toEqual(false);
      } else {
        expect(req.request.headers.has(header)).toEqual(true);
        expect(req.request.headers.get(header)).toEqual(headers[header]);
      }
    });
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
    const req = httpMock.expectOne(url);
    req.flush('');

    // Assert
    expect(req.request.headers.has('Authorization')).toEqual(true);
    expect(req.request.headers.get('Authorization')).toEqual(
      `Basic ${Buffer.from(`${auth.username}:${auth.password}`).toString('base64')}`
    );
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
    const req = httpMock.expectOne(`${url}?${paramString}`);
    req.flush('');

    // Assert
    Object.keys(params).forEach(param => {
      expect(req.request.params.has(param)).toEqual(true);
      expect(req.request.params.get(param)).toEqual(params[param]);
    });
  });

  describe('successful responses', () => {
    it('should include the response data in the returned object', done => {
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
      const expected = {
        [chance.guid()]: chance.word(),
        [chance.guid()]: chance.word(),
        [chance.guid()]: chance.word(),
        [chance.guid()]: chance.word(),
        [chance.guid()]: chance.word()
      };

      // Act / Assert
      service
        .adapter({ url, method, params })
        .then(response => {
          expect(response.data).toEqual(expected);
          done();
        })
        .catch(error => done(error));
      const req = httpMock.expectOne(`${url}?${paramString}`);
      req.flush(expected);
    });

    it('should include the response status in the returned object', done => {
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
      const expected = chance.integer({ min: 200, max: 207 });

      // Act / Assert
      service
        .adapter({ url, method, params })
        .then(response => {
          expect(response.status).toEqual(expected);
          done();
        })
        .catch(error => done(error));
      const req = httpMock.expectOne(`${url}?${paramString}`);
      req.flush('', { status: expected, statusText: chance.word() });
    });

    it('should include the response statusText in the returned object', done => {
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
      const expected = chance.word();

      // Act / Assert
      service
        .adapter({ url, method, params })
        .then(response => {
          expect(response.statusText).toEqual(expected);
          done();
        })
        .catch(error => done(error));
      const req = httpMock.expectOne(`${url}?${paramString}`);
      req.flush('', { statusText: expected });
    });

    it('should include the response headers in the returned object', done => {
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
      const expected = {
        [chance.guid()]: chance.word(),
        [chance.guid()]: chance.word(),
        [chance.guid()]: chance.word(),
        [chance.guid()]: chance.word(),
        [chance.guid()]: chance.word()
      };

      // Act / Assert
      service
        .adapter({ url, method, params })
        .then(response => {
          expect(response.headers).toEqual(expected);
          done();
        })
        .catch(error => done(error));
      const req = httpMock.expectOne(`${url}?${paramString}`);
      req.flush('', { headers: expected });
    });

    it('should include the request config in the returned object', done => {
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
      const expected = { url, method, params };

      // Act / Assert
      service
        .adapter({ url, method, params })
        .then(response => {
          expect(response.config).toEqual(expected);
          done();
        })
        .catch(error => done(error));
      const req = httpMock.expectOne(`${url}?${paramString}`);
      req.flush('');
    });

    it('should include the request observable in the returned object', done => {
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

      // Act / Assert
      service
        .adapter({ url, method, params })
        .then(response => {
          expect(response.request).toBeInstanceOf(Observable);
          done();
        })
        .catch(error => done(error));
      const req = httpMock.expectOne(`${url}?${paramString}`);
      req.flush('');
    });
  });

  describe('failure responses', () => {
    it('should include the response data in the returned object', done => {
      // Arrange
      const url = chance.url();
      const method = 'get';
      const expected = {
        [chance.guid()]: chance.word(),
        [chance.guid()]: chance.word(),
        [chance.guid()]: chance.word(),
        [chance.guid()]: chance.word(),
        [chance.guid()]: chance.word()
      };

      // Act / Assert
      service
        .adapter({ url, method })
        .then(() => {
          done('Request should have failed');
        })
        .catch((error: AxiosError) => {
          expect(error.response.data).toEqual(expected);
          done();
        });
      const req = httpMock.expectOne(url);
      req.flush(expected, {
        status: chance.integer({ min: 400, max: 407 }),
        statusText: chance.word()
      });
    });

    it('should include the response status in the returned object', done => {
      // Arrange
      const url = chance.url();
      const method = 'get';
      const expected = chance.integer({ min: 400, max: 407 });

      // Act / Assert
      service
        .adapter({ url, method })
        .then(() => {
          done('Request should have failed');
        })
        .catch((error: AxiosError) => {
          expect(error.response.status).toEqual(expected);
          done();
        });
      const req = httpMock.expectOne(url);
      req.flush('', { status: expected, statusText: chance.word() });
    });

    it('should include the response statusText in the returned object', done => {
      // Arrange
      const url = chance.url();
      const method = 'get';
      const expected = chance.word();

      // Act / Assert
      service
        .adapter({ url, method })
        .then(() => {
          done('Request should have failed');
        })
        .catch((error: AxiosError) => {
          expect(error.response.statusText).toEqual(expected);
          done();
        });
      const req = httpMock.expectOne(url);
      req.flush('', {
        status: chance.integer({ min: 400, max: 407 }),
        statusText: expected
      });
    });

    it('should include the response headers in the returned object', done => {
      // Arrange
      const url = chance.url();
      const method = 'get';
      const expected = {
        [chance.guid()]: chance.word(),
        [chance.guid()]: chance.word(),
        [chance.guid()]: chance.word(),
        [chance.guid()]: chance.word(),
        [chance.guid()]: chance.word()
      };

      // Act / Assert
      service
        .adapter({ url, method })
        .then(() => {
          done('Request should have failed');
        })
        .catch((error: AxiosError) => {
          expect(error.response.headers).toEqual(expected);
          done();
        });
      const req = httpMock.expectOne(url);
      req.flush('', {
        status: chance.integer({ min: 400, max: 407 }),
        statusText: chance.word(),
        headers: expected
      });
    });

    it('should include the request config in the returned object', done => {
      // Arrange
      const url = chance.url();
      const method = 'get';
      const expected = { url, method };

      // Act / Assert
      service
        .adapter({ url, method })
        .then(() => {
          done('Request should have failed');
        })
        .catch((error: AxiosError) => {
          expect(error.response.config).toEqual(expected);
          expect(error.config).toEqual(expected);
          expect(error.config).toEqual(error.response.config);
          done();
        });
      const req = httpMock.expectOne(url);
      req.flush('', {
        status: chance.integer({ min: 400, max: 407 }),
        statusText: chance.word()
      });
    });

    it('should include the request observable in the returned object', done => {
      // Arrange
      const url = chance.url();
      const method = 'get';

      // Act / Assert
      service
        .adapter({ url, method })
        .then(() => {
          done('Request should have failed');
        })
        .catch((error: AxiosError) => {
          expect(error.response.request).toBeInstanceOf(Observable);
          expect(error.request).toBeInstanceOf(Observable);
          expect(error.request).toEqual(error.response.request);
          done();
        });
      const req = httpMock.expectOne(url);
      req.flush('', {
        status: chance.integer({ min: 400, max: 407 }),
        statusText: chance.word()
      });
    });

    it('should include the response code in the returned object', done => {
      // Arrange
      const url = chance.url();
      const method = 'get';

      // Act / Assert
      service
        .adapter({ url, method })
        .then(() => {
          done('Request should have failed');
        })
        .catch((error: AxiosError) => {
          expect(error.code).toEqual('HttpErrorResponse');
          done();
        });
      const req = httpMock.expectOne(url);
      req.flush('', {
        status: chance.integer({ min: 400, max: 407 }),
        statusText: chance.word()
      });
    });
  });

  describe('axios support', () => {
    it('should support axios validateStatus method', done => {
      // Arrange
      const url = chance.url();
      const method = 'get';
      const status = chance.integer({ min: 200, max: 207 });
      const validateStatus = jest.fn(() => true);

      // Act / Assert
      service
        .adapter({ url, method, validateStatus })
        .then(() => {
          expect(validateStatus).toHaveBeenCalledTimes(1);
          expect(validateStatus).toHaveBeenCalledWith(status);
          done();
        })
        .catch(error => {
          done(error);
        });
      const req = httpMock.expectOne(url);
      req.flush('', { status, statusText: chance.word() });
    });

    it('should reject with an axios error when validateStatus returns false', done => {
      // Arrange
      const url = chance.url();
      const method = 'get';
      const validateStatus = jest.fn(() => false);

      // Act / Assert
      service
        .adapter({ url, method, validateStatus })
        .then(() => {
          done('Request should have failed');
        })
        .catch((error: AxiosError) => {
          expect(validateStatus).toHaveBeenCalledTimes(1);
          expect(error.request).toBeDefined();
          expect(error.response).toBeDefined();
          expect(error.request).toEqual(error.response.request);
          done();
        });
      const req = httpMock.expectOne(url);
      req.flush('', {
        status: chance.integer({ min: 200, max: 207 }),
        statusText: chance.word()
      });
    });
  });
});
