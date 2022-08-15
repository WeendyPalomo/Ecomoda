import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { FirebaseauthService } from './services/firebaseauth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  admin = false;

  constructor(
    private platform: Platform,
    private splashSccreen: SplashScreen,
    private statusBar: StatusBar,
    private firebaseauthService: FirebaseauthService
  ) {
    this.initializeApp();
  }

  initializeApp(){
    this.platform.ready().then(()=> {
      
      this.statusBar.styleDefault();
      this.splashSccreen.hide();
      this.getUid();

    });

  }

  getUid() {
    this.firebaseauthService.stateAuth().subscribe( res => {
          if (res !== null) {
              if (res.uid === 'xceubsuBJfYJNSwGSVpHogE8bwQ2')  {
                  this.admin = true;
              } else {
                 this.admin = false;
              }
          } else {
            this.admin = false;
          }
    });
  }

}
