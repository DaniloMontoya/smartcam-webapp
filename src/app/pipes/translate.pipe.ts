import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'translate'
})
export class TranslatePipe implements PipeTransform {
    transform(value: any): any {
        switch (value) {
          case 'BIKE':
            return 'Motocicleta'
          case 'CAR':
            return 'Carro'
          case 'ACTIVE':
            return 'Activo'
          case 'INACTIVE':
            return 'Inactivo'
          case 'UNDEFINED':
            return 'Sin Definir'
          default :
            return 'No específicado'
        }
    }
}
