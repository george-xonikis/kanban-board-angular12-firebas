import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardService } from '../board.service';

export enum ITaskAction {
    DELETE = 'delete'
}

@Component({
    selector: 'app-task-dialog',
    styleUrls: ['./dialog.scss'],
    template: `
        <h1 mat-dialog-title>Task</h1>
      
        <div mat-dialog-content class="content">
            <mat-form-field>
                <textarea placeholder="Task description" 
                          matInput 
                          [(ngModel)]="data.task.description">
                </textarea>
            </mat-form-field>
            
            <br/>
            
            <mat-button-toggle-group #group="matButtonToggleGroup" 
                                     [(ngModel)]="data.task.label">
                <mat-button-toggle *ngFor="let opt of labelOptions" [value]="opt">
                    <mat-icon [ngClass]="opt">
                        {{ opt === 'gray' ? 'check_circle' : 'lens' }}
                    </mat-icon>
                </mat-button-toggle>
            </mat-button-toggle-group>
        </div>
        
        <div mat-dialog-actions>
            <button mat-button [mat-dialog-close]="data" cdkFocusInitial>
                {{ data.isNew ? 'Add Task' : 'Update Task' }}
            </button>

            <app-delete-button
                    (delete)="removeTask()"
                    *ngIf="!data.isNew"
            ></app-delete-button>
        </div>
    `
})
export class TaskDialogComponent {
    labelOptions = ['purple', 'blue', 'green', 'yellow', 'red', 'gray'];

    constructor(private dialogRef: MatDialogRef<TaskDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    removeTask(): void {
        this.dialogRef.close({ action: ITaskAction.DELETE });
    }


}
