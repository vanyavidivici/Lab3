import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AccountService } from './core/services/account.service';
import { FundraisingService } from './core/services/fundraising.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'social-web-project';

  @ViewChild(MatSidenav)
  isMobile = true;
  isCollapsed = false;
  currentLanguage: string = '';
  isAuthenticated: boolean = false;

  protected selected: number = -1;

  constructor(
    private accountService: AccountService,
    private fundraisingService: FundraisingService,
  ) {
    this.isUserAuthenticated();
  }

  ngOnInit(): void {
    this.isUserAuthenticated();
    if (this.isAuthenticated) {
      this.getBalance();
    }
  }

  isUserAuthenticated(): boolean {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      this.isAuthenticated = false;
      return false;
    }

    this.isAuthenticated = true;

    return true;
  }

  getCurrentUserName(): string {
    const email = localStorage.getItem('username');
    return email ? email : '';
  }

  getBalance(): number {
    var balance = Number(localStorage.getItem('balance'));
    if (!balance) {
      this.fundraisingService.getBalance().subscribe(
        (response) => {
          balance = response;
          localStorage.setItem('balance', balance.toString());
        },
        (error) => {
          console.error('Error fetching balance:', error);
        }
      );
    }
    return balance;
  }

  logout = (): void => {
    localStorage.removeItem('access_token');
    this.accountService.logout().subscribe({
      next: () => {
        window.location.reload();
      }
    });

  }
}
