import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ingredient, Recipe } from '../../core/models/recipe.model';
import { RecipeService } from '../../core/services/recipe.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe, Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ShoppingListService } from '../../core/services/shopping-list.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, DecimalPipe],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.scss',
})
export class RecipeDetailsComponent {
  recipe?: Recipe;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private destroyRef = inject(DestroyRef);
  private recipeService = inject(RecipeService);
  private shoppingListService = inject(ShoppingListService);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    const recipeId = this.route.snapshot.params['id'];
    this.loadRecipe(recipeId);
  }

  loadRecipe(recipeId: number): void {
    this.recipeService
      .getRecipeById(recipeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.recipe = data;
      });
  }

  getNutrientValue(nutrientName: string): number {
    const nutrient = this.recipe?.nutrition?.nutrients.find(
      (n) => n.name === nutrientName
    );
    return nutrient ? nutrient.amount : 0;
  }

  addToShoppingList(ingredient: Ingredient): void {
    this.shoppingListService
      .addIngredientsToShoppingList([
        {
          ingredientId: ingredient.id,
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          image: ingredient.image,
        },
      ])
      .subscribe({
        next: () => this.toastr.success('Ingredient added to shopping list!'),
        error: () => this.toastr.error('Failed to add ingredient.'),
      });
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/meal-plan']);
    }
  }
}
