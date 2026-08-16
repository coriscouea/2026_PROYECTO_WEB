import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OlvidoPasswordPage } from './olvido-password.page';

describe('OlvidoPasswordPage', () => {
  let component: OlvidoPasswordPage;
  let fixture: ComponentFixture<OlvidoPasswordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OlvidoPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
