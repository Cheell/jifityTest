import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap, catchError, switchMap, forkJoin, Observable } from 'rxjs';
import { IFControl } from '../models/form-control.model';
import { TUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) {}

  private readonly assestsLink = '../assets/';

  private usersList$$ = new BehaviorSubject<TUser[]>([]);
  public usersList$ = this.usersList$$.asObservable();

  private userForm$$ = new BehaviorSubject<IFControl[]>([]);
  public userForm$ = this.userForm$$.asObservable();

  private getUsers() {
    return this.httpClient.get<{users: TUser[]}>(this.assestsLink + 'user_list.json').pipe(tap(uList => {
      this.usersList$$.next(uList.users);
      console.log(uList.users);
    }), catchError(e => {throw "Bad things happen: " + e}))
  }

  private getForms() {
    return this.httpClient.get<{form_fields: IFControl[]}>(this.assestsLink + 'user_form.json').pipe(tap(uForm => {
      this.userForm$$.next(uForm.form_fields);
      console.log(uForm.form_fields);
    }), catchError(e => {throw "Bad things happen: " + e}))
  }

  public fetchData() {
    return forkJoin([this.getUsers(), this.getForms()]);
  }

  public save(user: TUser, id: number) {
    const users = this.usersList$$.getValue();
    if (id != undefined && users[id]) {
      users[id] = user;
    } else {
      users.push(user);
    }
    this.usersList$$.next(users);
  }
}
