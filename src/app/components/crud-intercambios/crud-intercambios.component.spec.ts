import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudIntercambiosComponent } from './crud-intercambios.component';

describe('CrudIntercambiosComponent', () => {
  let component: CrudIntercambiosComponent;
  let fixture: ComponentFixture<CrudIntercambiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudIntercambiosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudIntercambiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
