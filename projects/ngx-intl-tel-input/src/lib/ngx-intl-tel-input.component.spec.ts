import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form, FormField, required } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';

import { ChangeData } from './interfaces/change-data';
import { phoneNumberValidator } from './ngx-intl-tel-input.validator';
import { NgxIntlTelInputComponent } from './ngx-intl-tel-input.component';

@Component({
  selector: 'test-host',
  standalone: true,
  imports: [FormField, NgxIntlTelInputComponent],
  template: '<ngx-intl-tel-input [formField]="phoneForm.phone" />',
})
class TestHostComponent {
  phoneModel = signal<{ phone: ChangeData | null }>({ phone: null });
  phoneForm = form(this.phoneModel, (path) => {
    required(path.phone);
    phoneNumberValidator(path.phone);
  });
}

describe('NgxIntlTelInputComponent', () => {
  let component: NgxIntlTelInputComponent;
  let fixture: ComponentFixture<NgxIntlTelInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxIntlTelInputComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(NgxIntlTelInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should synchronize a signal form value from user input', async () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const input = hostFixture.nativeElement.querySelector('input[type="tel"]');
    input.value = '+14155552671';
    input.dispatchEvent(new Event('input'));
    await hostFixture.whenStable();

    expect(hostFixture.componentInstance.phoneModel().phone?.e164Number).toBe(
      '+14155552671',
    );
    expect(hostFixture.componentInstance.phoneForm().valid()).toBe(true);
  });

  it('should expose validation errors through the field tree', async () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const input = hostFixture.nativeElement.querySelector('input[type="tel"]');
    input.value = 'not a phone number';
    input.dispatchEvent(new Event('input'));
    await hostFixture.whenStable();

    expect(hostFixture.componentInstance.phoneForm().invalid()).toBe(true);
    expect(
      hostFixture.componentInstance.phoneForm
        .phone()
        .errors()
        .some((error: { kind?: string }) => error.kind === 'phoneNumber'),
    ).toBe(true);
  });

  it('should reset the signal form value', async () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const input = hostFixture.nativeElement.querySelector('input[type="tel"]');
    input.value = '+14155552671';
    input.dispatchEvent(new Event('input'));
    await hostFixture.whenStable();
    hostFixture.componentInstance.phoneForm.phone().reset();
    await hostFixture.whenStable();
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.phoneModel().phone).toBeNull();
    const control = hostFixture.debugElement.query(
      By.directive(NgxIntlTelInputComponent),
    ).componentInstance as NgxIntlTelInputComponent;
    expect(control.rawValue()).toBe('');
    await hostFixture.whenStable();
    hostFixture.detectChanges();
    expect(input.value).toBe('');
  });
});
