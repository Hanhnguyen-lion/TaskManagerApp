import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  
  @Input() title: string = "";
  
  @Input() message: string = "";

  constructor(public activeDialog: NgbActiveModal){

  }

  onClose(){
    this.activeDialog.dismiss();
  }

  onConfirm(){
    this.activeDialog.close(true);
  }

}
