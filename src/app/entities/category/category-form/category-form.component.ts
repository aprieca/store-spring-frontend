import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../service/category.service";
import {ActivatedRoute} from "@angular/router";
import {Category} from "../model/category.model";

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit{

  constructor(private categoryService:CategoryService, private router:ActivatedRoute) {
  }

  categoryId?:number;
  category?: Category;

  ngOnInit(): void {
    if(this.router.snapshot.paramMap.get("categoryId")){
      this.categoryId = +this.router.snapshot.paramMap.get("categoryId")!;
      this.getCategoryById(this.categoryId)
    }


  }

  private getCategoryById(categoryId: number) {
    this.categoryService.getCategoryById(categoryId).subscribe({
      next: (categoryRequest) => {
        this.category = categoryRequest;
      },
      error: (err) => {
        this.handleError(err)
      }
    })
  }

  public updateCategory() {
    this.categoryService.updateCategory(this.category!).subscribe({
        next: (updateResponse) => {
          console.log("Category Updated")
          console.log(updateResponse)
        },
        error: (err):void => {
          this.handleError(err)
        }
      },
    )
  }

  private handleError(err: any) {
    console.log(err);
  }

  includeImageInCategory(event: any): void {
    const inputFile = event.target as HTMLInputElement;
    const file: File | null = inputFile.files?.item(0) ?? null;

    this.readFileAsString(file!).then(
      (result) => {
        const imageType: string = this.getImageType(result);
        console.log(imageType);
        const imageBase64: string = this.getImageBase64(result);
        console.log(imageBase64)

        this.category!.image = imageBase64;
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


