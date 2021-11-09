import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

const SESSION_STATE = localStorage.getItem('auth')

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLogged:boolean = SESSION_STATE ? JSON.parse(SESSION_STATE) : false
  remember_log:boolean = true

  constructor(private _snackbar: MatSnackBar) {}

  login(userform: User) {
    if('user' !== userform.user && '1234' !== userform.password) {
      this._snackbar.open(`Las credenciales no coinciden! Verifique la validez del los datos ingresados.`)
        setTimeout(() => {
          this._snackbar.dismiss()
        }, 2000);
      return
    }
    this.isLogged = true
        if(this.remember_log)
          localStorage.setItem('auth', `${true}`);
  }

  logout() {
    this.isLogged = false
    localStorage.setItem('auth', `${false}`);
  }

  checkIfRemember(event:any) {
    this.remember_log = event.target.checked
  }
}
