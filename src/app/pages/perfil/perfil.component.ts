import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController, ModalController, ToastController } from '@ionic/angular';
import { Cliente } from 'src/app/models';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { FirestoreService } from '../../services/firestore.service';
import { FirestorageService } from '../../services/firestorage.service';
import { Subscription } from 'rxjs';
import { InteractionService } from 'src/app/services/interaction.service';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {


  cliente: Cliente = {
    uid: '',
    nombres: '',
    apellidos: '',
    direccion: '',
    celular: '',
    correo: '',
    contrasena: '',
    foto: ''
  };

  newFile: any;

  uid = '';

  suscriberUserInfo: Subscription;

  ingresarEnable = true;


  constructor(public menucontroler: MenuController,
              public firebaseauthService: FirebaseauthService,
              public firestoreService: FirestoreService,
              public firestorageService: FirestorageService,
              public loadingController: LoadingController,
              public toastController: ToastController,
              private interaccion: InteractionService,
              public modalController: ModalController) {

        this.firebaseauthService.stateAuth().subscribe( res => {
                console.log(res);
                if (res !== null) {
                   this.uid = res.uid;
                   this.getUserInfo(this.uid);
                } else {
                    this.initCliente();
                }
        });

  }

  async ngOnInit() {
       const uid = await this.firebaseauthService.getUid();
       console.log(uid);
  }

  initCliente() {
      this.uid = '';
      this.cliente = {
        uid: '',
        nombres: '',
        apellidos: '',
        direccion: '',
        celular: '',
        correo: '',
        contrasena: '',
        foto: ''
      };
      console.log(this.cliente);
  }

  openMenu() {
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }

  async newImageUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
        this.newFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = ((image) => {
            this.cliente.foto = image.target.result as string;
        });
        reader.readAsDataURL(event.target.files[0]);
      }
   }

  async registrarse() {
      const credenciales = {
          email: this.cliente.correo,
          password: this.cliente.contrasena,
      };

      const res = await this.firebaseauthService.registrar(credenciales.email, credenciales.password).catch( err => {
          console.log( 'error -> ',  err);
          this.interaccion.presentToastERROR('Datos invalidos, por favor vuelva a ingresar.');
          this.interaccion.loading.dismiss();
      });

      const uid = await this.firebaseauthService.getUid();
      this.cliente.uid = uid;
      this.crearUser();

   }

   async guardarUser() {
      const path = 'Clientes';
      const name = this.cliente.nombres;

      this.firestoreService.createDoc(this.cliente, path, this.cliente.uid).then( res => {
          console.log('guardado con exito');
          this.interaccion.presentToast('Actuaizado con exito!');

      }).catch( error => {
        this.interaccion.presentToastERROR('Error: No se pudo guardar.');
      });
    }

    async crearUser() {
      const path = 'Clientes';
      const name = this.cliente.nombres;
      this.firestoreService.createDoc(this.cliente, path, this.cliente.uid).then( res => {
          console.log('guardado con exito');
          this.interaccion.presentToast('Creado con exito!')
      }).catch( error => {
        this.interaccion.presentToastERROR('Error: No se pudo guardar.')
      });
    }

   async salir() {
      this.firebaseauthService.logout();
      this.suscriberUserInfo.unsubscribe();
   }

   getUserInfo(uid: string) {
       console.log('getUserInfo');
       const path = 'Clientes';
       this.suscriberUserInfo = this.firestoreService.getDoc<Cliente>(path, uid).subscribe( res => {
              if (res !== undefined) {
                this.cliente = res;
              }
       });
   }

   ingresar() {
      const credenciales = {
        email: this.cliente.correo,
        password: this.cliente.contrasena,
      };
      this.firebaseauthService.login(credenciales.email, credenciales.password).then( res => {
          this.interaccion.presentToast('ingreso con exito');
      }).catch(error=>{
        this.interaccion.presentToastERROR('Usuario o contrasena invalidos.')
      });
   }

    async openModal() {
    console.log('this.cliente', this.cliente);
    const modal = await this.modalController.create({
      component: ResetPasswordComponent,
      componentProps: {cliente: this.cliente}
    });
    return await modal.present();
  }



}
