import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAutoresComponent } from './lista-autores.component';

describe('ListaAutoresComponent', () => {
  let component: ListaAutoresComponent;
  let fixture: ComponentFixture<ListaAutoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaAutoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaAutoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
