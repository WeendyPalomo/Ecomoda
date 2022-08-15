import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  
  slides = [
    {
      img:'../../../assets/img/home img1.jpg',
      titulo: 'Mira nuestras prendas con increibles precios, alcance de todos. ',
      descripcion:''
    },
    {      
      img: '../../../assets/img/home img3.jpg',
      titulo: 'Compra desde cualquier lugar.',
      descripcion:'Existe gran variedad para hombres, mujeres, ninos y accesorios'

    },
    {
      img:'../../../assets/img/contactanos.jpg',
      titulo: 'Comunicate con nosotros',
      descripcion:'LLamanos o escribenos al +593 997633026 \n Nuestro correo wendypalomo20@gmail.com Tu opinion es importante para nosotros.'

    },
    {
      img:'../../../assets/img/logo home.jpg',
      titulo: 'Quienes Somos',
      descripcion:'Somos una marca que busca una solucion autosustentable, que sea amigable con el medio ambiente y nuestro bolsillo. Es una idea que se origino en pandemia y ahora es una realidad.'
    }
  ];

  constructor(
    public menuController:MenuController,
    public firestoreService: FirestoreService
  ) { }

  ngOnInit() {}

  
  openMenu(){
    console.log('open menu');
    this.menuController.toggle('principal');
  }



}
