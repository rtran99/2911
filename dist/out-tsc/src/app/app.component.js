import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { ApiService } from './ApiService';
let AppComponent = class AppComponent {
    // isadmin = false;
    // Since we are using a provider above we can receive 
    // an instance through an constructor.
    constructor(http) {
        this.http = http;
        // Hard-code credentials for convenience.
        this.password = '';
        this.username = '';
        this.token = '';
        this.message = 'Not logged in.';
        this.secureData = '';
        this.managerData = '';
        this.reqInfo = null;
        this.msgFromServer = '';
        this.site = 'http://localhost:1337/';
        // roles:Array<any> = [];
        this.loggedin = false;
        // Pass in http module and pointer to AppComponent.
        this._apiService = new ApiService(http, this);
        this.showContentIfLoggedIn();
    }
    updateLinks() {
        console.log(sessionStorage.getItem('email'));
        if (sessionStorage.getItem("username") == null) {
            this.loggedin = false;
        }
        else {
            this.loggedin = true;
            this.username = '(' + sessionStorage.getItem("username") + ')';
        }
    }
    //------------------------------------------------------------
    // Either shows content when logged in or clears contents.
    //------------------------------------------------------------
    showContentIfLoggedIn() {
        // Logged in if token exists in browser cache.
        if (sessionStorage.getItem('auth_token') != null) {
            this.token = sessionStorage.getItem('auth_token');
            this.message = "The user has been logged in.";
        }
        else {
            this.message = "Not logged in.";
            this.token = '';
        }
    }
    getSecureData() {
        this._apiService.getData('user/SecureAreaJwt', this.secureDataCallback);
    }
    // Callback needs a pointer '_this' to current instance.
    secureDataCallback(result, _this) {
        if (result.errorMessage == "") {
            _this.secureData = result.secureData;
        }
        else {
            alert(JSON.stringify(result.errorMessage));
        }
    }
    getManagerData() {
        this._apiService.getData('user/ManagerAreaJwt', this.managerDataCallback);
    }
    // Callback needs a pointer '_this' to current instance.
    managerDataCallback(result, _this) {
        if (result.errorMessage == "") {
            _this.reqInfo = result.reqInfo;
        }
        else {
            alert(JSON.stringify(result.errorMessage));
        }
    }
    postSecureMessage() {
        let dataObject = {
            msgFromClient: 'hi from client'
        };
        this._apiService.postData('user/PostAreaJwt', dataObject, this.securePostCallback);
    }
    // Callback needs a pointer '_this' to current instance.
    securePostCallback(result, _this) {
        if (result.errorMessage == '') {
            _this.msgFromServer = result['msgFromServer'];
        }
        else {
            alert(JSON.stringify(result.errorMessage));
        }
    }
    //------------------------------------------------------------
    // Log user in. 
    //------------------------------------------------------------
    login() {
        let url = this.site + "auth";
        // This free online service receives post submissions.
        this.http.post(url, {
            username: this.username,
            password: this.password,
        })
            .subscribe(
        // Data is received from the post request.
        (data) => {
            // Inspect the data to know how to parse it.
            console.log(JSON.stringify(data));
            if (data["token"] != null) {
                this.token = data["token"];
                sessionStorage.setItem('auth_token', data["token"]);
                this.message = "The user has been logged in.";
            }
        }, 
        // An error occurred. Data is not received. 
        error => {
            alert(JSON.stringify(error));
        });
    }
    //------------------------------------------------------------
    // Log user out. Destroy token.
    //------------------------------------------------------------
    logout() {
        sessionStorage.clear();
        this.showContentIfLoggedIn();
        // Clear data.
        this.secureData = "";
        this.managerData = "";
        this.reqInfo = {};
        this.msgFromServer = "";
        this.username = '';
        this.loggedin = false;
        // this.isadmin = false;
    }
};
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: 'app.component.html'
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map