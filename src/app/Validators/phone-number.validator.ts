import { AbstractControl, ValidationErrors } from '@angular/forms';

// Validates the phone number format based on international standards
export function phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
    const phoneRegEx = /^\+?[1-9]\d{1,14}$/;  // Suitable for international phone numbers
    if (control.value && !phoneRegEx.test(control.value)) {
        return { invalidPhoneNumber: 'Please enter a valid phone number.' };
    }
    return null;
}