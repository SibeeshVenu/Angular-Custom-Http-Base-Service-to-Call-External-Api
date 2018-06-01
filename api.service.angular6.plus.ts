import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestOptions, RequestMethod, Response } from '@angular/http';
import { Observable } from 'rxjs'
import { filter, map, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment'; 

@Injectable()
export class ApiService {
  private baseUrl: string = environment.apiUrl;
     constructor(private http: Http) {
  }

  request(url: string, method: RequestMethod, body?: Object) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    //headers.append("Authorization", `Bearer ${this.auth.getToken()}`)
    const requestOptions = new RequestOptions({
      url: `${this.baseUrl}/${url}`,
      method: method,
      headers: headers
    });

    if (body) {
      requestOptions.body = body;
    }

    const request = new Request(requestOptions);
    return this.http.request(request)
      .pipe(map((res: Response) => res.json().result),
       catchError((res: Response) => this.onError(res)));
  }

  onError(res: Response) {
    const statusCode = res.status;
    const body = res.json();
    const error = {
      statusCode: statusCode,
      error: body.error
    };
    console.log(error);
    return Observable.throw(error);
  }

  get(url: string) {
    return this.request(url, RequestMethod.Get);
  }

  post(url: string, body: Object) {
    return this.request(url, RequestMethod.Post, body);
  }

  put(url: string, body: Object) {
    return this.request(url, RequestMethod.Put, body);
  }

  delete(url: string) {
    this.request(url, RequestMethod.Delete);
  }
}
