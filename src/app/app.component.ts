import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
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
export class AppComponent {
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
    this.errorSub = this.productService.error.subscribe((message) => {
      this.errorMessage = message;
    })
  }

  onProductsFetch() {
    this.fetchProducts();
  }

  onProductCreate(products: { pName: string, desc: string, price: string }) {
    // if (!this.editMode)
    //   this.productService.createProduct(products);
    // else
    //   this.productService.updateProduct(this.currentProductId, products);
    console.log(products);
    let header = new HttpHeaders({ 'myHeader': 'sachin' });
    this.http.post<{ name: string }>('https://demoserver2223-default-rtdb.firebaseio.com/products.json', JSON.stringify(products), { headers: header }).subscribe({
      next: (res) => {
        // console.log(res);
      }
    });
    setTimeout(() => {
      this.onProductsFetch();
    }, 1000);
  }

  private fetchProducts() {
    // this.isFetching = true;
    // this.productService.fetchProduct().subscribe((products) => {
    //   this.allProducts = products;
    //   this.isFetching = false;
    // }, (err) => {
    //   this.errorMessage = err.message;
    // })
    this.http.get<{ [key: string]: Product }>('https://demoserver2223-default-rtdb.firebaseio.com/products.json')
      .pipe(map((res) => {
        let products: Product[] = [];
        // for (const key in res) {
        //   if (res.hasOwnProperty(key)) {
        //     products.push({ ...res[key], id: key });
        //   }
        // }
        for (const [key, value] of Object.entries(res)) {
          products.push({ ...value, id: key });
        };
        return products;
      }))
      .subscribe({
        next: (products) => {
          this.allProducts = [...products];
          console.log(this.allProducts);
        }
      });
  }

  onDeleteProduct(id: string) {
    this.productService.deleteProduct(id);
  }

  onDeleteAllProducts() {
    this.productService.deleteAllProducts();
  }

  onEditClicked(id: string) {
    this.currentProductId = id;
    //Get the product based on the id
    let currentProduct = this.allProducts.find((p) => { return p.id === id });
    //console.log(this.form);

    //Populate the form with the product details
    this.form.setValue({
      // pName: currentProduct.pName,
      // desc: currentProduct.desc,
      // price: currentProduct.price
    });

    //Change the button value to update product
    this.editMode = true;
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}