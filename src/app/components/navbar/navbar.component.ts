import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  public isUserAuthenticated: boolean = false;
  public username: string | null = null;

  constructor(private authService: AuthenticationService) {
    this.authService.authChanged.subscribe((res) => {
      this.isUserAuthenticated = res;
      if (this.isUserAuthenticated) {
        this.username = authService.getEmail();
      }
    });
  }

  logout() {
    this.authService.logOut();
  }
}
