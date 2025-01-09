import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../../core/models/recipe.model';
import { RecipeService } from '../../core/services/recipe.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe, Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

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
  private recipeService = inject(RecipeService);

  ngOnInit(): void {
    const recipeId = this.route.snapshot.params['id'];
    this.loadRecipe(recipeId);
  }

  loadRecipe(recipeId: number): void {
    this.recipeService.getRecipeById(recipeId).subscribe((data) => {
      this.recipe = data;
    });
  }

  getNutrientValue(nutrientName: string): number {
    const nutrient = this.recipe?.nutrition?.nutrients.find(
      (n) => n.name === nutrientName
    );
    return nutrient ? nutrient.amount : 0;
  }
  

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/meal-plan']);
    }
  }
}
