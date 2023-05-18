import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Item} from "../model/item.model";

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) {
  }

  public getAllItems(page: number, size: number, sort: string, filters?:string): Observable<Item[]> {
    let urlEndpoint: string = "http://localhost:8082/store/items?page=" + page + "&size=" + size + "&sort" + sort;
    if(filters){
      urlEndpoint= urlEndpoint + "&filter=" + filters;
    }
    return this.http.get<Item[]>(urlEndpoint);
  }

  public deleteItem(itemIdToDelete: number):Observable<any> {
    let urlEndpoint: string = "http://localhost:8082/store/items/"+itemIdToDelete;
    return this.http.delete<Item[]>(urlEndpoint);
  }

  public getItemById(itemId: number):Observable<Item> {
    let urlEndpoint: string = "http://localhost:8082/store/items/"+itemId;
    return this.http.get<Item>(urlEndpoint);
  }

  public insertItem(item: Item):Observable<Item>{
    let urlEndpoint: string = "http://localhost:8082/store/items/";
    return this.http.post<Item>(urlEndpoint,item);
  }

  public updateItem(item: Item):Observable<Item>{
    let urlEndpoint: string = "http://localhost:8082/store/items/";
    return this.http.patch<Item>(urlEndpoint,item);
  }
}
