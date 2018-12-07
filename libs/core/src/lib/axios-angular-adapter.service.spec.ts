import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import * as faker from 'faker';
import { AxiosAngularAdapterService } from './axios-angular-adapter.service';

describe('AxiosAngularAdapterService', () => {
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
    const url = faker.internet.url();
    const method = 'get';

    // Act
    service.adapter({ url, method });

    // Assert
    const req = httpMock.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush('');
  });
});
