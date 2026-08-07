import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearTicketPage } from './crear-ticket.page';

describe('CrearTicketPage', () => {
  let component: CrearTicketPage;
  let fixture: ComponentFixture<CrearTicketPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
