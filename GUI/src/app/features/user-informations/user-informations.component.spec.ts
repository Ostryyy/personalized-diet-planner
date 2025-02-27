import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInformationsComponent } from './user-informations.component';

describe('UserGoalComponent', () => {
  let component: UserInformationsComponent;
  let fixture: ComponentFixture<UserInformationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInformationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
