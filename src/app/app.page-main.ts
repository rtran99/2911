import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './ApiService';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './page-main.html'
})
export class PageMainComponent {
    // Hard-code credentials for convenience.
    message               = '';
    secureData:string     = '';
    managerData:string    = '';
    reqInfo:any           = null;
    msgFromServer:string  = '';
    _apiService:ApiService;

    bitcoin: number
    public site='http://localhost:1337/';

    // Since we are using a provider above we can receive 
    // an instance through an constructor.
    constructor(private http: HttpClient, private router: Router) {
        // Pass in http module and pointer to AppComponent.
        this._apiService = new ApiService(http, this);
        this.checkLoggedIn()
        this.getBitcoin()
    }

    checkLoggedIn() {
        if(sessionStorage.getItem('username') == null){
            this.router.navigate(['page-login'])
        }
    }

    getBitcoin() {
        let url = this.site + 'User/getBitcoin'
        this.http.post<any>(url, {
            email: sessionStorage.getItem("email")
        })
            .subscribe(
                (data) => {
                    this.bitcoin = data
                } )
    }

    increaseBitcoin() {
        this.bitcoin += 1
    }

    openShop() {
        this.saveProgress()
        this.router.navigate(['page-shop'])
    }

    saveProgress() {
        let url = this.site + 'User/saveProgress'
        this.http.post<any>(url, {
            email: sessionStorage.getItem("email"),
            bitcoin: this.bitcoin
        })
            .subscribe(
                (data) => {
                    this.message = data
                } )
    }

    // getAllEvents() {
    //     let url = this.site + 'Event/getEvents'
    //     this.http.get<any>(url)
    //         .subscribe(
    //             (data) => {
    //                 this.eventArray = JSON.parse(JSON.stringify(data))
    //             } )
    // }

    // attend(eventName) {
    //     if(sessionStorage.getItem("username") == null){
    //         this.router.navigate(['page-login'])
    //     } else {
    //         let url = this.site + 'Event/AddAttendee'
    //         this.http.post<any>(url, {
    //             eventName: eventName,
    //             eventAttendees: sessionStorage.getItem("firstName") + ' ' + sessionStorage.getItem("lastName")
    //         })
    //             .subscribe(
    //                 (data) => {
    //                     this.message = data
    //                 }
    //             )

    //     }
    // }


}