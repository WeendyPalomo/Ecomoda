import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Producto } from '../../models';
import { FirestoreService } from '../../services/firestore.service';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss'],
})
export class ComentariosComponent implements OnInit, OnDestroy {

  @Input() producto: Producto;
  enableNoHayComent = false;
  uid = '';

  comentario = '';

  comentarios: Comentario[] = []; 

  suscriber: Subscription;
  suscriberUserInfo: Subscription;

  constructor(public modalController: ModalController,
              public firestoreService: FirestoreService,
              public firebaseauthService: FirebaseauthService,
              public interaccion: InteractionService) { 
                this.firebaseauthService.stateAuth().subscribe( res => {
                  // console.log(res);
                  if (res !== null) {
                        this.uid = res.uid;
                  }
            });
              }

  ngOnInit() {
      console.log('producto', this.producto);
      this.loadCommentarios();
  }

  ngOnDestroy(): void {
        console.log('ngOnDestroy() modal')
        if (this.suscriber) {
          return this.suscriber.unsubscribe();
        }
  }

  closeModal() {
      this.modalController.dismiss();
  }

  loadCommentarios() {
    // let startAt = null;
    // if(this.comentarios.length) {
    //     startAt = this.comentarios[ this.comentarios.length - 1].fecha;
    // }
    // const path = 'Productos/' +  this.producto.id + '/comentarios';
    // this.suscriber = this.firestoreService.getCollectionPaginada<Comentario>(path, 3, startAt).subscribe( res => {
    //      if (res.length) {
    //         res.forEach( comentario => {

    //             const exist = this.comentarios.find( commentExist => {
    //                    commentExist.id === comentario.id   
    //             });
    //             if (exist === undefined) {
    //               this.comentarios.push(comentario);
    //             }
    //         });
    //         //this.comentarios = res;
    //         console.log(res);
    //      }
    // } );


    const path = 'Productos/' +  this.producto.id + '/comentarios';
    this.firestoreService.getCollection<Comentario>(path).subscribe(res=>{
      if(res.length){
        this.comentarios=res;
        this.enableNoHayComent = false;

      }else{
        this.enableNoHayComent = true;
      }
    })


  }

  comentar() {
    const comentario = this.comentario;
    if (this.uid.length) {
     console.log('comentario ->' , comentario);
     const path = 'Productos/' +  this.producto.id + '/comentarios';
     const data: Comentario = {
         autor: this.firebaseauthService.datosCliente.nombres,
         comentario: comentario,
         fecha: new Date(),
         id: this.firestoreService.getId()
     }
     this.firestoreService.createDoc(data, path, data.id).then( () => {
         console.log('comentario enviado');
         this.comentario = '';
     });
   }else {
     this.interaccion.presentAlertComentarios();
     return;
   }
 }

}


interface Comentario {
  autor: string;
  comentario: string;
  fecha: any;
  id: string;
}