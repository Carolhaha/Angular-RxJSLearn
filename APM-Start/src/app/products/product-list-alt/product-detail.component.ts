import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ProductService } from '../product.service';
import { EMPTY, combineLatest } from 'rxjs';
import { catchError, map, filter } from 'rxjs/operators';
import { Product } from '../product';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  errorMessage = '';

  product$ = this.productService.selectedProduct$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );
  pageTitle$ = this.product$
		.pipe(
			map((p:Product)=>
				p ? `Product Detail for: ${p.productName}`:null
			)
	);
  productSuppliers$ = this.productService.selectedProductSuppliers$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  // vm$ = combineLatest([
  //   this.product$,
  //   this.productSuppliers$,
  //   this.pageTitle$
  // ]).pipe(
  //   filter(([product])=> Boolean(product)),
  //   map(([product,this.productSuppliers,pageTitle])=>
  //   ({product,productSuppliers,pageTitle}))
  // );
  vm$ = combineLatest([
    this.product$,
    this.productSuppliers$,
    this.pageTitle$
  ])
    .pipe(
      filter(([product]) => Boolean(product)),
      map(([product, productSuppliers, pageTitle]) =>
        ({ product, productSuppliers, pageTitle }))
    );

  errorMessageSubject: any;
  constructor(private productService: ProductService) { }
}
