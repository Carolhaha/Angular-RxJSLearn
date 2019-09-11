import { Component } from '@angular/core';

import { ProductService } from './product.service';
import {  EMPTY, Subject, combineLatest } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent{
  pageTitle = 'Product List';
  errorMessage = '';

  private categorySelectedSubject = new Subject<number>();
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();


  products$ = combineLatest([
    this.productService.productsWithCategory$,
    this.categorySelectedAction$
  ])
    .pipe(
      map(([products,selectedCategoryId])=>
        products.filter(product =>
          selectedCategoryId? product.categoryId===selectedCategoryId:true
          )
      ),
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    )
  categories$ = this.productCategoryService.productCategories$
      .pipe(
        catchError(err => {
          this.errorMessage = err;
          return EMPTY;
        })
      );

  constructor(private productService: ProductService,
              private productCategoryService: ProductCategoryService) { }


  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId)
  }
}
