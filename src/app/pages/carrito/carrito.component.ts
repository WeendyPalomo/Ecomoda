import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore.service';
import { Pedido } from '../../models';
import { CarritoService } from '../../services/carrito.service';
import { Subscription } from 'rxjs';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { Console } from 'console';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
})
export class CarritoComponent implements OnInit, OnDestroy {

  carritoVacio=false;
  pedidoss: any;
  msgWspp:any;

  pedido: Pedido;
  carritoSuscriber: Subscription;
  total: number;
  cantidad: number;

  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public carritoService: CarritoService,
              public firebaseauthService: FirebaseauthService,
              public interaccion: InteractionService) {

            this.initCarrito();
            this.loadPedido();
   }

  ngOnInit() {}

  ngOnDestroy() {
      console.log('ngOnDestroy() - carrito.componente.ts');
      if (this.carritoSuscriber) {
         this.carritoSuscriber.unsubscribe();
      }
  }


  openMenu() {
      console.log('open menu');
      this.menucontroler.toggle('principal');
  }

  loadPedido() {
      this.carritoSuscriber = this.carritoService.getCarrito().subscribe( res => {
          console.log('loadPedido() en carrito', res);
          this.pedido = res;
          this.getTotal();
          this.getCantidad()
      });
  }

  initCarrito() {
    this.pedido = {
        id: '',
        cliente: null,
        productos: [],
        precioTotal: null,
        estado: 'enviado',
        fecha: new Date(),
        valoracion: null,
    };
  }

  getTotal() {
      this.total = 0;
      this.pedido.productos.forEach( producto => {
           this.total = (producto.producto.precio) * producto.cantidad + this.total; 
      });
  }

  getCantidad() {
      this.cantidad = 0
      this.pedido.productos.forEach( producto => {
            this.cantidad =  producto.cantidad + this.cantidad; 
      });
  }

  async pedir() {
    if (!this.pedido.productos.length) {
      console.log('añade items al carrito');
      //this.interaccion.presentToastERROR('Añade items al carrito');
      this.interaccion.presentAlertCV();
      this.carritoVacio=true;
      return;
    }
    this.pedido.fecha = new Date();
    this.pedido.precioTotal = this.total;
    this.pedido.id = this.firestoreService.getId();
    const uid = await this.firebaseauthService.getUid()
    const path = 'Clientes/' + uid + '/pedidos/' 
    console.log(' pedir() -> ', this.pedido, uid, path);
    console.log(' pedir() -> ', this.pedido.precioTotal);

    this.firestoreService.createDoc(this.pedido, path, this.pedido.id).then( () => {
         console.log('guadado con exito');
         this.carritoService.clearCarrito();
         
    });
   this.openLink();
   
  }

  openLink(){
    // getDoc<tipo>(path: string, id: string){
    //   const collection = this.database.collection<tipo>(path);
    //   return collection.doc(id).valueChanges();
    // }
    console.log('ABRIENDO WSPP.....');
    this.pedido.productos.forEach(x => ( 
      this.pedidoss=(x.producto.nombre))); 
    console.log('OPEN LINK () ----> ',this.pedidoss);

    window.open(
      'https://wa.me/+593997633026?text=Hola%20vengo%20de%20*Ecomoda*%20y%20me%20interesan%20algunos%20productos%20como%20'+
      this.pedidoss+',%20etc.'+
      '%0D%0AMe%20salio%20un%20total%20de%20*'+this.pedido.precioTotal+'$*%20escoji%20'+this.cantidad+'%20prendas,%20me%20ayudas%20con%20la%20forma%20forma%20de%20pago *(:*','_system','location=yes');
  }

}