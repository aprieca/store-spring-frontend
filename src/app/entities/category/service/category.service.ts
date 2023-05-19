import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Category} from "../model/category.model";
import {Item} from "../../item/model/item.model";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  constructor(private http: HttpClient) {
  }

  public getAllCategories(partialName?: string): Observable<Category[]> {
    let urlEndpoint: string = "http://localhost:8082/store/categories";
    if (partialName) {
      urlEndpoint = urlEndpoint + "?partialName=" + partialName;
    }
    return this.http.get<Category[]>(urlEndpoint);
  }

  public getCategoryById(categoryId: number):Observable<Category> {
    let urlEndpoint: string = "http://localhost:8082/store/categories/"+categoryId;
    return this.http.get<Category>(urlEndpoint);
  }

  public deleteCategory(categoryToDelete: number):Observable<any> {
    let urlEndpoint: string = "http://localhost:8082/store/categories/"+categoryToDelete;
    return this.http.delete<Category[]>(urlEndpoint);
  }

  public updateCategory(category: Category):Observable<Category>{
    let urlEndpoint: string = "http://localhost:8082/store/categories";
    return this.http.patch<Category>(urlEndpoint,category);
  }
}

