import { Component, inject, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import Article from '../../models/article.interface';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatFormField,MatLabel } from '@angular/material/form-field';
import { MatCard,MatCardContent,MatCardActions } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TruncatePipe } from '../../truncate.pipe';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule,TruncatePipe,MatCheckboxModule,MatIcon,MatCardContent,MatLabel,MatFormField,MatCard],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent implements OnInit{

  private articleService: ArticleService = inject(ArticleService);

  articles: Article[] = [];

  ngOnInit(): void {

    this.articleService.getAll().subscribe(
      {
        next:(data)=>{
          this.articles = data;
        },
        error:(e)=>{
          console.log(e);
        },
      }
    )
  }
}
