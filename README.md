# International Telephone Input for Angular (NgxIntlTelInput)

Forked from https://github.com/webcat12345/ngx-intl-tel-input

[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors)

[![npm version](https://badge.fury.io/js/ngx-intl-tel-input.svg)](https://www.npmjs.com/package/ngx-intl-tel-input) [![npm](https://img.shields.io/npm/dm/localeval.svg)](https://www.npmjs.com/package/ngx-intl-tel-input)

An Angular package for entering and validating international telephone numbers. It adds a flag dropdown to any input, detects the user's country, displays a relevant placeholder and provides formatting/validation methods.

![alt](readme-assets/ngx-intl-tel-input.jpg)

**Compatibility:**

Validation with [google-libphonenumber](https://github.com/ruimarinho/google-libphonenumber)

| ngx-intl-tel-input-gg | Angular |
| --------------------- | ------- |
| 2.x.x                 | >=21.x  |
| 3.x.x                 | >=22.x  |

## Installation

### Install Dependencies

`$ pnpm add intl-tel-input@^27.1.3`

`$ pnpm add google-libphonenumber`

The library includes the dropdown styles it needs. Bootstrap is not required.

### Add Dependency Style

Add _'intl-tel-input'_ style file:

`intl-tel-input/dist/css/intlTelInput.css`

to **angular.json** styles array:

```json

"styles": [
  "intl-tel-input/dist/css/intlTelInput.css",
  "src/styles.css"
],

```

### Install This Library

`$ pnpm add ngx-intl-tel-input-gg`

## Usage

### Import

Import the standalone component and Signal Forms directive:

```typescript
imports: [FormField, NgxIntlTelInputComponent];
```

## Example

Refer to the main app in this repository for a working Angular 22 example.

```html
<form novalidate>
  <ngx-intl-tel-input [cssClass]="'custom'" [preferredCountries]="[CountryISO.UnitedStates, CountryISO.UnitedKingdom]" [enableAutoCountrySelect]="false" [enablePlaceholder]="true" [searchCountryFlag]="true" [searchCountryField]="[SearchCountryField.Iso2, SearchCountryField.Name]" [selectFirstCountry]="false" [selectedCountryISO]="CountryISO.India" [inputId]="'my-input-id'" [formField]="phoneForm.phone"></ngx-intl-tel-input>
</form>
```

Create `phoneForm` with a signal model and apply `required()` and
`phoneNumberValidator()` in its schema. The component stores
`ChangeData | null`; an empty field is `null`.

## Options

| Options                  | Type                     | Default                           | Description                                                                                                   |
| ------------------------ | ------------------------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| cssClass                 | `string`                 | `control-form`                    | Input CSS class or your own custom one.                                                                       |
| preferredCountries       | `<CountryISO>[]`         | `[]`                              | List of countries, which will appear at the top.                                                              |
| onlyCountries            | `<CountryISO>[]`         | `[]`                              | List of manually selected countries, which will appear in the dropdown.                                       |
| enableAutoCountrySelect  | `boolean`                | `true`                            | Toggle automatic country (flag) selection based on user input.                                                |
| enablePlaceholder        | `boolean`                | `true`                            | Input placeholder text, which adapts to the country selected.                                                 |
| customPlaceholder        | `string`                 | `None`                            | Custom string to be inserted as a placeholder.                                                                |
| numberFormat             | `<PhoneNumberFormat>`    | `PhoneNumberFormat.International` | Custom string to be inserted as a placeholder.                                                                |
| searchCountryFlag        | `boolean`                | `false`                           | Enables input search box for countries in the flag dropdown.                                                  |
| searchCountryField       | `<SearchCountryField>[]` | `[SearchCountryField.All]`        | Customize which fields to search in, if `searchCountryFlag` is enabled. Use `SearchCountryField` helper enum. |
| searchCountryPlaceholder | `string`                 | `'Search Country'`                | Placeholder value for `searchCountryField`                                                                    |
| maxLength                | `number`                 | `None`                            | Maximum input length. With Signal Forms, prefer the schema constraint.                                        |
| selectFirstCountry       | `boolean`                | `true`                            | Selects first country from `preferredCountries` if is set. If not then uses main list.                        |
| inputId                  | `string`                 | `phone`                           | Unique ID for `<input>` element.                                                                              |
| selectedCountryISO       | `<CountryISO>`           | `None`                            | Set specific country on load.                                                                                 |
| separateDialCode         | `boolean`                | `false`                           | Visually separate dialcode into the drop down element.                                                        |
| countryChange            | `OutputRef<Country>`     | `None`                            | Emits the selected country.                                                                                   |

## Supported Formats

Following formats are supported

- NATIONAL // Produces "044 668 18 00"
- INTERNATIONAL // Produces "+41 44 668 18 00"
- E164 // Produces "+41446681800"

## Library Contributions

- Fork repo.
- Update `./projects/ngx-intl-tel-input`
- Build / test library.
- Update `./src/app` with new functionality.
- Update README.md
- Pull request.

### Helpful commands

- Build lib: `$ pnpm run build_lib`
- Copy license and readme files: `$ pnpm run copy-files`
- Create package: `$ pnpm run pack`
- Build lib and create package: `$ pnpm run package`

### Local development and debugging

- Install dependencies once: `$ pnpm install`
- Start the demo app: `$ pnpm start`
- Edit the library source under `projects/ngx-intl-tel-input/src/lib`
- The demo app imports the library directly from the workspace sources, so changes in the library are picked up by `ng serve` without packing or publishing first.
- Library unit tests: `$ pnpm test`
- One-off CI-style test run: `$ pnpm exec ng test ngx-intl-tel-input --no-watch --no-progress`
- Build only the library package: `$ pnpm run build_lib`
- Build only the demo app: `$ pnpm run build`
- For browser debugging, open the demo app in Chrome or Edge devtools. The development build keeps source maps enabled, so breakpoints map back to the TypeScript files in the library.

### Use locally

After building and creating package, you can use it locally too.

In your project run:

`$ pnpm add {{path to your local '*.tgz' package file}}`

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/all-contributors/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/webcat12345"><img src="https://avatars3.githubusercontent.com/u/19761422?v=4?s=100" width="100px;" alt=""/><br /><sub><b>webcat_black</b></sub></a><br /><a href="#design-webcat12345" title="Design">🎨</a> <a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=webcat12345" title="Code">💻</a> <a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=webcat12345" title="Documentation">📖</a> <a href="#ideas-webcat12345" title="Ideas, Planning, & Feedback">🤔</a> <a href="#question-webcat12345" title="Answering Questions">💬</a> <a href="#infra-webcat12345" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#example-webcat12345" title="Examples">💡</a> <a href="#maintenance-webcat12345" title="Maintenance">🚧</a> <a href="https://github.com/webcat12345/ngx-intl-tel-input/pulls?q=is%3Apr+reviewed-by%3Awebcat12345" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=webcat12345" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://pasevin.com"><img src="https://avatars2.githubusercontent.com/u/1058469?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Aleksandr Pasevin</b></sub></a><br /><a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=pasevin" title="Code">💻</a> <a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=pasevin" title="Documentation">📖</a> <a href="https://github.com/webcat12345/ngx-intl-tel-input/issues?q=author%3Apasevin" title="Bug reports">🐛</a> <a href="#platform-pasevin" title="Packaging/porting to new platform">📦</a> <a href="#plugin-pasevin" title="Plugin/utility libraries">🔌</a> <a href="#question-pasevin" title="Answering Questions">💬</a> <a href="#infra-pasevin" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#example-pasevin" title="Examples">💡</a> <a href="#maintenance-pasevin" title="Maintenance">🚧</a> <a href="https://github.com/webcat12345/ngx-intl-tel-input/pulls?q=is%3Apr+reviewed-by%3Apasevin" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=pasevin" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/Dviejopomata"><img src="https://avatars0.githubusercontent.com/u/6862893?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dviejo</b></sub></a><br /><a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=Dviejopomata" title="Code">💻</a> <a href="https://github.com/webcat12345/ngx-intl-tel-input/issues?q=author%3ADviejopomata" title="Bug reports">🐛</a> <a href="#example-Dviejopomata" title="Examples">💡</a> <a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=Dviejopomata" title="Tests">⚠️</a> <a href="#question-Dviejopomata" title="Answering Questions">💬</a> <a href="#maintenance-Dviejopomata" title="Maintenance">🚧</a> <a href="https://github.com/webcat12345/ngx-intl-tel-input/pulls?q=is%3Apr+reviewed-by%3ADviejopomata" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://www.fosforito.net"><img src="https://avatars3.githubusercontent.com/u/5000255?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jens Wagner</b></sub></a><br /><a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=Fosforito" title="Code">💻</a></td>
    <td align="center"><a href="http://kino.codes"><img src="https://avatars3.githubusercontent.com/u/22554212?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kino Roy</b></sub></a><br /><a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=kinoroy" title="Code">💻</a></td>
    <td align="center"><a href="https://twitter.com/wwwalkerrun"><img src="https://avatars2.githubusercontent.com/u/457187?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nathan Walker</b></sub></a><br /><a href="#maintenance-NathanWalker" title="Maintenance">🚧</a> <a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=NathanWalker" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/jiarongxu"><img src="https://avatars0.githubusercontent.com/u/502605?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jiarong Xu</b></sub></a><br /><a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=jiarongxu" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://crutchcorn.dev"><img src="https://avatars.githubusercontent.com/u/9100169?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Corbin Crutchley</b></sub></a><br /><a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=crutchcorn" title="Code">💻</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/nayeli-beckham-martínez/"><img src="https://avatars.githubusercontent.com/u/78670199?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nayeli Beckham</b></sub></a><br /><a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=NayeBeckham" title="Code">💻</a> <a href="#platform-NayeBeckham" title="Packaging/porting to new platform">📦</a> <a href="#question-NayeBeckham" title="Answering Questions">💬</a> <a href="#maintenance-NayeBeckham" title="Maintenance">🚧</a></td>
    <td align="center"><a href="http://rushvora.com"><img src="https://avatars.githubusercontent.com/u/602333?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Rushabh Vora</b></sub></a><br /><a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=rushvora" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/KarimTayie"><img src="https://avatars.githubusercontent.com/u/29521303?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Karim Tayie</b></sub></a><br /><a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=KarimTayie" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/imadilkhalil"><img src="https://avatars.githubusercontent.com/u/19613930?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Adil Khalil</b></sub></a><br /><a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=imadilkhalil" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/ambersz"><img src="https://avatars.githubusercontent.com/u/647791?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alice Zhao</b></sub></a><br /><a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=ambersz" title="Code">💻</a></td>
    <td align="center"><a href="https://www.felipecespedes.co"><img src="https://avatars.githubusercontent.com/u/11846311?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Felipe Céspedes</b></sub></a><br /><a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=felipecespedes" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/bb-sonam"><img src="https://avatars.githubusercontent.com/u/60337996?v=4?s=100" width="100px;" alt=""/><br /><sub><b>bb-sonam</b></sub></a><br /><a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=bb-sonam" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/alQlagin"><img src="https://avatars.githubusercontent.com/u/3256488?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alex Kulagin</b></sub></a><br /><a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=alQlagin" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/subodhyadav712"><img src="https://avatars.githubusercontent.com/u/36027830?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Subodh Kumar Yadav</b></sub></a><br /><a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=subodhyadav712" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/harshalganbote"><img src="https://avatars.githubusercontent.com/u/60728890?v=4?s=100" width="100px;" alt=""/><br /><sub><b>harshalganbote</b></sub></a><br /><a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=harshalganbote" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/christianopaets"><img src="https://avatars.githubusercontent.com/u/43338174?v=4?s=100" width="100px;" alt=""/><br /><sub><b>christianopaets</b></sub></a><br /><a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=christianopaets" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/velechva"><img src="https://avatars.githubusercontent.com/u/13340931?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Victor Velechovsky</b></sub></a><br /><a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=velechva" title="Code">💻</a></td>
    <td align="center"><a href="https://www.mapianist.com"><img src="https://avatars.githubusercontent.com/u/7777929?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Heo</b></sub></a><br /><a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=leo6104" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://wagner.pink"><img src="https://avatars.githubusercontent.com/u/5000255?v=4?s=100" width="100px;" alt=""/><br /><sub><b>jlw</b></sub></a><br /><a href="https://github.com/webcat12345/ngx-intl-tel-input/commits?author=jenslw" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
