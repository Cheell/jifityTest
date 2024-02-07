import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BehaviorSubject, map, switchMap, take, timer } from 'rxjs';
import { interval } from 'rxjs/internal/observable/interval';
import { TRoute } from '../../app.routes';
import { ValidatorType } from '../../models/form-control.model';
import { TUser } from '../../models/user.model';
import { DataService } from '../../service/data-service.service';
import { FormControlComponent } from "../form-control/form-control.component";

@Component({
    selector: 'app-user-details',
    templateUrl: './user-details.component.html',
    styleUrl: './user-details.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FormControlComponent, RouterLink, ReactiveFormsModule]
})
export class UserDetailsComponent {
  public readonly errorText = ' is incorrect or empty!';
  public isSaveDisabledTimer = new BehaviorSubject<number>(0);
  public form = new FormGroup<any>({});
  private id!: number;

  constructor(private data: DataService, private route: ActivatedRoute) {  }

  public isEdit$ = this.route.url.pipe(map(url => url.some(seg => (seg.path as TRoute) === 'new-user'))); 
  public user$ = this.route.params.pipe(switchMap(param => this.data.usersList$.pipe(map(usersList => {
    this.id = param['id'];
    return usersList[param['id']] as TUser;
  }))));

  public formControls$ = this.data.userForm$.pipe(switchMap(userForm => this.user$.pipe(
    map(user => {
      userForm.forEach(uForm => {
        this.form.addControl(uForm.key, new FormControl(user?.[uForm.key], this.createValidators(uForm.validators)));
      })
      return userForm.sort((a,b) => a.order - b.order);
    }
  ))));   
    
  public save() {
    if (this.form.valid) {
      this.data.save(this.form.value as TUser, this.id);
      this.isSaveDisabledTimer.next(3);
      interval(1000).pipe(take(this.isSaveDisabledTimer.value)).subscribe(r => this.isSaveDisabledTimer.next(this.isSaveDisabledTimer.value - 1));
    } else {
      this.form.markAllAsTouched();
    }
  }

  private createValidators(validators: ValidatorType[]): ValidatorFn[] {
    return validators.map(validator => {
      switch (validator) {
        case 'required': return Validators.required;
        case 'email': return Validators.email;
        case 'phone': return Validators.pattern('[- +()0-9]+')
        default: throw 'Wrong validator type';
      }
    })
  }
}
