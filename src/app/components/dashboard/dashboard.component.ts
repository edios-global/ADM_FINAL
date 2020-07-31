import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/storage/localStorage';
import { PopoverController } from '@ionic/angular';
import { AppConstants } from 'src/app/utils/AppConstants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router,
    private localstorge: LocalStorageService,
    private popoverController: PopoverController) { }

  ngOnInit() { }

  Logout() {

    if (window.confirm("Are you sure you want to Sign Out? ")) {
      this.localstorge.clear(AppConstants.distributorKey);
      this.router.navigate(['/login']);
      this.popoverController.dismiss();

    }

  }
  Dashboard() {
    this.router.navigate(['/dashboard']);
    this.popoverController.dismiss();
  }

}
