# NgxAxiosAdapter

Axios adapter for  [Angular 6+](https://github.com/angular/angular)

## Installing

```bash
npm install @ngx-axios-adapter/core
```

## Usage

```ts
import { Injectable } from '@angular/core';

@Injectable()
export class ContentService {

  constructor(private readonly axiosAdapter: AxiosAngularAdapterService) { }

  getContent() {
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1', {
      adapter: this.axiosAdapter.adapter
    });

    return response.data;
  }

}
```

## Why

We do not recommend using any other Http client in an Angular project other than the one provided by the Angular team. However, if you wish to use Axios in place of the Angular HttpClient, or have an indirect reliance upon Axios, the package will ensure your project is still server-side renderable by making all HTTP calls through the Angular HttpClient.

One such scenario would be using the Contentful JavaScript SDK for retrieving content for your site. The Contentful SDK includes it's own version of Axios which makes all calls to the Contentful services using the standard Node http or https module. You may notice that when you try to server-side render your app, the app is rendered and sent to the browser before the calls to Contentful are complete thereby defeating the purpose of server-side rendering.

While we specifically call out Contentful here, this project is meant as a universal Axios adapter to bridge the gap between Axios and Angular. Feel free to use it in your own projects but you may not see much, if any, benefit unless you are server-side rendering your app.

## Contributing

Contributions in the form of pull requests or opened issues are very welcome.

### Getting Started

This project makes use of the [Angular CLI](https://github.com/angular/angular-cli) using [Nrwl Nx](https://nrwl.io/nx). To get started, make sure you install these tools globally.

```bash
npm i -g @angular/cli
npm i -g @nrwl/schematics
```

### Project Structure

The primary code distributed on NPM can be found in `libs/core`. All other code, including code in `apps`, is meant only to support testing and implementation of the library.

### Testing

Unit testing is performed using [Jest](https://github.com/facebook/jest). If you contribute code to the project, you are expected to write tests. Pull requests that lack proper testing will be rejected.

```bash
# To execute all tests
npm test

# To execute all tests in watch mode
npm test -- --watch

# To execute a specific test
npm test -- axios-angular-adapter.service.ts
```

### Linting

All code must abide by and pass the linting rules. For the most part, these are the defaults provided for any Angular project so you should be at home in the project. If you believe a change is needed to the lint rules, feel free to open a pull request but be sure to explain the reasoning behind the change.

```bash
# To run lint checks
npm run lint
```

### Building

For the most part, the only code you should ever need to build would be in `libs/core`. However, building will typically only be necessary for releases.

```bash
# To build the core lib
npm run build
```
