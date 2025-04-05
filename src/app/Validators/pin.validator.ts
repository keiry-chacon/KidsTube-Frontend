import { AbstractControl, ValidationErrors } from '@angular/forms';

// Validates that the PIN is exactly 4 digits and ensures it's not empty
export function pinValidator(control: AbstractControl): ValidationErrors | null {
    const pinRegEx = /^\d{6}$/;
    if (control.value && !pinRegEx.test(control.value)) {
      return { invalidPin: 'The PIN must contain 6 digits.' };
    }
    return control.value ? null : { requiredPin: 'PIN is required' }; // Error message if empty
}