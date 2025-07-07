import { Component, inject, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import Article from '../../models/article.interface';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCard, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TruncatePipe } from '../../truncate.pipe';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, TruncatePipe, MatIcon, MatCardContent, MatLabel, MatInputModule,MatProgressSpinnerModule, MatCheckboxModule, MatFormField, MatCard, ReactiveFormsModule],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent implements OnInit {


  private articleService: ArticleService = inject(ArticleService);
  private formBuilder: FormBuilder = inject(FormBuilder);

  articles: Article[] = [];
  filteredArticles: Article[] = [];
  searchForm: FormGroup;

  isLoading: boolean = true;

  constructor() {
    this.searchForm = this.formBuilder.group({
      title: ['', []],
      priceMax: ['', [Validators.min(0)]],
      hasDiscount: [false, []],
    });


  }

  ngOnInit(): void {

    this.articleService.getAll().subscribe(
      {
        next: (data) => {
          this.articles = data;
          this.filteredArticles = data;
          this.isLoading = false;
        },
        error: (e) => {
          this.isLoading = false;
          console.log(e);
        },
      }
    );
  }
  search() {

    if(this.searchForm.valid){
      //Recuperer valeur d'un seul champ
    console.log('SEARCH', this.searchForm.value.priceMax);
    console.log(this.searchForm.get("priceMax")?.value);

    // On reprend tout les articles pour les filtrer
    this.filteredArticles = this.articles;

    if (this.searchForm.value.title) {
      this.filteredArticles = this.filteredArticles.filter((article)=>{
        return article.title.toLowerCase().trim().includes(this.searchForm.value.title.toLowerCase().trim());
      });
    }

    if (this.searchForm.value.priceMax) {
       this.filteredArticles = this.filteredArticles.filter((article)=>{
        // Attention a bien alculé le prix en reduction
        return article.fullPrice - article.fullPrice * article.discountPercent  <= this.searchForm.value.priceMax
      });
    }

    if (this.searchForm.value.hasDiscount === true) {
      this.filteredArticles = this.filteredArticles.filter((article)=>{
        return article.discountPercent !== 0
      });
    }
    }


  }
  refreshFilters(): void {
    this.searchForm.reset();
    this.filteredArticles = this.articles;
  }
}
