import { AbstractControl, ValidationErrors } from '@angular/forms';

export function pinValidator(control: AbstractControl): ValidationErrors | null {
    const pinRegEx = /^\d{4}$/;
    if (control.value && !pinRegEx.test(control.value)) {
      return { invalidPin: 'The PIN must contain 4 digits.' };
    }
    return control.value ? null : { requiredPin: 'PIN is required' }; // Mensaje si está vacío
}
