import { Component, Input, OnInit, LOCALE_ID } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Producto } from 'src/app/models';
import { CarritoService } from 'src/app/services/carrito.service';
import { ComentariosComponent } from '../comentarios/comentarios.component';
import { registerLocaleData} from '@angular/common';
import localec from '@angular/common/locales/es-EC';

registerLocaleData(localec);

@Component({
  selector: 'app-view-producto',
  templateUrl: './view-producto.component.html',
  styleUrls: ['./view-producto.component.scss'],
})


export class ViewProductoComponent implements OnInit {

  @Input() producto: Producto;

  constructor(public carritoService: CarritoService,
              public modalController: ModalController) {

  }

  ngOnInit() {
  }

  addCarrito() {
        console.log('addCarrito()');
        this.carritoService.addProducto(this.producto);
  }

  async openModal() {
    console.log('this.producto', this.producto)
    const modal = await this.modalController.create({
      component: ComentariosComponent,
      componentProps: {producto: this.producto}
    });
    return await modal.present();
  }

}
