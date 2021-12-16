import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RestService } from 'src/app/services/rest.service';
import { Client } from 'src/environments/client.prod';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  client: Client

  constructor(private rest: RestService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.rest.getClient().subscribe((res:Client)=>this.client = res)
  }

  async updateClient() {
    await this.rest.updateClient(this.client).subscribe({
      next: data => {
          let snack = this.snackBar.open('El cliente ha sido actualizado!')
          setTimeout(() => {
            snack.dismiss()
          }, 1000);
      },
      error: error => {
        let snack = this.snackBar.open(error.message)
        setTimeout(() => {
          snack.dismiss()
        }, 1000);
          console.error('There was an error!', error.message);
      }
  })
  }

}
