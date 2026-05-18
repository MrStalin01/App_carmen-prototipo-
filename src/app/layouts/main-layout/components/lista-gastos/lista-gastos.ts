import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GastoIngresoService, Gasto } from '../../services/gasto-ingreso.service';
import { AddGastoComponent } from '../add-gasto/add-gasto';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lista-gastos',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    RouterModule,
  ],
  templateUrl: './lista-gastos.html',
  styleUrl: './lista-gastos.scss',
})
export class ListaGastosComponent implements OnInit {
  private gastoService = inject(GastoIngresoService);
  private dialog = inject(MatDialog);
  private confirmDialog = inject(ConfirmDialogService);
  private router =inject(Router);

  gastos = signal<Gasto[]>([]);
  searchTerm = signal('');

  displayedColumns: string[] = ['fecha', 'descripcion', 'monto', 'acciones'];

  gastosFiltrados = computed(() =>
    this.gastos().filter((gasto) => {
      const term = this.searchTerm().toLowerCase();
      return (
        gasto.descripcion.toLowerCase().includes(term) ||
        gasto.fechaGasto.toLowerCase().includes(term)
      );
    }),
  );
  fabAbierto = false;

  ngOnInit(): void {
    this.cargarGastos();
  }

  cargarGastos(): void {
    this.gastos.set(this.gastoService.getGastos());
  }

  abrirAddGasto(): void {
    const dialogRef = this.dialog.open(AddGastoComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarGastos();
      }
    });
  }

  eliminarGasto(id: number, descripcion: string, monto: number): void {
    this.confirmDialog
      .confirm({
        title: 'Eliminar gasto',
        message: `¿Estás seguro de que quieres eliminar el gasto "${descripcion}" de ${monto}€?`,
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.gastoService.deleteGasto(id);
          this.cargarGastos();
        }
      });
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }
  submit(): void {
    this.router.navigate(['/main']);
  }
  onPrestamos() {
    this.router.navigate(['/prestamos']);
  }
  onGastos() {
    this.router.navigate(['/gastos']);
  }
  onIngresos() {
    this.router.navigate(['/ingresos']);
  }
  cursos(): void {
    this.router.navigate(['/cursos']);
  }
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
