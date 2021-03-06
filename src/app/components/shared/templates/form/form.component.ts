import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FormControls, FormData } from '../../../../models/IFormData';
import { AuthService } from '../../../../services/auth/auth.service';
import { REGEXP } from '../../../../../assets/regex/regex';
import { AuthResponse } from 'src/app/models/IAuthResponse';
import { Router } from '@angular/router';
import { UserDataService } from '../../../../services/user-data/user-data.service';
import { CarService } from '../../../../services/car.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent implements OnChanges {
  @Input() data!: FormData;
  @Input() key!: 'login' | 'cars' | 'register';
  form: FormGroup = this.fb.group({});
  formHasErrors = false;

  constructor(
    private fb: FormBuilder,
    private authS: AuthService,
    private router: Router,
    private userDataS: UserDataService,
    private carsS: CarService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.data.firstChange) {
      this.createForm(this.data.controls);
    }
  }

  createForm(controls: FormControls[]) {
    for (const control of controls) {
      const validatorsToAdd = [];

      for (const [key, value] of Object.entries(control.validators)) {
        switch (key) {
          case 'min':
            validatorsToAdd.push(Validators.min(value));
            break;
          case 'max':
            validatorsToAdd.push(Validators.max(value));
            break;
          case 'required':
            if (value) {
              validatorsToAdd.push(Validators.required);
            }
            break;
          case 'requiredTrue':
            if (value) {
              validatorsToAdd.push(Validators.requiredTrue);
            }
            break;
          case 'email':
            if (value) {
              validatorsToAdd.push(Validators.email);
            }
            break;
          case 'minLength':
            validatorsToAdd.push(Validators.minLength(value));
            break;
          case 'maxLength':
            validatorsToAdd.push(Validators.maxLength(value));
            break;
          case 'pattern':
            if (value == 'email')
              validatorsToAdd.push(Validators.pattern(REGEXP.EMAIL));
            break;
          case 'nullValidator':
            if (value) {
              validatorsToAdd.push(Validators.nullValidator);
            }
            break;
          default:
            break;
        }
      }
      this.form.addControl(control.name, this.fb.control('', validatorsToAdd));
    }
  }

  inputHasError(control: string) {
    if (
      this.form.controls[control].errors &&
      this.form.controls[control].touched
    )
      return true;
    else return false;
  }

  changeGenre(e: any) {
    if(this.key === 'register'){
      this.form.controls['genre'].setValue(e.target.value, {
        onlySelf: true,
      });
    } else {
      this.form.controls['transmission'].setValue(e.target.value, {
        onlySelf: true,
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      console.log(this.form.value);
      this.formHasErrors = true;
      return;
    }

    if(this.key === 'cars'){
      this.carsS.postCar(this.form.value,this.userDataS.getUserInfo()).subscribe((resp: any) =>{
        if (resp.details) {
          confirm(resp.details);
          return;
        }
        confirm(`Anuncio creado correctamente.`);
        this.router.navigate(['/myPosts']);
      })
      return
    }

    this.authS
      .connect(this.form.value, this.key)
      .subscribe((resp: AuthResponse) => {
        if (resp.details) {
          confirm(resp.details);
          return;
        }
        localStorage.setItem('AuthToken', resp.token);
        this.userDataS.setUserInfo(resp.users);
        this.router.navigate(['/home']);
        confirm(`Bienvenid@ ${resp.users.nombres}!`);
      });
  }
}
