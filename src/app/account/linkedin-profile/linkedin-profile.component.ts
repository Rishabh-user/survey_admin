import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-linkedin-profile',
  templateUrl: './linkedin-profile.component.html',
  styleUrls: ['./linkedin-profile.component.css']
})


export class LinkedinProfileComponent implements OnInit {
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');
    const error = this.route.snapshot.queryParamMap.get('error');

    if (error) {
      this.errorMessage = 'Failed to authenticate with LinkedIn. Please try again.';
      this.loading = false;
    } else if (code) {
      this.authService.getAccessToken(code).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']); // Redirect to your desired page
        },
        error: () => {
          this.errorMessage = 'An error occurred while processing your request.';
          this.loading = false;
        }
      });
    }
  }

}
