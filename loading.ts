import { Component } from '@angular/core';
import { MatCard, MatCardContent } from "@angular/material/card";

@Component({
  selector: 'app-loading',
  imports: [MatCard, MatCardContent],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading {}
