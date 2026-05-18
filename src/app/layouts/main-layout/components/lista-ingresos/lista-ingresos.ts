import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GastoIngresoService, Ingreso } from '../../services/gasto-ingreso.service';
import { AddIngresoComponent } from '../add-ingreso/add-ingreso';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog.service';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'app-lista-ingresos',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './lista-ingresos.html',
  styleUrl: './lista-ingresos.scss',
})
export class ListaIngresosComponent implements OnInit {
  private ingresoService = inject(GastoIngresoService);
  private dialog = inject(MatDialog);
  private confirmDialog = inject(ConfirmDialogService);
  private router =inject(Router);

  ingresos = signal<Ingreso[]>([]);
  searchTerm = signal('');

  ingresosFiltrados = computed(() =>
    this.ingresos().filter((ingreso) => {
      const term = this.searchTerm().toLowerCase();
      return (
        ingreso.descripcion.toLowerCase().includes(term) ||
        ingreso.fechaIngreso.toLowerCase().includes(term)
      );
    }),
  );

  displayedColumns: string[] = ['fecha', 'descripcion', 'monto', 'acciones'];

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.ingresos.set(this.ingresoService.getIngresos());
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }

  abrirAddIngreso(): void {
    const dialogRef = this.dialog.open(AddIngresoComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.cargarDatos();
    });
  }

  eliminarIngreso(id: number, descripcion: string, monto: number): void {
    this.confirmDialog
      .confirm({
        title: 'Eliminar ingreso',
        message: `¿Estás seguro de que quieres eliminar el ingreso "${descripcion}" de ${monto}€?`,
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar',
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.ingresoService.deleteIngreso(id);
          this.cargarDatos();
        }
      });
  }
  fabAbierto = false;
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
