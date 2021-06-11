import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../app/shared/auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  constructor(private authService: AuthService,
    public router: Router,) { }

  ngOnInit() {
  }

  async SigninWithGoogle() {
    let serviceResponse = await this.authService.SigninWithGoogle();
    if (serviceResponse.success) {
      this.router.navigate(['dashboard']);
    }

    console.log(serviceResponse);
  }

 

}
