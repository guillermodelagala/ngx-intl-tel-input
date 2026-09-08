import { signal } from '@angular/core';
import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { form, FormField, required } from '@angular/forms/signals';

import {
  ChangeData,
  CountryISO,
  NgxIntlTelInputComponent,
  PhoneNumberFormat,
  phoneNumberValidator,
  SearchCountryField,
} from '../../projects/ngx-intl-tel-input/src/public_api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormField, JsonPipe, NgxIntlTelInputComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  separateDialCode = signal(false);
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries = signal<CountryISO[]>([
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ]);
  phoneModel = signal<{ phone: ChangeData | null }>({ phone: null });
  phoneForm = form(this.phoneModel, (path) => {
    required(path.phone, { message: 'Phone number is required.' });
    phoneNumberValidator(path.phone);
  });

  changePreferredCountries(): void {
    this.preferredCountries.set([CountryISO.India, CountryISO.Canada]);
  }

  reset(): void {
    this.phoneForm.phone().reset();
  }
}
