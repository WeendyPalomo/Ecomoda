import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Cliente } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  
  email: string;

  constructor( 
    private afauth: AngularFireAuth,
    private toastr: ToastController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private modalController: ModalController,
    public firebaseauthService: FirebaseauthService,
    public firestoreService: FirestoreService,
    ) 
    {   }

  clientes : Cliente[]=[];


  closeModal() {
    this.modalController.dismiss();
  }

  ngOnInit() {
  this.getClientes();  
  }

  getClientes(){
    const path='Clientes';
    this.firestoreService.getCollection<Cliente>(path).subscribe(res=>{
      this.clientes = res;
    })
    console.log(this.clientes);
  }

  async onReset(){

    const loading = await this.loadingCtrl.create({
      message:'Porfavor espera..',
      spinner:'crescent',
      showBackdrop: true        
    });

    this.firebaseauthService.resetPassword('wendy-gissel@hotmail.com').then( res => {
        console.log('ingreso con exito');
        loading.dismiss();
        this.toast('Por favor revisa tu correo','success');
        this.router.navigate(['/perfil']);
    }).catch(error=>{
      console.log('Usuario o contrasena invalidos.',error)
    });


    console.log('restablecer');
  }

  // async resetPassword(){
  //   if(this.email){
  //     const loading = await this.loadingCtrl.create({
  //       message:'Porfavor espera..',
  //       spinner:'crescent',
  //       showBackdrop: true        
  //     });
  //     loading.dismiss();

  //     this.afauth.sendPasswordResetEmail(this.email).then(()=>{
  //       loading.dismiss();
  //       this.toast('porfavor revisa tu correo','success');
  //       this.router.navigate(['/perfil']);
  //     })
  //     .catch((error)=> {
  //       loading.dismiss();
  //       this.toast(error.message,'danger');
  //     })
  //   }else{
  //     this.toast('Porfavor ingrese su correo.','danger');
  //   }
  // }
  

  async toast(message, status){
    const toast = await this.toastr.create({
      message: message,
      position: 'top',
      color: status,
      mode:'ios',
      duration:2000
    });
    toast.present();
  }

}
