import { AbstractControl, ValidationErrors } from '@angular/forms';

export function ageValidator(control: AbstractControl): ValidationErrors | null {
  const birthdate = new Date(control.value);
  
  if (isNaN(birthdate.getTime())) {
    return { invalidDate: 'Please provide a valid date of birth.' };
  }
  
  const age = calculateAge(birthdate);
  if (age < 18) {
    return { age: 'You must be at least 18 years old' };
  }
  return null;
}

function calculateAge(birthdate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const m = today.getMonth() - birthdate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  return age;
}
