import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Global } from '../../global/global';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

declare var google;

@IonicPage()
@Component({
  selector: 'page-mapa-rede-credenciada',
  templateUrl: 'mapa-rede-credenciada.html',
})
export class MapaRedeCredenciadaPage {

	g: any;
	rc: object;
	load: any;
	@ViewChild('map') mapElement: ElementRef;
  	map: any;
	company: string;

  	constructor(public navCtrl: NavController, public navParams: NavParams,  public plt: Platform, public geolocation: Geolocation, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public http: Http, public translateService: TranslateService, private ga: GoogleAnalytics) {
  	  this.rc = navParams.get('rc');
	  this.g = new Global();
	  
	  this.translateService.get('CG_NOME_EMPRESA').subscribe((value) => {
		this.company = value;
	  })	
	  plt.ready().then(() => { 
		/*Google Analytics*/
		this.ga.startTrackerWithId(this.g.codeGA)
		.then(() => {
			this.ga.trackView(this.company + '/' + 'Rota para ' + this.rc['r_nome_fantasia']);
		})
		.catch(e => console.log('Erro ao iniciar Google Analytics', e));	  
      });
  	}
	ionViewDidLoad(){
		this.loading('Carregando...');
    	this.loadMap();
	}
 	loadMap(){
	 	this.geolocation.getCurrentPosition().then((position) => { 
		  let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		  let mapOptions = {
		    center: latLng,
		    zoom: 15,
		    mapTypeId: google.maps.MapTypeId.ROADMAP,
		    styles: [{'featureType':'administrative.neighborhood','elementType':'geometry.fill','stylers':[{'visibility':'on'},{'hue':'#ff0000'}]},{'featureType':'administrative.neighborhood','elementType':'labels.text.fill','stylers':[{'visibility':'on'}]},{'featureType':'administrative.neighborhood','elementType':'labels.text.stroke','stylers':[{'visibility':'on'}]},{'featureType':'landscape.man_made','elementType':'geometry','stylers':[{'color':'#f7f1df'}]},{'featureType':'landscape.natural','elementType':'geometry','stylers':[{'color':'#d0e3b4'}]},{'featureType':'landscape.natural.terrain','elementType':'geometry','stylers':[{'visibility':'on'}]},{'featureType':'poi','elementType':'labels','stylers':[{'visibility':'on'}]},{'featureType':'poi.business','elementType':'all','stylers':[{'visibility':'on'}]},{'featureType':'poi.medical','elementType':'geometry','stylers':[{'color':'#fbd3da'}]},{'featureType':'poi.park','elementType':'geometry','stylers':[{'color':'#bde6ab'}]},{'featureType':'road','elementType':'geometry.stroke','stylers':[{'visibility':'off'}]},{'featureType':'road','elementType':'labels','stylers':[{'visibility':'on'}]},{'featureType':'road.highway','elementType':'geometry.fill','stylers':[{'color':'#ffe15f'}]},{'featureType':'road.highway','elementType':'geometry.stroke','stylers':[{'color':'#efd151'}]},{'featureType':'road.arterial','elementType':'geometry.fill','stylers':[{'color':'#ffffff'}]},{'featureType':'road.local','elementType':'geometry.fill','stylers':[{'color':'black'}]},{'featureType':'transit.station.airport','elementType':'geometry.fill','stylers':[{'color':'#cfb2db'}]},{'featureType':'water','elementType':'geometry','stylers':[{'color':'#a2daf2'}]}]
		  }
		  this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
		  let directionsDisplay = new google.maps.DirectionsRenderer();
		  directionsDisplay.setMap(this.map);
		  let directionsService = new google.maps.DirectionsService();
		  let start = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		  let end = new google.maps.LatLng(this.rc['r_latitude'], this.rc['r_longitude']);
		  let request = {
		    origin: start,
		    destination: end,
		    travelMode: google.maps.TravelMode.DRIVING
		  };
		  directionsService.route(request, function(result, status) {
		    if (status == google.maps.DirectionsStatus.OK) {
		      directionsDisplay.setDirections(result);
		    } else {
		      this.toast('Erro ao carregar a rota, por favor tente novamente', '3500', 'top', 'error');
		    }
		  	
		  });
		  this.load.dismiss();
    	}).catch((error) => {
			console.log(error)
		});
	}
	//loading
  	loading(title){
    	this.load = this.loadingCtrl.create({
      		content: '<h5>'+title+'</h5>'
    	});
    	this.load.present();
  	}
	//toast
	toast(message, duration, position, cssClass){
	    let toast = this.toastCtrl.create({
	        message: message,
	        duration: duration,
	        position: position,
	        cssClass: cssClass,
	        dismissOnPageChange: true,
	        showCloseButton: true,
	        closeButtonText: 'Ok'
	    });
	    toast.present();
	}
}
