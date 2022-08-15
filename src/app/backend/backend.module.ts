import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetProductosComponent } from './set-productos/set-productos.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    SetProductosComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class BackendModule { }
