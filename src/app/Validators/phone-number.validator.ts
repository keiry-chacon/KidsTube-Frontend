import { AbstractControl, ValidationErrors } from '@angular/forms';

export function phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
    const phoneRegEx = /^\+?[1-9]\d{1,14}$/;  // Este es adecuado para números internacionales
    if (control.value && !phoneRegEx.test(control.value)) {
        return { invalidPhoneNumber: 'Please enter a valid phone number.' };
    }
    return null;
}
