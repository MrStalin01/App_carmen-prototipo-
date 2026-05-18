import { Component, inject, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { EmailValidator } from '../../../../core/validators/email.validator';
import { DniValidator } from '../../../../core/validators/dni.validator';
import { SociosService } from '../../../../core/services/socios/socios.service';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    CommonModule,
  ],
  templateUrl: './add-member.html',
  styleUrl: './add-member.scss',
})
export class AddMember {
  private dialogRef = inject(MatDialogRef<AddMember>);
  private fb        = inject(FormBuilder);
  private sociosSvc = inject(SociosService);

  form: FormGroup;
  nextNumero: number;

  // Control de estado de la petición
  guardando = false;
  error: string | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.nextNumero = data?.nextNumero ?? 1;

    this.form = this.fb.group({
      name:      [data?.nombres   ?? '', [Validators.required]],
      apellidos: [data?.apellidos ?? '', [Validators.required]],
      email:     [data?.correo    ?? '', [Validators.required, EmailValidator]],
      phone:     [data?.tel       ?? '', [Validators.required]],
      dni:       [data?.dni       ?? '', [Validators.required, DniValidator]],
      profesor:  [data?.profesor === 'Si' ? true : false],
      activo:    [data?.estado === 'Activo' ? true : false],
    });
  }

  esEdicion(): boolean { return !!this.data?.id; }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;

    // ── Payload anidado que espera el servidor ──────────────────
    // Los campos no recogidos en el formulario se envían como null
    const payload = {
      informacionPersonalModel: {
        identificacion: val.dni       ?? null,
        nombres:        val.name      ?? null,
        apellidos:      val.apellidos ?? null,
        correo:         val.email     ?? null,
        telefono:       val.phone     ?? null,
        contrasena:     null,                   // no se recoge en el form
      },
      estado_Socio:      val.activo   ? 'Activo' : 'Inactivo',
      tipo_socio:        val.profesor ? 'Profesor' : 'Socio',
      ultimo_pago:       null,   //  no se recoge en el form
      fecha_vencimiento: null,   // no se recoge en el form
      historial_pagos:   [],
      actividades:       {},
    };

    this.guardando = true;
    this.error = null;

    this.sociosSvc.guardar(payload).subscribe({
      next: (res) => {
        this.guardando = false;
        // Cerramos el diálogo devolviendo los datos en el formato
        // que usa main-layout para su array local
        this.dialogRef.close({
          id:        res?.id ?? null,
          nombres:   val.name,
          apellidos: val.apellidos,
          correo:    val.email,
          tel:       val.phone,
          dni:       val.dni,
          profesor:  val.profesor ? 'Si' : 'No',
          estado:    val.activo   ? 'Activo' : 'Inactivo',
          fechaVenc: null,
          cursos:    [],
          cursosAbiertos: false,
          selected:  false,
        });
      },
      error: (err) => {
        this.guardando = false;
        this.error = 'Error al guardar el socio. Revisa la conexión con el servidor.';
        console.error('Error POST /socio/add:', err);
      },
    });
  }

  cancel() { this.dialogRef.close(null); }
}
