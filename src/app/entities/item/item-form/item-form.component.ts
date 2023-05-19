import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ItemService} from "../service/item.service";
import {Item} from "../model/item.model";
import {Category} from "../../category/model/category.model";
import {CategoryService} from "../../category/service/category.service";


@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {

  mode: "NEW" | "UPDATE" = "NEW";
  itemId?: number;
  item?: Item;
  selectedCategory?: Category;
  categories: Category[] = [];

  constructor(private router: ActivatedRoute, private itemService: ItemService, private categoryService: CategoryService) {
  }

  ngOnInit(): void {

    const entryParams: string = this.router.snapshot.paramMap.get("itemId") ?? "new";
    if (entryParams !== "new") {
      this.itemId = +this.router.snapshot.paramMap.get("itemId")!
      this.mode = "UPDATE";
      this.getItemById(this.itemId);
    } else {
      this.mode = "NEW";
      this.initializeItem();
    }
  }

  saveItem() {
    if (this.mode === "NEW") {
      this.insertItem();
    }
    if (this.mode === "UPDATE") {
      this.updateItem();
    }
  }

  private insertItem() {
    this.itemService.insertItem(this.item!).subscribe({
        next: (insertResponse) => {
          console.log("Item Inserted")
          console.log(insertResponse)
        },
        error: (err) => {
          this.handleError(err)
        }
      },
    )
  }

  private updateItem() {
    this.itemService.updateItem(this.item!).subscribe({
        next: (updateResponse) => {
          console.log("Item Updated")
          console.log(updateResponse)
        },
        error: (err) => {
          this.handleError(err)
        }
      },
    )
  }

  private getItemById(itemId: number) {
    this.itemService.getItemById(itemId).subscribe({
      next: (itemRequest) => {
        this.item = itemRequest;
        this.selectedCategory = new Category(itemRequest.categoryId!, itemRequest.categoryName!)
      },
      error: (err) => {
        this.handleError(err)
      }
    })
  }

  private handleError(err: any) {
    console.log(err);
  }

  private initializeItem() {
    this.item = new Item(undefined, "", 0);
  }

  public getAllCategories(event?: any): void {
    let categorySearch: string | undefined;
    if (event?.query) {
      categorySearch = event.query;
    }
    this.categoryService.getAllCategories(categorySearch).subscribe({
      next: (categoriesFiltered) => {
        this.categories = categoriesFiltered
      },
      error: (error) => {
        this.handleError(error)
      }
    })
  }


  categorySelected() {
    this.item!.categoryId = this.selectedCategory!.id;
    this.item!.categoryName = this.selectedCategory!.name;
  }

  categoryUnselected() {
    this.item!.categoryId = undefined;
    this.item!.categoryName = undefined;
  }

  includeImageInItem(event: any): void {
    const inputFile = event.target as HTMLInputElement;
    const file: File | null = inputFile.files?.item(0) ?? null;

    this.readFileAsString(file!).then(
      (result) => {
        const imageType: string = this.getImageType(result);
        console.log(imageType);
        const imageBase64: string = this.getImageBase64(result);
        console.log(imageBase64)

        this.item!.image = imageBase64;
      },
      (error) => {
        console.log("No se pudo cargar la imagen")
      }
    )
  }

  private getImageType(imageString: string): string {
    const imageStingParts: string[] = imageString.split(",");
    if(imageStingParts.length == 2){
      return imageStingParts[0];
    }else{
      return ""
    }
  }

  private getImageBase64(imageString: string): string {
    const imageStingParts: string[] = imageString.split(",");
    if(imageStingParts.length == 2){
      return imageStingParts[1];
    }else{
      return ""
    }
  }

  private readFileAsString(file: File) {
    return new Promise<string>(function (resolve, reject) {
      let reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(this.result as string)
      }
    })
  }
}

