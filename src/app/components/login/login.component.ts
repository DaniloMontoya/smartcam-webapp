import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  user_form: User = { name: "", user: "", mail: "", confirm_mail: "", password: "", confirm_password: "" }
  showsRegister: boolean = false

  constructor(public auth: AuthService) { }

  ngOnInit() {
    document.body.className = "background-login-image";
  }

  ngOnDestroy(){
    document.body.className="";
  }

  showRegister() {
    this.showsRegister = !this.showsRegister
    if(this.showsRegister) {
      document.getElementById("mySidebar").style.width = "50%";
    } else {
      document.getElementById("mySidebar").style.width = "0";
    }
  }

}
