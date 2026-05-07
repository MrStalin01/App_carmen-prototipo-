import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogClose } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PrestamoService, objeto } from '../../services/prestamo.service';
import { AddPrestamo } from '../add-prestamo/add-prestamo';
import { PrestarDevolverComponent } from '../prestar-devolver/prestar-devolver';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog.service';
import { M } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-prestamos-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatTooltipModule,
    MatDialogClose,
  ],
  templateUrl: './prestamos-list.html',
  styleUrl: './prestamos-list.scss',
})
export class PrestamosListComponent implements OnInit {
  private prestamoService = inject(PrestamoService);
  private dialog = inject(MatDialog);
  private confirmDialog = inject(ConfirmDialogService);

  todas: objeto[] = [];
  prestadas: objeto[] = [];
  disponibles: objeto[] = [];

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.todas = this.prestamoService.getObjetos();
    this.prestadas = this.prestamoService.getPrestados();
    this.disponibles = this.prestamoService.getDisponibles();
  }

  abrirAddPrestamo(): void {
    const dialogRef = this.dialog.open(AddPrestamo, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarDatos();
      }
    });
  }

  abrirPrestarDevolver(): void {
    const dialogRef = this.dialog.open(PrestarDevolverComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarDatos();
      }
    });
  }

  eliminar(id: number, nombre: string): void {
    this.confirmDialog
      .confirm({
        title: 'Eliminar herramienta',
        message: `¿Estás seguro de que quieres eliminar "${nombre}"?`,
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.prestamoService.eliminarObjeto(id);
          this.cargarDatos();
        }
      });
  }
}
