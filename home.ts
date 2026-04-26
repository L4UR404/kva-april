import { Component, computed, signal } from '@angular/core';
import {ToyModel} from '../../models/toy.model';
import { RouterLink, RouterModule } from "@angular/router";
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Utils } from '../utils';
import {MatIconModule} from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { ToyService } from '../services/toy.service';
import { Loading } from "../loading/loading";
import { FormsModule } from '@angular/forms'; 
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
@Component({
  selector: 'app-home',
  imports: [
    RouterLink, RouterModule, MatCardModule,
     MatButtonModule, MatIconModule,Loading,
    FormsModule, MatInputModule, MatSelectModule,
    MatExpansionModule
],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home {
  public servise = AuthService
 toys = signal<ToyModel[]>([])


 // Filter signali
  searchQuery = signal<string>('');
  maxPrice = signal<number | null>(null);
  selectedAgeGroup = signal<string>('');
  selectedType = signal<string>('');
  selectedTargetGroup = signal<string>('');
  productionDate = signal<string>('');

  // Dinamičke liste za filtere (izvlače se iz podataka)
  ageGroups = computed(() => [...new Set(this.toys().map(t => t.ageGroup.name))]);
  toyTypes = computed(() => [...new Set(this.toys().map(t => t.type.name))]);

  // Master Filter Logika
  filteredToys = computed(() => {
    return this.toys().filter(t => {
      const q = this.searchQuery().toLowerCase();
      
      const matchesSearch = t.name.toLowerCase().includes(q) || 
                            t.description.toLowerCase().includes(q);
      
      const matchesPrice = this.maxPrice() ? t.price <= this.maxPrice()! : true;
      const matchesAge = this.selectedAgeGroup() ? t.ageGroup.name === this.selectedAgeGroup() : true;
      const matchesType = this.selectedType() ? t.type.name === this.selectedType() : true;
      
      
      const matchesTarget = this.selectedTargetGroup() ? t.targetGroup === this.selectedTargetGroup() : true;
      
      const matchesDate = this.productionDate() ? t.productionDate.startsWith(this.productionDate()) : true;

      return matchesSearch && matchesPrice && matchesAge && matchesType && matchesTarget && matchesDate;
    });
  });

  constructor(public utils: Utils){
    ToyService.getToys()
    
    .then(rsp=>this.toys.set(rsp.data))
  }

  resetFilters() {
    this.searchQuery.set('');
    this.maxPrice.set(null);
    this.selectedAgeGroup.set('');
    this.selectedType.set('');
    this.selectedTargetGroup.set('');
    this.productionDate.set('');
  }
}
