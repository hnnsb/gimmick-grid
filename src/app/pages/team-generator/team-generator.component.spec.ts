import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamGeneratorComponent } from './team-generator.component';

describe('TeamGeneratorComponent', () => {
  let component: TeamGeneratorComponent;
  let fixture: ComponentFixture<TeamGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
