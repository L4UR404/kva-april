import { Component, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToyModel } from '../../models/toy.model';
import { Utils } from '../utils';
import {MatIconModule} from '@angular/material/icon';
import { MatCardContent, MatCard, MatCardImage, MatCardActions } from "@angular/material/card";
import {MatListModule} from '@angular/material/list';
import { AuthService } from '../services/auth.service';
import { ToyService } from '../services/toy.service';
import { Loading } from "../loading/loading";
@Component({
  selector: 'app-details',
  imports: [
    MatIconModule,
    MatCardContent,
    MatCard,
    MatCardImage,
    MatListModule,
    MatCardActions,
    RouterLink,
    Loading
],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  public authServise = AuthService
  toy = signal <ToyModel | null>(null)
  constructor(route: ActivatedRoute,public utils: Utils){
    route.params.subscribe(params=>{
      const id =params['id'] 
      ToyService.getToyById(id)
      //axios.get(`https://toy.pequla.com/api/toy/${id}`)
    .then(rsp => this.toy.set(rsp.data))
    })
     
     
  }
}
      
  

