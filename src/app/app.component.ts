import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { Product } from './model/products';
import { ProductService } from './Service/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'HttpRequest';
  allProducts: Product[] = [];
  isFetching: boolean = false;
  editMode: boolean = false;
  currentProductId!: string;
  errorMessage!: string;
  errorSub: Subscription = new Subscription;

  @ViewChild('productsForm')
  form!: NgForm;

  constructor(private productService: ProductService, private http: HttpClient) {

  }

  ngOnInit() {
    this.fetchProducts();
    this.errorSub = this.productService.errorSubj.subscribe((message) => {
      this.errorMessage = message;
    })
  }

  onProductsFetch() {
    this.fetchProducts();
  }

  onProductCreate(products: { pName: string, desc: string, price: string }) {
    if (!this.editMode)
      this.productService.createProduct(products);
    else
      this.productService.updateProduct(this.currentProductId, products);
    // console.log(products);
    // let header = new HttpHeaders({ 'myHeader': 'sachin' });
    // this.http.post<{ name: string }>('https://demoserver2223-default-rtdb.firebaseio.com/products.json', JSON.stringify(products), { headers: header }).subscribe({
    //   next: (res) => {
    //     // console.log(res);
    //     this.onProductsFetch();
    //   }
    // });
  }

  private fetchProducts() {
    this.isFetching = true;
    this.productService.fetchProduct().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.isFetching = false;
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = `ERROR: ${err.status} - ${err.statusText
          } - ${err.error['error']}.`;
      }
    })

    // this.isFetching = true;
    // this.http.get<{ [key: string]: Product }>('https://demoserver2223-default-rtdb.firebaseio.com/products.json')
    //   .pipe(map((res) => {
    //     let products: Product[] = [];
    //     // for (const key in res) {
    //     //   if (res.hasOwnProperty(key)) {
    //     //     products.push({ ...res[key], id: key });
    //     //   }
    //     // }
    //     if (res != null) {
    //       for (const [key, value] of Object.entries(res)) {
    //         products.push({ ...value, id: key });
    //       };
    //     }
    //     return products;
    //   }))
    //   .subscribe({
    //     next: (products) => {
    //       this.allProducts = [...products];
    //       console.log(this.allProducts);
    //       this.isFetching = false;
    //     }
    //   });
  }

  onDeleteProduct(id: any) {
    this.productService.deleteProduct(id);
    // this.http.delete('https://demoserver2223-default-rtdb.firebaseio.com/products/' + id + '.json')
    //   .subscribe({
    //     next: (res) => {
    //       // console.log(res);
    //       this.onProductsFetch();
    //     }
    //   })
  }

  onDeleteAllProducts() {
    this.productService.deleteAllProducts();
    // this.http.delete('https://demoserver2223-default-rtdb.firebaseio.com/products.json')
    //   .subscribe({
    //     next: (res) => {
    //       // console.log(res);
    //       this.onProductsFetch();
    //     }
    //   })
  }

  onEditClicked(id: any) {
    this.currentProductId = id;
    //Get the product based on the id
    let currentProduct = this.allProducts.find((p) => { return p.id === id }) as Product;
    console.log(currentProduct);

    //Populate the form with the product details
    this.form.control.patchValue({
      pName: currentProduct.pName,
      desc: currentProduct.desc,
      price: currentProduct.price
    });

    //Change the button value to update product
    this.editMode = true;
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}
