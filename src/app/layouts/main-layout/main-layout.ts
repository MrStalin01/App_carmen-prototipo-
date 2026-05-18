import { Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { ModifyMember } from './components/modify-member/modify-member';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddMember } from './components/add-member/add-member';
import { DeleteMember } from './components/delete-member/delete-member';
import { AddCurso } from './components/add-curso/add-curso';
import { CursosMember } from './components/cursos-member/cursos-member';
import { RouterModule } from '@angular/router';
import { SociosService } from '../../core/services/socios/socios.service';
import { ActividadService } from '../../core/services/actividad/actividad.service';

interface Socio {
  id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  tel: string;
  dni: string;
  estado: string;
  fechaVenc: string;
  profesor: string;
  selected: boolean;
  cursos: string[];
  cursosAbiertos: boolean;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatChipsModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit {
  private dialog    = inject(MatDialog);
  private router    = inject(Router);
  private sociosSvc = inject(SociosService);

  filtrosAbiertos = false;
  sortColumn: 'nombres' | 'apellidos' | null = null;
  sortAsc = true;
  estadoFiltro: 'todos' | 'Activo' | 'Inactivo' = 'todos';
  profesorFiltro: 'todos' | 'Si' | 'No' = 'todos';
  textoBusqueda = '';
  cargando = false;
  errorCarga: string | null = null;

  filtros = [
    { label: 'Activo',    activo: false },
    { label: 'Inactivo',  activo: false },
    { label: 'Profesor',  activo: false },
    { label: 'A → Z',    activo: false },
    { label: 'Z → A',    activo: false },
    { label: '0 → 9',    activo: false },
    { label: '9 → 0',    activo: false },
  ];

  cursosDisponibles: string[] = [];

  socios: Socio[] = [];

  // ── Ciclo de vida ───────────────────────────────────────────────
  ngOnInit(): void {
    this.cargarSocios();
  }

  /**
   * GET /socio/all
   * Mapea la estructura anidada del servidor al formato local.
   */
  cargarSocios(): void {
    this.cargando = true;
    this.errorCarga = null;

    this.sociosSvc.getSocios().subscribe({
      next: (data) => {
        this.socios = (data ?? []).map((s: any) => this.mapearSocio(s));
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error GET /socio/all:', err);
        this.errorCarga = 'No se pudo cargar la lista de socios.';
        this.cargando = false;
      },
    });
  }

  /**
   * Convierte un socio del servidor al formato local.
   * Todos los campos que el servidor no devuelva quedan como string vacío.
   */
  private mapearSocio(s: any): Socio {
    const info = s.informacionPersonalModel ?? {};

    // Extraer nombres de cursos de las actividades anidadas
    const cursos: string[] = [];
    if (s.actividades && typeof s.actividades === 'object') {
      for (const actividad of Object.values(s.actividades) as any[]) {
        if (Array.isArray(actividad?.cursos)) {
          for (const curso of actividad.cursos) {
            if (curso?.id) cursos.push(curso.id);
          }
        }
      }
    }

    return {
      id:            s.id               ?? s._id       ?? '',
      nombres:       info.nombres        ?? '',
      apellidos:     info.apellidos      ?? '',
      correo:        info.correo         ?? '',
      tel:           info.telefono       ?? '',
      dni:           info.identificacion ?? '',
      estado:        s.estado_Socio      ?? 'Inactivo',
      fechaVenc:     s.fecha_vencimiento ?? '',
      profesor:      s.tipo_socio === 'Profesor' ? 'Si' : 'No',
      cursos,
      cursosAbiertos: false,
      selected:       false,
    };
  }

  // ── Filtros y ordenación (sin cambios) ─────────────────────────
  get sociosFiltrados(): Socio[] {
    let lista = this.socios;

    if (this.estadoFiltro !== 'todos') {
      lista = lista.filter((s) => s.estado === this.estadoFiltro);
    }
    if (this.profesorFiltro !== 'todos') {
      lista = lista.filter((s) => s.profesor === this.profesorFiltro);
    }
    if (this.textoBusqueda.trim()) {
      const texto = this.textoBusqueda.toLowerCase().trim();
      lista = lista.filter(
        (s) =>
          s.nombres.toLowerCase().includes(texto) ||
          s.apellidos.toLowerCase().includes(texto) ||
          s.correo.toLowerCase().includes(texto) ||
          s.dni.toLowerCase().includes(texto),
      );
    }
    return lista;
  }

  get allSelected(): boolean {
    return this.sociosFiltrados.length > 0 && this.sociosFiltrados.every((s) => s.selected);
  }

  get someSelected(): boolean {
    return this.sociosFiltrados.some((s) => s.selected) && !this.allSelected;
  }

  get selectedSocios(): Socio[] {
    return this.socios.filter((s) => s.selected);
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.sociosFiltrados.forEach((s) => (s.selected = checked));
  }

  fabAbierto = false;
  onCheckChange(): void {}

  filtrarEstado() {
    this.estadoFiltro =
      this.estadoFiltro === 'todos'   ? 'Activo'  :
        this.estadoFiltro === 'Activo'  ? 'Inactivo': 'todos';
  }

  filtrarProfesor() {
    this.profesorFiltro =
      this.profesorFiltro === 'todos' ? 'Si'  :
        this.profesorFiltro === 'Si'    ? 'No'  : 'todos';
  }

  sortBy(col: 'nombres' | 'apellidos') {
    if (this.sortColumn === col) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortColumn = col;
      this.sortAsc = true;
    }
    this.socios.sort((a, b) => {
      const valA = a[col].toLowerCase();
      const valB = b[col].toLowerCase();
      return this.sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }

  toggleFiltros() { this.filtrosAbiertos = !this.filtrosAbiertos; }
  toggleChip(filtro: any) { filtro.activo = !filtro.activo; }

  // ── Diálogos ────────────────────────────────────────────────────

  openAddMember(socio?: Socio) {
    const dialogRef = this.dialog.open(ModifyMember, {
      width: '480px',
      data: socio ?? null,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      if (socio) {
        const index = this.socios.indexOf(socio);
        this.socios[index] = { ...socio, ...result };
      } else {
        this.socios.push(result);
      }
    });
  }

  openMember() {
    const nextNumero = this.socios.length + 1;
    this.dialog.open(Member, {
      data: { nextNumero },
    });

    // Cuando AddMember cierra con éxito ya llamó a la API internamente;
    // solo necesitamos refrescar la lista local con lo que devuelve.
    dialogRef.afterClosed().subscribe((nuevoSocio) => {
      if (!nuevoSocio) return;
      this.socios.push(nuevoSocio);
    });
  }

  goToRegister() { this.router.navigate(['/register']); }
  cursos()       { this.router.navigate(['/cursos']); }

  /**
   * DELETE /socio/delete
   * Si se pasa un socio concreto lo elimina por su id.
   * Si no, elimina todos los seleccionados en secuencia.
   */
  onEliminar(socio?: Socio) {
    const dialogRef = this.dialog.open(DeleteMember, { width: '400px' });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      if (socio) {
        // ── Eliminar un socio concreto ──────────────────────────
        this.sociosSvc.deleteSocio(socio.id, socio.nombres).subscribe({
          next: () => {
            this.socios = this.socios.filter((s) => s !== socio);
          },
          error: (err) => {
            console.error('Error DELETE /socio/delete:', err);
          },
        });
      } else {
        // ── Eliminar todos los seleccionados ────────────────────
        const seleccionados = this.socios.filter((s) => s.selected);
        let completados = 0;

        seleccionados.forEach((s) => {
          this.sociosSvc.deleteSocio(s.id, s.nombres).subscribe({
            next: () => {
              completados++;
              if (completados === seleccionados.length) {
                // Refrescamos la lista solo cuando todas las peticiones terminen
                this.socios = this.socios.filter((x) => !x.selected);
              }
            },
            error: (err) => {
              console.error(`Error al eliminar socio ${s.id}:`, err);
            },
          });
        });
      }
    });
  }

  onModificar() { console.log('Modificar'); }

  openAddCurso() {
    const dialogRef = this.dialog.open(AddCurso, {
      data: { cursosExistentes: this.cursosDisponibles },
    });
    dialogRef.afterClosed().subscribe((nuevoCurso) => {
      if (!nuevoCurso) return;
      if (!this.cursosDisponibles.includes(nuevoCurso.nombre)) {
        this.cursosDisponibles.push(nuevoCurso.nombre);
      }
    });
  }

  onPagos()  { console.log('Pagos'); }
  onCorreo() { console.log('Correo', this.selectedSocios); }
  submit()   { this.router.navigate(['/main']); }
}
