import { Component, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { ToyModel } from '../../models/toy.model';
import { ToyService } from '../services/toy.service';
import { Loading } from "../loading/loading";
import Swal from 'sweetalert2'
import { Alerts } from '../alerts';
import { Utils } from '../utils';
import { OrderModel } from '../../models/order.model';
import { MatList, MatListItem } from "@angular/material/list";

@Component({
  selector: 'app-user',
  imports: [
    MatCardModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatIcon,
    Loading,
    RouterLink,
    MatList,
    MatListItem
],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {
  public activeUser = AuthService.getActiveUser()
  preferenceGender = signal<string[]>([])
  recommended= signal<ToyModel[]>([])
  paidOrders = signal<OrderModel[]>([])
  oldPassword=''
  newPassword=''
  passRepeat=''
  
  
  constructor(private router: Router, ){
    if (!AuthService.getActiveUser()){
      router.navigate(['/login'])
      return
    }
    ToyService.getToys()
    //axios.get('https://toy.pequla.com/api/toy')
    .then(rsp=> {
      const genders = [...new Set(rsp.data.map((t: ToyModel) => t.targetGroup))];
      this.preferenceGender.set(genders);

    })
    ToyService.getToysToPreferenceGender(this.activeUser!.preferenceGender)
      .then(toys => this.recommended.set(toys))
    
    this.loadPaidOrders();
    }

    loadPaidOrders() {
    const paid = AuthService.getOrdersByState('p');
    this.paidOrders.set(paid);
    }
    
    updateUser(){
      Alerts.confirm('are you sure you want to update user info?', 
        ()=>{
        AuthService.updateActiveUser(this.activeUser!)
        Alerts.success('uspesno ste promenili podatke')
      })
      
    }
    updatePassword(){
      Alerts.confirm('are you sure you want to update your password?', ()=>{
        if(this.oldPassword != this.activeUser?.password){
        Alerts.error('invalid old password')
        return
      }
      if(this.newPassword != this.passRepeat){
        Alerts.error('Passwords don`t match')
        return
      }
      if(this.newPassword == this.oldPassword){
        Alerts.error('New Password can`t be the same as the old one')
        return
      }
      AuthService.updateActiveUserPassword(this.newPassword)
      Alerts.success('password update complete')
      AuthService.logout()
      this.router.navigate(['/login'])
    
      })

  }
  onPreferenceChange(newPrefs: string) {
    
    ToyService.getToysToPreferenceGender(newPrefs)
      .then(toys => this.recommended.set(toys));
  }

 
}
