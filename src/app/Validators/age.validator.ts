import { AbstractControl, ValidationErrors } from '@angular/forms';

// Validates the age of a user based on their date of birth
export function ageValidator(control: AbstractControl): ValidationErrors | null {
  const birthdate = new Date(control.value);

  // Check if the provided date is valid
  if (isNaN(birthdate.getTime())) {
    return { invalidDate: 'Please provide a valid date of birth.' };
  }

  // Calculate the user's age and validate it
  const age = calculateAge(birthdate);
  if (age < 18) {
    return { age: 'You must be at least 18 years old' };
  }
  return null;
}

// Calculates the age based on the provided birthdate
function calculateAge(birthdate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDifference = today.getMonth() - birthdate.getMonth();

  // Adjust age if the birthday hasn't occurred yet this year
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  return age;
}