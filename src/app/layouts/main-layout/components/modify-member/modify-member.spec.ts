import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyMember } from './modify-member';

describe('ModifyMember', () => {
  let component: ModifyMember;
  let fixture: ComponentFixture<ModifyMember>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyMember],
    }).compileComponents();

    fixture = TestBed.createComponent(ModifyMember);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
