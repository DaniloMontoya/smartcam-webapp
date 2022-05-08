import { Injectable } from '@angular/core';
import { DOMAIN_URL } from 'src/environments/domain.prod';
import { Me } from '../models/me.model';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: Me
  clientImageUrl: string = `${DOMAIN_URL}/rest/client/profile/logo.png`

  constructor(private rest: RestService) {
    this.rest.getUiMe().subscribe((res:Me)=>{this.user = res})
  }

  getUsername() { return this.user?.username }

  getToken() { return this.user?.token }

  getRoles() { return this.user?.roles }

}
