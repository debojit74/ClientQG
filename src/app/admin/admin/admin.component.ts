import { Users } from './../../Models/user';
import { AccountService } from './../../Services/account.service';
import { CategoryService } from './../../Services/category.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/Services/user.service';
import { DataTableResource } from 'angular-4-data-table';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  dropDownValues = [
    {Name: 'Select'},
    {Name: 'User'},
    {Name: 'Account'},
    {Name: 'Category'}
  ]

  users : Users[];
  accounts : any[];
  categories : any[] = [];
  display : any;
  displaySearchBox : boolean = false;
  tableResource: DataTableResource<any>;
  displayTableForUser : boolean = false;
  displayTableForCategory : boolean = false;
  displayTableForAccount : boolean = false;
  items = [];
  itemCount: number; 
  addUserForm : boolean = false;
  addAccountForm : boolean = false;
  addCategoryForm : boolean = false;
  displayDropdown;
  addDropdown;

  constructor(
    private userService : UserService,
    private categoryService : CategoryService,
    private accountService : AccountService) {
      this.displayDropdown = this.dropDownValues[0]
      this.addDropdown = this.dropDownValues[0]
    }

  ngOnInit() {
    this.accountService.getAccounts().take(1).subscribe(data => {
      this.accounts = data.json();
    });
  }

  onDisplayDropDownChanged(value : any) {
    value = value.Name;
    this.addDropdown = this.dropDownValues[0];
    this.addUserForm = false;
    this.addAccountForm = false;
    this.addCategoryForm = false;

    if(value === 'User'){
      this.displaySearchBox = true;
      this.displayTableForUser = true;
      this.displayTableForAccount = false;
      this.displayTableForCategory = false;    
    }
    else if(value === 'Account'){
      this.displaySearchBox = false;
      this.displayTableForUser = false;
      this.displayTableForAccount = true;
      this.displayTableForCategory = false;    
    }
    else if(value === 'Category'){
      this.displaySearchBox = false;
      this.displayTableForUser = false;
      this.displayTableForAccount = false;
      this.displayTableForCategory = true;    
    }
    else{
      this.displaySearchBox = false;
      this.displayTableForUser = false;
      this.displayTableForAccount = false;
      this.displayTableForCategory = false;    
    }
    this.getData(value);
  }

  private getData(value : string) {
    if(value === 'User'){
      this.userService.getUsers().take(1).subscribe(data => {
        this.users = data.json();
        this.initializeTable(this.users);
      });
    }
    else if(value === 'Account'){
      this.initializeTable(this.accounts);
    }
    else if(value === 'Category'){
      this.categoryService.getCategories().take(1).subscribe(data => {
        this.categories = data.json();
        this.initializeTable(this.categories);
      })
    }
  }

  private initializeTable(data  : any){
    this.tableResource = new DataTableResource(data);
    this.tableResource.query({ offset: 0 })
      .then(items => this.items = items);
    this.tableResource.count()
      .then(count => this.itemCount = count);
  }

  reloadItems(params) {
    if (!this.tableResource) return;

    this.tableResource.query(params)
      .then(items => this.items = items);    
  }

  filter(query: string) { 
    let filteredProducts = (query) ?
      this.users.filter(p => p.firstName.toLowerCase().includes(query.toLowerCase())) :
      this.users;

    this.initializeTable(filteredProducts);
  }

  onAddDropDownChanged(value : any) {
    value = value.Name;
    this.displayDropdown = this.dropDownValues[0];
    this.displaySearchBox = false;
    this.displayTableForUser = false;
    this.displayTableForAccount = false;
    this.displayTableForCategory = false;

    if(value == 'User'){
      this.addUserForm = true;
      this.addAccountForm = false;
      this.addCategoryForm = false;
    }
    else if(value == 'Account'){
      this.addUserForm = false;
      this.addAccountForm = true;
      this.addCategoryForm = false;
    }
    else if(value === 'Category'){
      this.addUserForm = false;
      this.addAccountForm = false;
      this.addCategoryForm = true;
    }
    else{
      this.addUserForm = false;
      this.addAccountForm = false;
      this.addCategoryForm = false;
    }
  }
  SaveUser(data : any){
    let user = {
      globalId: data.globalId,
      accountType: data.accountType,
      firstName: data.firstName,
      lastName: data.lastName,
      isAdmin: data.isAdmin
    }

    this.userService.create(user).take(1).subscribe(data => {
      if(data.json()){
        this.userService.getUsers().take(1).subscribe(data => {
          this.users = data.json();
        });
        alert("User added sucessfully.")
        this.displayDropdown = this.dropDownValues[1];
        this.onDisplayDropDownChanged(this.displayDropdown);
      }     
      else
        alert("Error occured.")
    });
  }

  SaveAccount(data : any){
    this.accountService.create(data.accountType).take(1).subscribe(data => {
      if(data.json()){
        this.accountService.getAccounts().take(1).subscribe(data => {
          this.accounts = data.json();
        });
        alert("Account added sucessfully.")
        this.displayDropdown = this.dropDownValues[2];
        this.onDisplayDropDownChanged(this.displayDropdown);
      }     
      else
        alert("Error occured.")
    });
  }

  SaveCategory(data : any){
    this.categoryService.create(data.categoryType).take(1).subscribe(data => {
      if(data.json()){
        this.categoryService.getCategories().take(1).subscribe(data => {
          this.accounts = data.json();
        });        
        alert("Category added sucessfully.")
        this.displayDropdown = this.dropDownValues[3];
        this.onDisplayDropDownChanged(this.displayDropdown);
      }     
      else
        alert("Error occured.")
    });
  }

}
