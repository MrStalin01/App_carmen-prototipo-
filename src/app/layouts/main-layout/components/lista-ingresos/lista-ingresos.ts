import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { GastoIngresoService, Ingreso } from '../../services/gasto-ingreso.service';
import { AddIngresoComponent } from '../add-ingreso/add-ingreso';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog.service';

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
  private dialog         = inject(MatDialog);
  private confirmDialog  = inject(ConfirmDialogService);
  private router         = inject(Router);

  ingresos   = signal<Ingreso[]>([]);
  searchTerm = signal('');
  cargando   = signal(false);
  fabAbierto = false;

  displayedColumns: string[] = ['fecha', 'descripcion', 'monto', 'acciones'];

  ingresosFiltrados = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.ingresos().filter(i =>
      i.descripcion.toLowerCase().includes(term) ||
      i.fechaIngreso.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.cargarIngresos();
  }

  cargarIngresos(): void {
    this.cargando.set(true);
    this.ingresoService.getIngresos().subscribe({
      next: (data) => { this.ingresos.set(data); this.cargando.set(false); },
      error: (err)  => { console.error('Error cargando ingresos:', err); this.cargando.set(false); },
    });
  }

  abrirAddIngreso(): void {
    const dialogRef = this.dialog.open(AddIngresoComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe((result: Omit<Ingreso, 'id'> | undefined) => {
      if (!result) return;
      this.ingresoService.addIngreso(result).subscribe({
        next: (nuevo) => this.ingresos.update(lista => [...lista, nuevo]),
        error: (err)  => console.error('Error añadiendo ingreso:', err),
      });
    });
  }

  eliminarIngreso(id: string | undefined, descripcion: string, monto: number): void {
  if (!id) return;
  this.confirmDialog.confirm({
    title:       'Eliminar ingreso',
    message:     `¿Eliminar el ingreso "${descripcion}" de ${monto}€?`,
    confirmText: 'Sí, eliminar',
    cancelText:  'Cancelar',
  }).subscribe((confirmed) => {
    if (!confirmed) return;
    this.ingresoService.deleteIngreso(id).subscribe({
      next: () => this.ingresos.update(lista => lista.filter(i => i.id !== id)),
      error: (err) => console.error('Error eliminando ingreso:', err),
    });
  });
}

  clearSearch(): void { this.searchTerm.set(''); }
  submit():     void  { this.router.navigate(['/main']); }
  onPrestamos():void  { this.router.navigate(['/prestamos']); }
  onGastos():   void  { this.router.navigate(['/gastos']); }
  onIngresos(): void  { this.router.navigate(['/ingresos']); }
  cursos():     void  { this.router.navigate(['/cursos']); }
  goToRegister():void { this.router.navigate(['/register']); }
}
