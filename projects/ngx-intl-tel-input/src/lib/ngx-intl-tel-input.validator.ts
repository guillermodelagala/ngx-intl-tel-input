import * as lpn from 'google-libphonenumber';

import { SchemaPath, validate } from '@angular/forms/signals';

import { ChangeData } from './interfaces/change-data';

export interface PhoneNumberValidatorOptions {
  message?: string;
}

export const phoneNumberValidator = (
  path: SchemaPath<ChangeData | null>,
  options: PhoneNumberValidatorOptions = {},
): void => {
  validate(path, ({ value }) => {
    const phone = value();
    if (!phone?.number) {
      return;
    }

    if (!phone.countryCode) {
      return {
        kind: 'phoneNumber',
        message: options.message ?? 'Enter a valid phone number.',
      };
    }

    try {
      const number = lpn.PhoneNumberUtil.getInstance().parse(
        phone.number,
        phone.countryCode,
      );
      const valid = lpn.PhoneNumberUtil.getInstance().isValidNumberForRegion(
        number,
        phone.countryCode,
      );

      if (valid) {
        return;
      }
    } catch {
      // Parsing failures are returned as the same validation error.
    }

    return {
      kind: 'phoneNumber',
      message: options.message ?? 'Enter a valid phone number.',
    };
  });
};
