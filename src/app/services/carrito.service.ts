import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Observable, Subject, Subscription } from 'rxjs';
import { Producto, Pedido, Cliente, ProductoPedido } from '../models';
import { FirebaseauthService } from './firebaseauth.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private pedido: Pedido;
  pedido$ = new Subject<Pedido>();
  path = 'carrito/';
  uid = '';
  cliente: Cliente;

  loading: any;
  carritoSuscriber: Subscription;
  clienteSuscriber: Subscription;

  constructor(public firebaseauthService: FirebaseauthService,
              public firestoreService: FirestoreService,
              public router: Router,
              public toastController: ToastController,
              public loadingController: LoadingController,
              private alertController: AlertController
              ) {

    //   console.log('CarritoService inicio');
      this.initCarrito();
      this.firebaseauthService.stateAuth().subscribe( res => {
            // console.log(res);
            if (res !== null) {
                  this.uid = res.uid;
                  this.loadCliente();
            }
      });
   }

  loadCarrito() {
      const path = 'Clientes/' + this.uid + '/' + 'carrito';
      if (this.carritoSuscriber) {
        this.carritoSuscriber.unsubscribe();
      }
      this.carritoSuscriber = this.firestoreService.getDoc<Pedido>(path, this.uid).subscribe( res => {
            //   console.log(res);
              if (res) {
                    this.pedido = res;
                    this.pedido$.next(this.pedido);
              } else {
                  this.initCarrito();
              }

      });
  }

  initCarrito() {
      this.pedido = {
          id: this.uid,
          cliente: this.cliente,
          productos: [],
          precioTotal: null,
          estado: 'enviado',
          fecha: new Date(),
          valoracion: null,
      };
      this.pedido$.next(this.pedido);
  }

  loadCliente() {
      const path = 'Clientes';
      this.clienteSuscriber = this.firestoreService.getDoc<Cliente>(path, this.uid).subscribe( res => {
            this.cliente = res;
            // console.log('loadCLiente() ->', res);
            this.loadCarrito();
            this.clienteSuscriber.unsubscribe();
      });
  }

  getCarrito(): Observable<Pedido> {
    setTimeout(() => {
        this.pedido$.next(this.pedido);
    }, 100);
    return this.pedido$.asObservable();
  }

  addProducto(producto: Producto) {
    
     console.log('addProducto ->', this.uid);
     if (this.uid.length) {
      this.presentLoading();

        const item = this.pedido.productos.find( productoPedido => {
            return (productoPedido.producto.id === producto.id)
        });
        if (item !== undefined) {
            item.cantidad ++;

        } else {
           const add: ProductoPedido = {
              cantidad: 1,
              producto,
           };
           this.pedido.productos.push(add);
        }
     } else {
          this.router.navigate(['/perfil']);
          return;
     }
     this.pedido$.next(this.pedido);
     console.log('en add pedido -> ', this.pedido);
     const path = 'Clientes/' + this.uid + '/' + this.path;

     this.firestoreService.createDoc(this.pedido, path, this.uid).then( res => {
          this.loading.dismiss();
          console.log('añdido con exito');
          this.presentToast('Añadido con exito!')

     }).catch(error=>{
      this.presentToastERROR('Error: No se pudo agregar.')
    });
    
  }

 async removeProducto(producto: Producto) {
    if (this.uid.length) {
        console.log('removeProducto ->', this.uid);

        const alert = await this.alertController.create({
            cssClass: 'normal',
            header: 'Quitar del carrito?',
            message: 'Desea <strong>quitar</strong> este producto del carrito',
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
                cssClass: 'normal',
                handler: (blah) => {
                  console.log('Confirm Cancel: blah');
                  //this.alertController.dismiss();
                }
              }, {
                text: 'Quitar',
                id: 'confirm-button',
                handler: () => {
                  
                        let position = 0;
                        const item = this.pedido.productos.find( (productoPedido, index) => {
                            position = index;
                            return (productoPedido.producto.id === producto.id)
                        });
                        if (item !== undefined) {
                            item.cantidad --;
                            if (item.cantidad === 0) {
                                 this.pedido.productos.splice(position, 1);
                            }
                            
                            console.log('en remove pedido -> ', this.pedido);
                            const path = 'Clientes/' + this.uid + '/' + this.path;
                            this.firestoreService.createDoc(this.pedido, path, this.uid).then( () => {
                                console.log('removido con exito');
                            });
            
                        }
                    
                }
              }
            ]
          });
          await alert.present();

        }
        
  }

  realizarPedido() {

  }

  clearCarrito() {
      const path = 'Clientes/' + this.uid + '/' + 'carrito';
      this.firestoreService.deleteDoc(path, this.uid).then( () => {
          this.initCarrito();
      });
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'mensajeSuccess',
      color:'success',
      mode:'ios',
      position:'bottom',
      duration: 2000
    });
    toast.present();
  }

  async presentToastERROR(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'normal',
      mode:'ios',
      color:'medium',
      duration: 2000
    });
    toast.present();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'añadiendo...'
    });
    await this.loading.present();
  }


}