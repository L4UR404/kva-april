import { Component, computed, signal } from '@angular/core';
import { DataService } from '../services/data.service';
import { ToyModel } from '../../models/toy.model';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToyService } from '../services/toy.service';
import { Loading } from "../loading/loading";
import { MatCard, MatCardContent } from "@angular/material/card";
import { Utils } from '../utils';
import { MatListItem, MatList } from "@angular/material/list";
import { MatIcon } from "@angular/material/icon";
import { MatFormField, MatLabel } from "@angular/material/input";
import { MatSelect, MatOption } from "@angular/material/select";
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { OrderModel } from '../../models/order.model';
import { AuthService } from '../services/auth.service';
import { MatAnchor } from "@angular/material/button";
import { Alerts } from '../alerts';


@Component({
  selector: 'app-order',
  imports: [
    Loading,
    MatCard,
    MatCardContent,
    MatListItem,
    MatIcon,
    MatList,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatSelectModule,
    FormsModule,
    MatAnchor
],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export class Order {
  toy = signal<ToyModel | null>(null)
  pakovanje: { id: number; name: string; price: number }[] = DataService.getZapakovano()
  odabranoPakovannje=signal< number>  ( this.pakovanje[1].id)
  count =signal<number>(1) 
  total = signal<number>(0)
   order: Partial<OrderModel> ={
        
        pakovanjeId:this.pakovanje[1].id,
        count: this.count()
    
      }

  totalPrice= computed(()=>{
    const basePrice = this.toy()!.price 
    const bagPrice = this.pakovanje.find(x => x.id === this.odabranoPakovannje())!.price 
    
    return basePrice * this.count() + bagPrice 
  })

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public utils: Utils)
     {
       if (!AuthService.getActiveUser()){
      this.router.navigate(['/login'])
      return
    }
    route.params.subscribe(params =>{
      const id =params['id'] 
      ToyService.getToyById(id)
      .then(rsp =>
         this.toy.set(rsp.data))
         this.updateTotal()
      
    })
      
    
  }

  onPreferenceChangePakovanje(newPref: number){
    this.odabranoPakovannje.set(newPref)
  this.updateTotal()

  }
  updateTotal(){
    const toy = this.toy()
    if (!toy) return

    const cenaPakovanje = this.pakovanje.find(x => x.id === this.odabranoPakovannje())!.price
    const totalValue = toy.price * this.count() + cenaPakovanje
    this.total.set(totalValue)

  }

  placeOrder(){
    // Kreiramo finalni objekat pre slanja
  const finalOrder: Partial<OrderModel> = {
    pakovanjeId: this.odabranoPakovannje(), 
    count: this.count(),                    
    state: 'w'
    
    };

  Alerts.confirm(`Da li ste sigurni da želite poručiti nešto u iznosu od ${this.totalPrice()} rsd?`, () => {
    AuthService.createOrder(finalOrder, this.toy()!)
    this.router.navigate(['/cart'])
  })
  }
  
}
