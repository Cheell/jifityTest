export interface IFControl {
  key: FormType,
  label: string,
  type: string,
  order: number,
  validators: ValidatorType[];
}

export type FormType = 'first_name' | 'last_name' | 'email' | 'phone';
export type ValidatorType = 'required' | 'phone' | 'email';