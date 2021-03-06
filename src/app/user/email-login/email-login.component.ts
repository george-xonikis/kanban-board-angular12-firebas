import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-email-login',
    templateUrl: './email-login.component.html',
    styleUrls: ['./email-login.component.scss']
})
export class EmailLoginComponent implements OnInit {
    form!: FormGroup;
    type: 'login' | 'signup' | 'reset' = 'signup';
    loading = false;
    serverMessage!: string;

    constructor(private fb: FormBuilder,
                private authService: AuthService) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: [
                '',
                [Validators.minLength(6), Validators.required]
            ],
            passwordConfirm: ['', []]
        });
    }

    changeType(value: 'login' | 'signup' | 'reset'): void {
        this.type = value;
    }

    get isLogin(): boolean {
        return this.type === 'login';
    }

    get isSignup(): boolean {
        return this.type === 'signup';
    }

    get isPasswordReset(): boolean {
        return this.type === 'reset';
    }

    get email(): AbstractControl | null {
        return this.form.get('email');
    }

    get password(): AbstractControl | null {
        return this.form.get('password');
    }

    get passwordConfirm(): AbstractControl | null {
        return this.form.get('passwordConfirm');
    }

    get passwordDoesMatch(): boolean {
        if (this.type !== 'signup') {
            return true;
        } else {
            return this.password?.value === this.passwordConfirm?.value;
        }
    }

    async onSubmit(): Promise<void> {
        this.loading = true;

        const email = this.email?.value;
        const password = this.password?.value;

        try {
            if (this.isLogin) {
                await this.authService.signIn(email, password);
            }
            if (this.isSignup) {
                await this.authService.signUp(email, password);
            }
            if (this.isPasswordReset) {
                await this.authService.resetPassword(email);
                this.serverMessage = 'Check your email';
            }
        } catch (err) {
            this.serverMessage = err;
        }

        this.loading = false;
    }
}
