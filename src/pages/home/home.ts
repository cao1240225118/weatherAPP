import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { HttpService } from '../../providers/HttpService';
import { TokenService } from '../../providers/token-service';

/**
 api地址：https://www.juhe.cn/docs/api/id/39
 */
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  resultArray = []; //保存实时新闻的头三条数组
  imgurl = 'assets/images/taiyang.png';
  isShowWhiteDay:string;
  dataArray = [];//保存时间数组
  todayWeather: any = {
    weather: '',  //当天天气
    city: '从化市',     //当地城市
    temperature:'', //气温范围
    temp: '',   //当前温度
    future: []
  }
  futureday:any = {
    temperature:"",  //气温范围
    weather:'',
    data:"",//为了的日期
    icon:""  //图标
  }
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public http: HttpService,
    public tokenCtrl: TokenService,
  ) {
  }
  ionViewWillEnter(){
    this.isShowWhiteDay = this.tokenCtrl.isShowWhiteDay;
    if(this.tokenCtrl.isShowWhiteDay){
      this.isShowWhiteDay = this.tokenCtrl.isShowWhiteDay;
    }else{
      this.isShowWhiteDay = "false";
    }
    this.imgurl = this.isShowWhiteDay == "false" ? 'assets/images/taiyang.png' : 'assets/images/taiyang_black.png'
    console.log(typeof(this.isShowWhiteDay));
  }
  ionViewDidLoad() {
  
    // if(this.tokenCtrl.todayWeather){
    //   this.todayWeather = JSON.parse(this.tokenCtrl.todayWeather);
    // }else{
    //   this.tokenCtrl.todayWeather = JSON.stringify(this.todayWeather);
    // }
    this.getNews();
    this.getWeather();
   
  }
  //前往城市管理
  goCityMange(){
    let pages = this.modalCtrl.create("CityManagePage");
    pages.present();
    pages.onDidDismiss(data => {
      this.getWeather(undefined,data);
    })
  }
 //前往资讯页
  goInformation(){
    
    this.navCtrl.push("InformationPage");
  }
 
  // 下拉刷新？
  doRefresh(event){
    this.getWeather(event);
  }
  //更多按钮，是跳转到资讯列表
  moreInfo(){
    this.navCtrl.push("InformationPage");
  }
 
  getWeather(refresher?:any, currentCity?:any){
    
    // alert(this.location);
    let url = 'http://v.juhe.cn/weather/index';
		let param = {
			cityname: currentCity || this.todayWeather.city,
			key: '6c0260a599a7c9bba7bf30385193928e'
    }
    let that = this;
		this.http.ajaxHttp(url, param).then((res: any) => {
      console.log(JSON.stringify(res));
      that.todayWeather.weather = res.result.today.weather;
      that.todayWeather.city = res.result.today.city;
      that.todayWeather.temperature = res.result.today.temperature;
      that.todayWeather.temp = res.result.sk.temp;
      let obj = res.result.future;
      this.tokenCtrl.todayWeather = JSON.stringify(this.todayWeather);
      if(refresher){
        refresher.complete();
      }
      for(let item in obj){
        that.dataArray.push({
            data: item.substr(10,2),
            weather: obj[item].weather,
            temperature: obj[item].temperature,
            icon: this.getIcon(obj[item].weather)
         });
      }
      // console.log(this.dataArray);
      this.todayWeather.future = this.dataArray.slice(0,5);
		}).catch(err => {
			console.log(err);
		});
  }
  getIcon(weather){
    if(weather == '晴'){
      return "icon-qing";
    }else if(weather == '雨'){
      return "icon-yu";
    }else if(weather == '小雨'){
      return "icon-xiaoyu";
    }else if(weather == '小雨转中雨'){
      return "icon-xiaoyuzhuanzhongyu";
    }else if(weather == '中雨'){
      return "icon-zhongyu";
    }else if(weather == '中雨转大雨'){
      return "icon-zhongyuzhuandayu";
    }else if(weather == '大雨'){
      return "icon-dayu";
    }else if(weather == '大雨转暴雨'){
      return "icon-dayuzhuanbaoyu";
    }else if(weather == '暴雨'){
      return "icon-baoyu";
    }else if(weather == '暴雨转大暴雨'){
      return "icon-baoyuzhuandabaoyu";
    }else if(weather == '大暴雨转特大暴雨'){
      return "icon-dabaoyuzhuantedabaoyu";
    }else if(weather == '大暴雨'){
      return "icon-dabaoyu";
    }else if(weather == '阴'){
      return "icon-yin";
    }else if(weather == '多云'){
      return "icon-duoyun";
    }else if(weather == '雾'){
      return "icon-wu";
    }else if(weather == '多云'){
      return "icon-duoyun";
    }else if(weather == '雷阵雨'){
      return "icon-leizhenyu";
    }else if(weather == '雷阵雨转多云'){
      return "icon-dongyu";
    }else if(weather == '阵雨'){
      return "icon-zhenyu";
    }else{
      return 'icon-weizhitianqi'
    }
  }

  //获取实时新闻
  getNews(){
    let url = 'http://v.juhe.cn/toutiao/index';
		let param = {
			type: "top",
			key: '942d3f78c426cd99c23ee3043d99f898'
		}
		this.http.ajaxHttp(url, param).then((res: any) => {
      if(res.resultcode != 112){
        // console.log(JSON.stringify(res.result.data));
        for(let i=0; i<3; i++){
          this.resultArray.push( res.result.data[i]);
        }
      }
	
		}).catch(err => {
			console.log(err);
		})
  }

  //前往新闻的详情
  goDetail(item){
    this.navCtrl.push('InformationDetailPage', item);
  }

}
