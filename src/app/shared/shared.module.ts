import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HamburgerMenuComponent } from '../components/hamburger-menu/hamburger-menu.component';

@NgModule({
  declarations: [
    HamburgerMenuComponent 
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HamburgerMenuComponent 
  ]
})
export class SharedModule { }