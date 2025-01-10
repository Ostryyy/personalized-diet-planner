import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ShoppingList } from '../models/shopping-list.model';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  private apiUrl = `${environment.apiUrl}/shopping-list`;

  constructor(private http: HttpClient) {}

  getShoppingList(): Observable<ShoppingList> {
    return this.http.get<ShoppingList>(this.apiUrl);
  }

  addIngredientsToShoppingList(
    ingredients: {
      ingredientId: number;
      name: string;
      amount: number;
      unit: string;
      image?: string;
    }[]
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-recipe`, { items: ingredients });
  }

  removeItemFromShoppingList(
    ingredientId: number
  ): Observable<{ message: string; shoppingList: ShoppingList }> {
    return this.http.delete<{ message: string; shoppingList: ShoppingList }>(
      `${this.apiUrl}/remove-item/${ingredientId}`
    );
  }

  resetShoppingList(): Observable<{
    message: string;
    shoppingList: ShoppingList;
  }> {
    return this.http.post<{ message: string; shoppingList: ShoppingList }>(
      `${this.apiUrl}/reset`,
      {}
    );
  }
}
