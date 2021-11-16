import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Icar } from '../models/Icar';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private url = environment.apiUrl;

  constructor(private http : HttpClient) { }

  getAllCars(key: string): Observable<Icar[]>{
   return this.http.get<Icar[]>(this.url + key);
  }

  getCarById(id:number):Observable<Icar>{
    return this.http.get<Icar>(this.url + 'cars/' + id.toString()+"/");
  }
}
