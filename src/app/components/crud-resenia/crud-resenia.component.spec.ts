import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudReseniaComponent } from './crud-resenia.component';

describe('CrudReseniaComponent', () => {
  let component: CrudReseniaComponent;
  let fixture: ComponentFixture<CrudReseniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudReseniaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudReseniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
