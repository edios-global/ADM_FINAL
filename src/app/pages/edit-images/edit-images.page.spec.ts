import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditImagesPage } from './edit-images.page';

describe('EditImagesPage', () => {
  let component: EditImagesPage;
  let fixture: ComponentFixture<EditImagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditImagesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditImagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
