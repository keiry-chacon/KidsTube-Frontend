import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HamburgerMenuComponent } from '../components/hamburger-menu/hamburger-menu.component';

@NgModule({
  imports: [
    CommonModule,
    HamburgerMenuComponent  
  ],
  exports: [
    HamburgerMenuComponent 
  ]
})
export class SharedModule { }