import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog';

export interface ConfirmDialogOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private dialog = inject(MatDialog);

  confirm(options: ConfirmDialogOptions): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: options.title || 'Confirmar',
        message: options.message || '¿Estás seguro?',
        confirmText: options.confirmText || 'Eliminar',
        cancelText: options.cancelText || 'Cancelar',
      },
    });
    return dialogRef.afterClosed();
  }
}
