import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import { MatAnchor } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Alerts } from '../alerts';
@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatInputModule,
    MatIcon,
    FormsModule
],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string=''
  password: string=''

  constructor(private router: Router){
    if (AuthService.getActiveUser()){
      router.navigate(['/'])
    }
  }
  doLogin(){
    if(AuthService.login(this.email, this.password)){
      this.router.navigate(['/'])
      return
    }
    Alerts.error('invalid username or password')
    
  }
}
