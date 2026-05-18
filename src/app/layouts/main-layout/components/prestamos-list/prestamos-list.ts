import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
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
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './prestamos-list.html',
  styleUrl: './prestamos-list.scss',
})
export class PrestamosListComponent implements OnInit {
  private prestamoService = inject(PrestamoService);
  private dialog = inject(MatDialog);
  private confirmDialog = inject(ConfirmDialogService);

  todas = signal<objeto[]>([]);
  prestadas = signal<objeto[]>([]);
  disponibles = signal<objeto[]>([]);
  searchTerm = signal('');

  todasFiltradas = computed(() =>
    this.todas().filter((h) => h.nombre.toLowerCase().includes(this.searchTerm().toLowerCase())),
  );

  prestadasFiltradas = computed(() =>
    this.prestadas().filter((h) =>
      h.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()),
    ),
  );

  disponiblesFiltradas = computed(() =>
    this.disponibles().filter((h) =>
      h.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()),
    ),
  );

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.todas.set(this.prestamoService.getObjetos());
    this.prestadas.set(this.prestamoService.getPrestados());
    this.disponibles.set(this.prestamoService.getDisponibles());
  }

  clearSearch(): void {
    this.searchTerm.set('');
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
