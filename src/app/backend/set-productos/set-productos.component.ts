import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Categoria, Producto } from 'src/app/models';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-set-productos',
  templateUrl: './set-productos.component.html',
  styleUrls: ['./set-productos.component.scss'],
})
export class SetProductosComponent implements OnInit {


  productos: Producto[]=[];

  newProducto: Producto;

  enableNewProducto = false;

  private path = 'Productos/';
  categorias: Categoria[] = [];

  loading: any;

  newImage='';
  newFile='';

  getCategoria(){
    const path='Categorias';
    this.firestoreService.getCollection<Categoria>(path).subscribe(res=>{
      this.categorias = res;
    })
  }

  constructor(
    public menu: MenuController,
    public firestoreService: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    private firestorageService: FirestorageService
    ) { }

  ngOnInit() {
    this.getCategoria();
    this.getProductos();

  }

  openMenu(){
    this.menu.toggle('principal');
  }

  async guardarProducto(){

    this.presentLoading();
    const path = 'Productos';
    const name=this.newProducto.nombre;
    const res = await this.firestorageService.uploadImage(this.newFile,path,name);
    this.newProducto.foto = res;
    this.firestoreService.createDoc(this.newProducto,this.path, this.newProducto.id).then(res=>{
        this.loading.dismiss();
        this.presentToast('Guardado con exito!')
    }).catch(error=>{
      this.presentToastERROR('Error: No se pudo guardar.')
    });
    this.enableNewProducto=false;
  }

  getProductos(){
    this.firestoreService.getCollection<Producto>(this.path).subscribe( res=>{
        this.productos=res;
    });
  }

 async deleteProducto(producto: Producto){

    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: '¿Eliminar la publicacion?',
      message: 'Seguro desea <strong>eliminar</strong> este producto',
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
          text: 'Eliminar',
          id: 'confirm-button',
          handler: () => {
            console.log('Confirm Okay');
            this.firestoreService.deleteDoc(this.path, producto.id).then(res=>{
              this.presentToast('Eliminado con exito!');
              this.alertController.dismiss();
          }).catch(error=>{
            this.presentToastERROR('Error: No se pudo eliminar.')
          });
          }
        }
      ]
    });
    await alert.present();

  }

  nuevo(){
    this.enableNewProducto=true;
    this.newProducto={
      foto:'',
      nombre: '',
      precio: null ,
      descripcion: '' ,
      categoria: null,
      id:this.firestoreService.getId(),
      fecha: new Date()
    };
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'guardando...'
    });
    await this.loading.present();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'mensajeSuccess',
      color:'success',
      duration: 2000
    });
    toast.present();
  }

  async presentToastERROR(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'normal',
      color:'danger',
      duration: 2000
    });
    toast.present();
  }

  async newImageUpload(event: any){

    if(event.target.files && event.target.files[0]){
      this.newFile = event.target.files[0]; 
      const reader = new FileReader();
      reader.onload=((image)=>{
        this.newProducto.foto = image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }

  }





}
