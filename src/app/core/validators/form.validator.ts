import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export class CustomValidators {
  static nonZero(control: AbstractControl): ValidationErrors | null {
    return control?.value === 0 ? {nonZero: true} : null;
  }
  static surveyValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const coordinates = group?.get('coordinates')?.getRawValue();
      return ((!!coordinates.dlon && !!coordinates.dlat) || !!coordinates.rad) && !!coordinates.lat && !!coordinates.lon ? null : { badPopulated: true}
    }
  }
}

