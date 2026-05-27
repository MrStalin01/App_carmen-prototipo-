import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { GastoIngresoService, Gasto } from '../../services/gasto-ingreso.service';
import { AddGastoComponent } from '../add-gasto/add-gasto';
import { ConfirmDialogService } from '../../../../shared/confirm-dialog.service';

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
  private gastoService  = inject(GastoIngresoService);
  private dialog        = inject(MatDialog);
  private confirmDialog = inject(ConfirmDialogService);
  private router        = inject(Router);

  gastos     = signal<Gasto[]>([]);
  searchTerm = signal('');
  cargando   = signal(false);
  fabAbierto = false;

  displayedColumns: string[] = ['fecha', 'descripcion', 'monto', 'acciones'];

  gastosFiltrados = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.gastos().filter(g =>
      g.descripcion.toLowerCase().includes(term) ||
      g.fecha_gasto.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.cargarGastos();
  }

  cargarGastos(): void {
    this.cargando.set(true);
    this.gastoService.getGastos().subscribe({
      next: (data) => { this.gastos.set(data); this.cargando.set(false); },
      error: (err)  => { console.error('Error cargando gastos:', err); this.cargando.set(false); },
    });
  }

  abrirAddGasto(): void {
    const dialogRef = this.dialog.open(AddGastoComponent, { width: '450px' });
    dialogRef.afterClosed().subscribe((result: Omit<Gasto, 'id'> | undefined) => {
      if (!result) return;
      this.gastoService.addGasto(result).subscribe({
        next: (nuevo) => this.gastos.update(lista => [...lista, nuevo]),
        error: (err)  => console.error('Error añadiendo gasto:', err),
      });
    });
  }

  eliminarGasto(id: string | undefined, descripcion: string, monto: number): void {
  if (!id) return;
  this.confirmDialog.confirm({
    title:       'Eliminar gasto',
    message:     `¿Eliminar el gasto "${descripcion}" de ${monto}€?`,
    confirmText: 'Sí, eliminar',
    cancelText:  'Cancelar',
  }).subscribe((confirmed) => {
    if (!confirmed) return;
    this.gastoService.deleteGasto(id).subscribe({
      next: () => this.gastos.update(lista => lista.filter(g => g.id !== id)),
      error: (err) => console.error('Error eliminando gasto:', err),
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
