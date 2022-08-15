import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Categoria, Cliente, Producto } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';


@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
})
export class ProductoComponent implements OnInit {

  cliente: Cliente;
  clienteSuscriber: Subscription
  uid = '';
  private path='Productos/';

  categorias: Categoria[] = [];

  productos: Producto[] = [];
  productosBuscados: Producto[] = [];

  constructor(
    public menu: MenuController,
    public firestoreService: FirestoreService,
    private router: Router,
    public firebaseauthService: FirebaseauthService
  ) {
    this.loadProductos();
    this.firebaseauthService.stateAuth().subscribe( res => {
      // console.log(res);
      if (res !== null) {
            this.uid = res.uid;
            this.loadCliente();
      } 
      });

   }

  ngOnInit() {
    this.getCategoria();
    console.log('PRODUCTOS _________ ',this.productos);

  }

  openMenu(){
    this.menu.toggle('principal');
  }

  loadProductos(){
    this.firestoreService.getCollection<Producto>(this.path).subscribe(res=>{
      console.log(res);
      this.productos=res;
      this.productosBuscados=res;
    })
  }

  changeSegment(ev: any) {
    //  console.log('changeSegment()', ev.detail.value);
     const opc = ev.detail.value;
     if (opc === 'vender') {
      if(this.uid.length){
        this.router.navigate(['/set-productos'])
        console.log('redirigiendo a mis publicaciones');
      }else{
        console.log('inicie sesion sesion primero');
        this.router.navigate(['/perfil'])
      }
     }
     if (opc === 'categorias') {
        this.getCategoria();
        console.log('mostrar categoria -> ', this.categorias);
      }
  }

  loadCliente() {
    const path = 'Clientes';
    this.clienteSuscriber = this.firestoreService.getDoc<Cliente>(path, this.uid).subscribe( res => {
          this.cliente = res;
          // console.log('loadCLiente() ->', res);
          this.clienteSuscriber.unsubscribe();
    }); 
  }

  getCategoria(){
    const path='Categorías';
    this.firestoreService.getCollection<Categoria>(path).subscribe(res=>{
      this.categorias = res;
      //console.log('categorias entrando',this.categorias);
    })
  }


  buscarProducto(event: any){
    var nombre = event.detail.value;
    this.productosBuscados=this.productos;


    if(nombre && nombre.trim()!= ''){
      console.log('BUSCANDO _________ ',this.productosBuscados,nombre);
      this.productosBuscados = this.productosBuscados.filter(producto => {
        return producto.nombre.toLowerCase().indexOf(nombre.toLowerCase())>-1;
      })
    }
  }

  
   

}
