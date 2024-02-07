import { Component, DestroyRef, forwardRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { noop, tap } from 'rxjs';
import { IFControl } from '../../models/form-control.model';

@Component({
  selector: 'app-form-control',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-control.component.html',
  styleUrl: './form-control.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => FormControlComponent),
  }]
})
export class FormControlComponent implements OnInit {

  @Input() set controlData(control: IFControl) {
    this.label = control.label;
    this.type = control.type;
    this.placeholder = control.label;
  }

  formControl = new FormControl();

  public label: string = '';
  public type: string = 'text';
  public placeholder: string = '';


  public value!: string;
  public isDisabled: boolean = false;
  onChange: (value: string) => void = noop;
  onTouch: () => void = noop;

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  writeValue(value: string): void {
    this.formControl.setValue(value, { emitEvent: false });
  }

  ngOnInit(): void {

    this.formControl.valueChanges
      .pipe(
        tap(value => this.onChange(value)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  destroyRef: DestroyRef = inject(DestroyRef);
}

