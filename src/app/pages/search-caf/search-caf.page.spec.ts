import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchCafPage } from './search-caf.page';

describe('SearchCafePage', () => {
  let component: SearchCafPage;
  let fixture: ComponentFixture<SearchCafPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCafPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchCafPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
