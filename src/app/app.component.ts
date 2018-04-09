import { TokenService } from './../providers/token-service';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { JPush } from 'ionic3-jpush';
import { SplashScreen } from '@ionic-native/splash-screen';
declare let baidumap_location: any;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'HomePage';
 
  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    public jpush: JPush,
    public tokenCtrl: TokenService,
  ) {
   
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.jpush.init();
      console.error(JSON.stringify(this.jpush.getRegistrationID()))
      // this.jpush.getRegistrationID().then(regid => {
      //   alert(regid)
      // })
      // tokenCtrl.localDataArray = JSON.stringify([{name: '从化市',isSelected: false}])
      if(platform.is("android")){
        this.baidulocation(this);
      }
      // alert()
      if(!tokenCtrl.isShowWhiteDay){
        this.tokenCtrl.isShowWhiteDay = false;
      }
    });
  }
  baidulocation(that){   
    baidumap_location.getCurrentPosition(function (result) {
      // alert(JSON.stringify(result));
        if(result.locType == 161){
          // alert(result.city)
          that.tokenCtrl.localData = result.city;
        }
    }, function (error) {
      alert(JSON.stringify(error))
  });
}
}
