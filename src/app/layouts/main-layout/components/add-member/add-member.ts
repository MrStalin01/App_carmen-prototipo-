import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './add-member.html',
  styleUrl: './add-member.scss',
})
export class AddMember {
  private dialogRef = inject(MatDialogRef<AddMember>);
  private fb = inject(FormBuilder);
  form: FormGroup;

  // Número real del socio que se está editando
  socioNumero: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.socioNumero = data?.id ?? 0;

    this.form = this.fb.group({
      name: [data?.nombres ?? ''],
      apellidos: [data?.apellidos ?? ''],
      email: [data?.correo ?? ''],
      phone: [data?.tel ?? ''],
      dni: [data?.dni ?? ''],
      profesor: [data?.profesor === 'Si' ? true : false],
      activo: [data?.estado === 'Activo' ? true : false],
    });
  }

  esEdicion(): boolean {
    return !!this.data;
  }

  guardar() {
    const val = this.form.value;
    this.dialogRef.close({
      nombres: val.name,
      apellidos: val.apellidos,
      correo: val.email,
      tel: val.phone,
      dni: val.dni,
      profesor: val.profesor ? 'Si' : 'No',
      estado: val.activo ? 'Activo' : 'Inactivo',
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
