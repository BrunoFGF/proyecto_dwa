import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaLibrosComponent } from './lista-libros.component';

describe('ListaLibrosComponent', () => {
  let component: ListaLibrosComponent;
  let fixture: ComponentFixture<ListaLibrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaLibrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaLibrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
