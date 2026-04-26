import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatCardModule } from "@angular/material/card";
import { DataService } from '../services/data.service';
import { MatIconModule } from '@angular/material/icon';
import {MatTable, MatTableModule} from '@angular/material/table';
import { OrderModel } from '../../models/order.model';
import { Utils } from '../utils';
import { MatAnchor } from "@angular/material/button";
import { ToyService } from '../services/toy.service';
import { Alerts } from '../alerts';

@Component({
  selector: 'app-cart',
  imports: [
    MatCardModule,
    MatTableModule,
    MatIconModule,
    RouterLink,
    MatAnchor,
    
],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  name= DataService.name
  ordersWithPrices: any[] = []; 
  totalSum: number = 0;
  isLoading = true;
  displayedColumns =['toyName','state','createdAt','getPakovanje','count','options','totalPrice','delete']

  constructor(
    public router: Router, 
    public utils: Utils,
    private cdr: ChangeDetectorRef
  ){
    if (!AuthService.getActiveUser()){
          this.router.navigate(['/login'])
          return
    }
    this.loadOrders();
  }

  async loadOrders() {
  const orders = AuthService.getOrdersOnWaiting();
  const processedOrders = [];
  let tempTotal = 0;

  for (let order of orders) {
    try {
      // 1. Dobijamo cenu igračke sa API-ja
      const toyPrice = await ToyService.getToyPrice(order.toyId);
      
      // 2. Dobijamo podatke o pakovanju iz DataService
      const pakovanje = DataService.getZapakovanoById(order.pakovanjeId);
      
      // 3. Računamo sumu za taj red
      const rowTotal = (toyPrice + (pakovanje?.price || 0)) * order.count;
      tempTotal += rowTotal;

      // 4. Pakujemo SVE podatke u jedan objekat koji ide u tabelu
      processedOrders.push({
        ...order,
        pakovanjeName: pakovanje ? pakovanje.name : 'Nije izabrano',
        totalPrice: rowTotal
      });
    } catch (e) {
      console.error("Greška kod reda:", order, e);
    }
  }

  // Bitno: Dodeli novu referencu niza da bi Angular "primetio" promenu
  this.ordersWithPrices = [...processedOrders];
  this.totalSum = tempTotal;
  this.cdr.detectChanges(); // Ovo će osigurati da se UI osveži
}

    pay() {
    Alerts.confirm(`Da li ste sigurni da želite da platite ukupno ${this.totalSum} RSD?`, () => {
    AuthService.payOrders();
    this.router.navigate(['/user'])
    // Osvežavamo prikaz - sada će ordersWithPrices biti prazan niz
    this.loadOrders(); 
    
    console.log("Uspešno ste poručili proizvode!");
      });
    }

    cancel(createdAt: string) {
    // Pozivamo servis da otkaže u LocalStorage-u
    AuthService.cancelOrder(createdAt);
  
    // Ponovo učitavamo narudžbine da bi tabela povukla sveže stanje (bez otkazane)
    this.loadOrders();
    }
    getOrders(){
     return  AuthService.getOrdersOnWaiting()
    }
    getOrdersJson(){
      return JSON.stringify(this.getOrders(), null, 2)
    }
    getPakovanje(order: OrderModel){
      return DataService.getZapakovanoById(order.pakovanjeId)
    }

    getOptions(order: OrderModel){
      return ToyService.getToyById(order.toyId)
    }

  }

