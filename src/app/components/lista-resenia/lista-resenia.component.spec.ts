import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaReseniaComponent } from './lista-resenia.component';

describe('ListaReseniaComponent', () => {
  let component: ListaReseniaComponent;
  let fixture: ComponentFixture<ListaReseniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaReseniaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaReseniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
