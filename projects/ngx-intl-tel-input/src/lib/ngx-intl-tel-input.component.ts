import * as lpn from 'google-libphonenumber';

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnChanges,
  OnInit,
  input,
  model,
  output,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import {
  FormValueControl,
  transformedValue,
  ValidationError,
  WithOptionalFieldTree,
} from '@angular/forms/signals';
import { NgClass } from '@angular/common';

import { CountryCode } from './data/country-code';
import { CountryISO } from './enums/country-iso.enum';
import { SearchCountryField } from './enums/search-country-field.enum';
import { ChangeData } from './interfaces/change-data';
import { Country } from './model/country.model';
import { PhoneNumberFormat } from './enums/phone-number-format.enum';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'ngx-intl-tel-input',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ngx-intl-tel-input.component.html',
  styleUrls: ['./bootstrap-dropdown.css', './ngx-intl-tel-input.component.css'],
  providers: [CountryCode],
})
export class NgxIntlTelInputComponent
  implements FormValueControl<ChangeData | null>, OnInit, OnChanges
{
  readonly value = model<ChangeData | null>(null);
  readonly preferredCountries = input<readonly string[]>([]);
  readonly enablePlaceholder = input(true);
  readonly customPlaceholder = input<string | undefined>(undefined);
  readonly numberFormat = input(PhoneNumberFormat.International);
  readonly cssClass = input('form-control');
  readonly onlyCountries = input<readonly string[]>([]);
  readonly enableAutoCountrySelect = input(true);
  readonly searchCountryFlag = input(false);
  readonly searchCountryField = input<readonly SearchCountryField[]>([
    SearchCountryField.All,
  ]);
  readonly searchCountryPlaceholder = input('Search Country');
  readonly maxLength = input<number | undefined>(undefined);
  readonly selectFirstCountry = input(true);
  readonly selectedCountryISO = input<CountryISO | undefined>(undefined);
  readonly inputId = input('phone');
  readonly separateDialCode = input(false);
  readonly required = input(false);
  readonly disabled = input(false);
  readonly invalid = input(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>(
    [],
  );
  readonly countryChange = output<Country>();
  readonly touch = output<void>();

  private readonly countryCodeData = inject(CountryCode);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  selectedCountry: Country = {
    areaCodes: undefined,
    dialCode: '',
    htmlId: '',
    flagClass: '',
    iso2: '',
    name: '',
    placeHolder: '',
    priority: 0,
  };

  phoneNumber: string | undefined = '';
  allCountries: Array<Country> = [];
  preferredCountriesInDropDown: Array<Country> = [];
  private readonly phoneUtil = lpn.PhoneNumberUtil.getInstance();
  countrySearchText = '';
  isDropdownOpen = false;
  separateDialCodeClass = '';

  readonly countryList = viewChild<ElementRef<HTMLUListElement>>('countryList');
  readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  readonly phoneInput = viewChild<ElementRef<HTMLInputElement>>('focusable');

  readonly rawValue = transformedValue(this.value, {
    parse: (value: string) => ({ value: this.parsePhoneNumber(value) }),
    format: (value: ChangeData | null) => value?.number ?? '',
  });

  ngOnInit(): void {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const selectedISO = changes['selectedCountryISO'];
    if (this.allCountries.length && selectedISO) {
      this.updateSelectedCountry();
    }
    if (changes['preferredCountries']) {
      this.updatePreferredCountries();
    }
    this.checkSeparateDialCodeStyle();
  }

  /*
		This is a wrapper method to avoid calling this.ngOnInit() in writeValue().
		Ref: http://codelyzer.com/rules/no-life-cycle-call/
	*/
  init(): void {
    this.fetchCountryData();
    if (this.preferredCountries().length) {
      this.updatePreferredCountries();
    }
    if (this.onlyCountries().length) {
      this.allCountries = this.allCountries.filter((c) =>
        this.onlyCountries().includes(c.iso2),
      );
    }
    if (this.selectFirstCountry()) {
      if (this.preferredCountriesInDropDown.length) {
        this.setSelectedCountry(this.preferredCountriesInDropDown[0]);
      } else {
        this.setSelectedCountry(this.allCountries[0]);
      }
    }
    this.updateSelectedCountry();
    this.checkSeparateDialCodeStyle();
  }

  setSelectedCountry(country: Country) {
    this.selectedCountry = country;
    this.countryChange.emit(country);
  }

  /**
   * Search country based on country name, iso2, dialCode or all of them.
   */
  public searchCountry(): void {
    const countryList = this.countryList()?.nativeElement;
    if (!this.countrySearchText) {
      countryList
        ?.querySelector<HTMLElement>('.iti__country-list li')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      return;
    }
    const countrySearchTextLower = this.countrySearchText.toLowerCase();
    const searchFields = this.searchCountryField();
    const country = this.allCountries.filter((c) => {
      if (searchFields.includes(SearchCountryField.All)) {
        // Search in all fields
        if (c.iso2.toLowerCase().startsWith(countrySearchTextLower)) {
          return true;
        }
        if (c.name.toLowerCase().startsWith(countrySearchTextLower)) {
          return true;
        }
        if (c.dialCode.startsWith(this.countrySearchText)) {
          return true;
        }
      } else {
        // Or search by specific SearchCountryField(s)
        if (searchFields.includes(SearchCountryField.Iso2)) {
          if (c.iso2.toLowerCase().startsWith(countrySearchTextLower)) {
            return true;
          }
        }
        if (searchFields.includes(SearchCountryField.Name)) {
          if (c.name.toLowerCase().startsWith(countrySearchTextLower)) {
            return true;
          }
        }
        if (searchFields.includes(SearchCountryField.DialCode)) {
          if (c.dialCode.startsWith(this.countrySearchText)) {
            return true;
          }
        }
      }
      return false;
    });

    if (country.length > 0) {
      const el = countryList?.querySelector<HTMLElement>(
        '#' + country[0].htmlId,
      );
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      }
    }

    this.checkSeparateDialCodeStyle();
  }

  public onCountrySearchInput(event: Event): void {
    this.countrySearchText = (event.target as HTMLInputElement).value;
    this.searchCountry();
  }

  toggleDropdown(event?: Event): void {
    event?.stopPropagation();

    if (this.disabled()) {
      return;
    }

    this.isDropdownOpen = !this.isDropdownOpen;

    const searchInput = this.searchInput();
    if (this.isDropdownOpen && this.searchCountryFlag() && searchInput) {
      setTimeout(() => searchInput.nativeElement.focus(), 0);
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  stopDropdownEvent(event: Event): void {
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.isDropdownOpen) {
      return;
    }

    const target = event.target as Node | null;

    if (target && this.elementRef.nativeElement.contains(target)) {
      return;
    }

    this.closeDropdown();
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeDropdown();
  }

  public onPhoneNumberInput(event: Event): void {
    this.rawValue.set((event.target as HTMLInputElement).value);
  }

  public onCountrySelect(country: Country, el: { focus: () => void }): void {
    this.setSelectedCountry(country);
    this.closeDropdown();

    this.checkSeparateDialCodeStyle();

    this.rawValue.set(this.rawValue());

    el.focus();
  }

  reset(): void {
    this.value.set(null);
    this.rawValue.set('');
    const input = this.phoneInput()?.nativeElement;
    if (input) {
      input.value = '';
    }
  }

  public onInputKeyPress(event: KeyboardEvent): void {
    const allowedChars = /[0-9\+\-\(\)\ ]/;
    const allowedCtrlChars = /[axcv]/; // Allows copy-pasting
    const allowedOtherKeys = [
      'ArrowLeft',
      'ArrowUp',
      'ArrowRight',
      'ArrowDown',
      'Home',
      'End',
      'Insert',
      'Delete',
      'Backspace',
    ];

    if (
      !allowedChars.test(event.key) &&
      !(event.ctrlKey && allowedCtrlChars.test(event.key)) &&
      !allowedOtherKeys.includes(event.key)
    ) {
      event.preventDefault();
    }
  }

  resolvePlaceholder(): string {
    let placeholder = '';
    if (this.customPlaceholder()) {
      placeholder = this.customPlaceholder() ?? '';
    } else if (this.selectedCountry.placeHolder) {
      placeholder = this.selectedCountry.placeHolder;
      if (this.separateDialCode()) {
        placeholder = this.removeDialCode(placeholder);
      }
    }
    return placeholder;
  }

  /* --------------------------------- Helpers -------------------------------- */
  private parsePhoneNumber(phoneNumber: string): ChangeData | null {
    if (!phoneNumber) {
      return null;
    }

    let countryCode = this.selectedCountry.iso2;
    const number = this.getParsedNumber(phoneNumber, countryCode);

    const parsedCountryCode = number?.getCountryCode();
    if (number && this.enableAutoCountrySelect() && parsedCountryCode) {
      countryCode =
        this.getCountryIsoCode(parsedCountryCode, number) ?? countryCode;
      if (countryCode !== this.selectedCountry.iso2) {
        const newCountry = [...this.allCountries]
          .sort((a, b) => a.priority - b.priority)
          .find((country) => country.iso2 === countryCode);
        if (newCountry) {
          this.selectedCountry = newCountry;
        }
      }
    }

    countryCode = countryCode || this.selectedCountry.iso2;
    this.checkSeparateDialCodeStyle();

    const internationalNumber = number
      ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.INTERNATIONAL)
      : '';
    const displayedNumber =
      this.separateDialCode() && internationalNumber
        ? this.removeDialCode(internationalNumber)
        : phoneNumber;

    return {
      number: displayedNumber,
      internationalNumber,
      nationalNumber: number
        ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.NATIONAL)
        : '',
      e164Number: number
        ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.E164)
        : '',
      countryCode: countryCode.toUpperCase(),
      dialCode: '+' + this.selectedCountry.dialCode,
    };
  }

  /**
   * Returns parse PhoneNumber object.
   * @param phoneNumber string
   * @param countryCode string
   */
  private getParsedNumber(
    phoneNumber: string | undefined,
    countryCode: string,
  ): lpn.PhoneNumber | undefined {
    if (!phoneNumber || !countryCode) {
      return undefined;
    }

    try {
      return this.phoneUtil.parse(phoneNumber, countryCode.toUpperCase());
    } catch {
      return undefined;
    }
  }

  /**
   * Adjusts input alignment based on the dial code presentation style.
   */
  private checkSeparateDialCodeStyle(): void {
    if (this.separateDialCode() && this.selectedCountry) {
      const cntryCd = this.selectedCountry.dialCode;
      this.separateDialCodeClass =
        'separate-dial-code iti-sdc-' + (cntryCd.length + 1);
    } else {
      this.separateDialCodeClass = '';
    }
  }

  /**
   * Cleans dialcode from phone number string.
   * @param phoneNumber string
   */
  private removeDialCode(phoneNumber: string): string {
    const number = this.getParsedNumber(phoneNumber, this.selectedCountry.iso2);
    if (!number) {
      return phoneNumber;
    }

    phoneNumber = this.phoneUtil.format(
      number,
      lpn.PhoneNumberFormat[this.numberFormat()],
    );
    if (phoneNumber.startsWith('+') && this.separateDialCode()) {
      phoneNumber = phoneNumber.slice(phoneNumber.indexOf(' ') + 1);
    }
    return phoneNumber;
  }

  /**
   * Sifts through all countries and returns iso code of the primary country
   * based on the number provided.
   * @param countryCode country code in number format
   * @param number PhoneNumber object
   */
  private getCountryIsoCode(
    countryCode: number,
    number: lpn.PhoneNumber,
  ): string | undefined {
    // Will use this to match area code from the first numbers
    const rawNumber = number.getNationalNumber()?.toString() ?? '';
    // List of all countries with countryCode (can be more than one. e.x. US, CA, DO, PR all have +1 countryCode)
    const countries = this.allCountries.filter(
      (c) => c.dialCode === countryCode.toString(),
    );
    // Main country is the country, which has no areaCodes specified in country-code.ts file.
    const mainCountry = countries.find((c) => c.areaCodes === undefined);
    // Secondary countries are all countries, which have areaCodes specified in country-code.ts file.
    const secondaryCountries = countries.filter(
      (c) => c.areaCodes !== undefined,
    );
    let matchedCountry = mainCountry ? mainCountry.iso2 : undefined;

    /*
			Iterate over each secondary country and check if nationalNumber starts with any of areaCodes available.
			If no matches found, fallback to the main country.
		*/
    secondaryCountries.forEach((country) => {
      country.areaCodes?.forEach((areaCode) => {
        if (rawNumber.startsWith(areaCode)) {
          matchedCountry = country.iso2;
        }
      });
    });

    return matchedCountry;
  }

  /**
   * Gets formatted example phone number from phoneUtil.
   * @param countryCode string
   */
  protected getPhoneNumberPlaceHolder(countryCode: string): string {
    try {
      return this.phoneUtil.format(
        this.phoneUtil.getExampleNumber(countryCode),
        lpn.PhoneNumberFormat[this.numberFormat()],
      );
    } catch {
      return '';
    }
  }

  /**
   * Clearing the list to avoid duplicates (https://github.com/guillermodelagala/ngx-intl-tel-input/issues/248)
   */
  protected fetchCountryData(): void {
    this.allCountries = [];

    this.countryCodeData.allCountries.forEach((c) => {
      const country: Country = {
        name: c[0].toString(),
        iso2: c[1].toString(),
        dialCode: c[2].toString(),
        priority: +c[3] || 0,
        areaCodes: (c[4] as string[]) || undefined,
        htmlId: `iti-0__item-${c[1].toString()}`,
        flagClass: `iti__${c[1].toString().toLocaleLowerCase()}`,
        placeHolder: '',
      };

      if (this.enablePlaceholder()) {
        country.placeHolder = this.getPhoneNumberPlaceHolder(
          country.iso2.toUpperCase(),
        );
      }

      this.allCountries.push(country);
    });
  }

  /**
   * Populates preferredCountriesInDropDown with prefferred countries.
   */
  private updatePreferredCountries() {
    this.preferredCountriesInDropDown = this.preferredCountries()
      .map((iso2) => this.allCountries.find((country) => country.iso2 === iso2))
      .filter((country): country is Country => country !== undefined);
  }

  /**
   * Updates selectedCountry.
   */
  private updateSelectedCountry() {
    const selectedISO = this.selectedCountryISO();
    if (!selectedISO) {
      return;
    }

    const selectedCountry = this.allCountries.find(
      (country) => country.iso2.toLowerCase() === selectedISO.toLowerCase(),
    );
    if (selectedCountry) {
      this.selectedCountry = selectedCountry;
      this.checkSeparateDialCodeStyle();
      this.rawValue.set(this.rawValue());
    }
  }
}
