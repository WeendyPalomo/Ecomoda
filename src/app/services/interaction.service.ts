import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  loading: any;

  constructor(public toastController: ToastController,
               public loadingController: LoadingController,
               private alertController: AlertController) { }

  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      color:'success',
      duration: 2000
    });
    toast.present();
  }

  async presentLoading(mensaje: string) {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: mensaje,
    });
    await this.loading.present();


  }

  //mensaje alerta CARRITO VACIO
  async presentAlertCV() {
    const alert = await this.alertController.create({
      header: 'Carrito Vacio',
      message: 'Añade items al carrito',
      buttons: ['OK'],
      mode:'ios'
    });

    await alert.present();
  }

  //inicia sesion para comentar
  async presentAlertComentarios() {
    const alert = await this.alertController.create({
      header: 'No puedes comentar',
      message: 'Inicia sesion primero, por favor.',
      buttons: ['OK'],
      mode:'ios'
    });

    await alert.present();
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

  async closeLoading() {
    await this.loading.dismiss();
  }

}