import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { SignUpComponent } from "./signup/signup.component";
import { CommonModule } from "@angular/common";
import { AngularMatreailModule } from "../angular-matireal.module";
import { FormsModule } from "@angular/forms";
import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent,
  ],
  imports: [
    CommonModule,
    AngularMatreailModule,
    FormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule {

}
