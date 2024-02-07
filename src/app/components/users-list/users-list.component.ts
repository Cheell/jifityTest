import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TUser } from '../../models/user.model';
import { DataService } from '../../service/data-service.service';
import { FormControlComponent } from '../form-control/form-control.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormControlComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
  public userList$: Observable<TUser[]> = this.data.usersList$;

  constructor(private data: DataService, private router: Router) {}

  public editCreate(i?: number) {
    i == undefined ? this.router.navigate(['/new-user']) : this.router.navigate(['/edit-user', i])
  }

}
