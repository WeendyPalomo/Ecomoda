import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewProductoComponent } from './view-producto/view-producto.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ItemcarritoComponent } from './itemcarrito/itemcarrito.component';
import { FormsModule } from '@angular/forms';
import { ComentariosComponent } from './comentarios/comentarios.component';

import { registerLocaleData} from '@angular/common';
import localec from '@angular/common/locales/es-EC';

registerLocaleData(localec);


@NgModule({
  declarations: [
    ViewProductoComponent,
    ItemcarritoComponent,
    ComentariosComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule
  ], exports:[
    ViewProductoComponent,
    ItemcarritoComponent
  ], providers:[
    {
      provide: LOCALE_ID,
      useValue: 'es-EC'
    }
  ]
})
export class ComponentesModule { }
