import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap, catchError, of, forkJoin, Observable } from 'rxjs';
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
    }), catchError(e => {
      console.error("Bad things happen: " + e);
      this.usersList$$.next(this.user_list.users);
      return of(false);
    }))
  }

  private getForms() {
    return this.httpClient.get<{form_fields: IFControl[]}>(this.assestsLink + 'user_form.json').pipe(tap(uForm => {
      this.userForm$$.next(uForm.form_fields);
    }), catchError(e => {
      console.error("Bad things happen: " + e);
      this.userForm$$.next(this.user_form.form_fields as IFControl[]);
      return of(false);
    }))
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

  private user_list = 
  {
    "users": [
      {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "phone": "555-555-5555"
      },
      {
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane.smith@example.com",
        "phone": "555-123-4567"
      },
      {
        "first_name": "Michael",
        "last_name": "Johnson",
        "email": "michael.johnson@example.com",
        "phone": "555-987-6543"
      },
      {
        "first_name": "Emily",
        "last_name": "Brown",
        "email": "emily.brown@example.com",
        "phone": "555-111-2222"
      },
      {
        "first_name": "David",
        "last_name": "Williams",
        "email": "david.williams@example.com",
        "phone": "555-444-3333"
      },
      {
        "first_name": "Sarah",
        "last_name": "Davis",
        "email": "sarah.davis@example.com",
        "phone": "555-777-8888"
      }
    ]
  }
  
  private user_form = {
    "form_fields": [
      {
        "key": "first_name",
        "label": "First Name",
        "type": "text",
        "order": 1,
        "validators": ["required"]
      },
      {
        "key": "last_name",
        "label": "Last Name",
        "type": "text",
        "order": 2,
        "validators": ["required"]
      },
      {
        "key": "phone",
        "label": "Phone",
        "type": "tel",
        "order": 3,
        "validators": ["required", "phone"]
      },
      {
        "key": "email",
        "label": "Email",
        "type": "email",
        "order": 4,
        "validators": ["required", "email"]
      }
    ]
  }
  
}
