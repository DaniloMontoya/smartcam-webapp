import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RestService } from 'src/app/services/rest.service';
import { Client } from 'src/app/models/client.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  public search: string
  public length = 100;
  public pageIndex = 0
  public pageSize = 15;
  public pageSizeOptions: number[] = [15, 30, 50, 100];

  displayedColumns: string[] = ['id', 'name', 'client', 'edit', 'delete'];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  loadNextPage(event:any) {

  }

  searchByName() {
  }

  openClientConfigModal() {
    this.dialog.open(ClientConfigModal);
  }

  openAddModal() {
    this.dialog.open(AddModal);
  }

  openEditModal(user:any) {
    this.dialog.open(EditUserModal, { data: user });
  }

  openDeleteModal(user:any) {
    this.dialog.open(DeleteUserModal, { data: user });
  }

}

@Component({
  selector: 'add_user-modal',
  templateUrl: 'add_user.modal.html',
})
export class AddModal {

  data: any
  clients: string [] = ['Saferbo', 'Costera', 'Intervial', 'Etc...']

  constructor(
    public dialogRef: MatDialogRef<AddModal>,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) { }

  addUser() {
    this.dialogRef.close()
  }

}

@Component({
  selector: 'edit_user-modal',
  templateUrl: 'edit_user.modal.html',
})
export class EditUserModal {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditUserModal>,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) { }
}

@Component({
  selector: 'client-config',
  templateUrl: 'client_config.modal.html',
})
export class ClientConfigModal implements OnInit {

  client: Client

  constructor(
    public dialogRef: MatDialogRef<ClientConfigModal>,
    private snackBar: MatSnackBar,
    private rest: RestService,
    public dialog: MatDialog) { }

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

@Component({
  selector: 'delete-modal',
  templateUrl: 'delete_user.modal.html',
})
export class DeleteUserModal {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditUserModal>,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) { }

    onNoClick(): void {
      this.dialogRef.close();
    }

    delete() {}
}
