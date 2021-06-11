import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../app/shared/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userDetails: any;
  constructor(private authService: AuthService,) { }

  ngOnInit() {
    this.userDetails = JSON.parse(localStorage.getItem('currentUser'));
  }
  logout() {
    this.authService.SignOut();
  }



}
