import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UploadCafPage } from './upload-caf.page';

describe('UploadCafePage', () => {
  let component: UploadCafPage;
  let fixture: ComponentFixture<UploadCafPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadCafPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadCafPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
