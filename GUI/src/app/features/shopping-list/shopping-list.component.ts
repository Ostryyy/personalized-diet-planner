import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { ShoppingListItem } from '../../core/models/shopping-list.model';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ShoppingListService } from '../../core/services/shopping-list.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [MatCardModule, MatListModule, MatButtonModule, MatIconModule],
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit {
  shoppingListItems?: ShoppingListItem[] = [];
  destroyRef = inject(DestroyRef);

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.loadShoppingList();
  }

  loadShoppingList(): void {
    this.shoppingListService
      .getShoppingList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => (this.shoppingListItems = list.items));
  }

  removeItem(ingredientId: number): void {
    this.shoppingListService
      .removeItemFromShoppingList(ingredientId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => {
        this.shoppingListItems = list.shoppingList.items;
      });
  }

  resetShoppingList(): void {
    this.shoppingListService
      .resetShoppingList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => {
        this.shoppingListItems = list.shoppingList.items;
      });
  }
}
