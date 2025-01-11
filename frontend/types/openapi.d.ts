/* eslint-disable */
/* prettier-ignore-start */
/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/auth/signup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Signup */
        post: operations["signup_auth_signup_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Login */
        post: operations["login_auth_login_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/signup_verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Signup Verify */
        post: operations["signup_verify_auth_signup_verify_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/activate_account": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Activate Account */
        post: operations["activate_account_auth_activate_account_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/forgot_password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Forgot Password */
        post: operations["forgot_password_auth_forgot_password_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/reset_password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Reset Password */
        post: operations["reset_password_auth_reset_password_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/resend_verification_code": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Resend Verification Code */
        post: operations["resend_verification_code_auth_resend_verification_code_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/activate_account_verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Activate Account Verify */
        post: operations["activate_account_verify_auth_activate_account_verify_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/account/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Account Info */
        get: operations["get_account_info_account_me_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/account/tenants": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Account Tenants */
        get: operations["get_account_tenants_account_tenants_get"];
        put?: never;
        /** Create Tenant */
        post: operations["create_tenant_account_tenants_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/account/tenants/{tenant_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update Tenant */
        put: operations["update_tenant_account_tenants__tenant_id__put"];
        post?: never;
        /** Delete Tenant */
        delete: operations["delete_tenant_account_tenants__tenant_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/account/tenants/{tenant_id}/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Add Tenant User */
        post: operations["add_tenant_user_account_tenants__tenant_id__users_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/account/tenants/{tenant_id}/users/{user_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update User Role */
        put: operations["update_user_role_account_tenants__tenant_id__users__user_id__put"];
        post?: never;
        /** Remove Tenant User */
        delete: operations["remove_tenant_user_account_tenants__tenant_id__users__user_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Health Check */
        get: operations["health_check_api_health_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** AccountResponse */
        AccountResponse: {
            /** Id */
            id: string;
            /**
             * Email
             * Format: email
             */
            email: string;
            /** Name */
            name: string;
            /** Language */
            language: string;
            /** Status */
            status: string;
            /** Last Login At */
            last_login_at?: string | null;
            /** Last Login Ip */
            last_login_ip?: string | null;
        };
        /**
         * AccountTokenType
         * @enum {string}
         */
        AccountTokenType: "signup_email" | "activate_account_email" | "reset_password_email";
        /** ActivateAccountRequest */
        ActivateAccountRequest: {
            /** Email */
            email: string;
            /** Language */
            language?: string | null;
        };
        /** ActivateAccountResponse */
        ActivateAccountResponse: {
            /** Token */
            token: string;
        };
        /** ActivateAccountVerifyRequest */
        ActivateAccountVerifyRequest: {
            /** Token */
            token: string;
            /** Code */
            code: string;
        };
        /** ActivateAccountVerifyResponse */
        ActivateAccountVerifyResponse: {
            /** Access Token */
            access_token: string;
        };
        /** ForgotPasswordRequest */
        ForgotPasswordRequest: {
            /**
             * Email
             * Format: email
             */
            email: string;
        };
        /** ForgotPasswordResponse */
        ForgotPasswordResponse: {
            /** Token */
            token: string;
        };
        /** HTTPValidationError */
        HTTPValidationError: {
            /** Detail */
            detail?: components["schemas"]["ValidationError"][];
        };
        /** LoginRequest */
        LoginRequest: {
            /**
             * Email
             * Format: email
             */
            email: string;
            /** Password */
            password: string;
            /** Language */
            language?: string | null;
        };
        /** LoginResponse */
        LoginResponse: {
            /** Access Token */
            access_token: string;
            /**
             * Token Type
             * @default bearer
             */
            token_type: string;
        };
        /** ResendVerificationCodeRequest */
        ResendVerificationCodeRequest: {
            /**
             * Email
             * Format: email
             */
            email: string;
            code_type: components["schemas"]["AccountTokenType"];
        };
        /** ResendVerificationCodeResponse */
        ResendVerificationCodeResponse: {
            /** Token */
            token: string;
        };
        /** ResetPasswordRequest */
        ResetPasswordRequest: {
            /** Token */
            token: string;
            /** Code */
            code: string;
            /** New Password */
            new_password: string;
        };
        /** ResetPasswordResponse */
        ResetPasswordResponse: {
            /** Access Token */
            access_token: string;
        };
        /** ResponseModel */
        ResponseModel: {
            /**
             * Code
             * @default 0
             */
            code: string;
            /**
             * Msg
             * @default success
             */
            msg: string;
            /** Data */
            data: unknown;
        };
        /** ResponseModel[AccountResponse] */
        ResponseModel_AccountResponse_: {
            /**
             * Code
             * @default 0
             */
            code: string;
            /**
             * Msg
             * @default success
             */
            msg: string;
            data: components["schemas"]["AccountResponse"];
        };
        /** ResponseModel[ActivateAccountResponse] */
        ResponseModel_ActivateAccountResponse_: {
            /**
             * Code
             * @default 0
             */
            code: string;
            /**
             * Msg
             * @default success
             */
            msg: string;
            data: components["schemas"]["ActivateAccountResponse"];
        };
        /** ResponseModel[ActivateAccountVerifyResponse] */
        ResponseModel_ActivateAccountVerifyResponse_: {
            /**
             * Code
             * @default 0
             */
            code: string;
            /**
             * Msg
             * @default success
             */
            msg: string;
            data: components["schemas"]["ActivateAccountVerifyResponse"];
        };
        /** ResponseModel[ForgotPasswordResponse] */
        ResponseModel_ForgotPasswordResponse_: {
            /**
             * Code
             * @default 0
             */
            code: string;
            /**
             * Msg
             * @default success
             */
            msg: string;
            data: components["schemas"]["ForgotPasswordResponse"];
        };
        /** ResponseModel[LoginResponse] */
        ResponseModel_LoginResponse_: {
            /**
             * Code
             * @default 0
             */
            code: string;
            /**
             * Msg
             * @default success
             */
            msg: string;
            data: components["schemas"]["LoginResponse"];
        };
        /** ResponseModel[ResendVerificationCodeResponse] */
        ResponseModel_ResendVerificationCodeResponse_: {
            /**
             * Code
             * @default 0
             */
            code: string;
            /**
             * Msg
             * @default success
             */
            msg: string;
            data: components["schemas"]["ResendVerificationCodeResponse"];
        };
        /** ResponseModel[ResetPasswordResponse] */
        ResponseModel_ResetPasswordResponse_: {
            /**
             * Code
             * @default 0
             */
            code: string;
            /**
             * Msg
             * @default success
             */
            msg: string;
            data: components["schemas"]["ResetPasswordResponse"];
        };
        /** ResponseModel[SignupResponse] */
        ResponseModel_SignupResponse_: {
            /**
             * Code
             * @default 0
             */
            code: string;
            /**
             * Msg
             * @default success
             */
            msg: string;
            data: components["schemas"]["SignupResponse"];
        };
        /** ResponseModel[SignupVerifyResponse] */
        ResponseModel_SignupVerifyResponse_: {
            /**
             * Code
             * @default 0
             */
            code: string;
            /**
             * Msg
             * @default success
             */
            msg: string;
            data: components["schemas"]["SignupVerifyResponse"];
        };
        /** ResponseModel[TenantResponse] */
        ResponseModel_TenantResponse_: {
            /**
             * Code
             * @default 0
             */
            code: string;
            /**
             * Msg
             * @default success
             */
            msg: string;
            data: components["schemas"]["TenantResponse"];
        };
        /** ResponseModel[UserResponse] */
        ResponseModel_UserResponse_: {
            /**
             * Code
             * @default 0
             */
            code: string;
            /**
             * Msg
             * @default success
             */
            msg: string;
            data: components["schemas"]["UserResponse"];
        };
        /** ResponseModel[list[TenantResponse]] */
        ResponseModel_list_TenantResponse__: {
            /**
             * Code
             * @default 0
             */
            code: string;
            /**
             * Msg
             * @default success
             */
            msg: string;
            /** Data */
            data: components["schemas"]["TenantResponse"][];
        };
        /** SignupRequest */
        SignupRequest: {
            /** Name */
            name: string;
            /**
             * Email
             * Format: email
             */
            email: string;
            /** Password */
            password: string;
            /** Language */
            language?: string | null;
            /** Invite Code */
            invite_code?: string | null;
        };
        /** SignupResponse */
        SignupResponse: {
            /** Token */
            token: string;
        };
        /** SignupVerifyRequest */
        SignupVerifyRequest: {
            /** Token */
            token: string;
            /** Code */
            code: string;
        };
        /** SignupVerifyResponse */
        SignupVerifyResponse: {
            /** Access Token */
            access_token: string;
            /**
             * Token Type
             * @default bearer
             */
            token_type: string;
        };
        /** TenantCreateRequest */
        TenantCreateRequest: {
            /** Name */
            name: string;
        };
        /** TenantResponse */
        TenantResponse: {
            /** Id */
            id: string;
            /** Name */
            name: string;
        };
        /** TenantUpdateRequest */
        TenantUpdateRequest: {
            /** Name */
            name: string;
        };
        /**
         * TenantUserRole
         * @enum {string}
         */
        TenantUserRole: "owner" | "admin" | "member" | "guest";
        /** UserAddRequest */
        UserAddRequest: {
            /**
             * Email
             * Format: email
             */
            email: string;
            /** @default member */
            role: components["schemas"]["TenantUserRole"];
        };
        /** UserResponse */
        UserResponse: {
            /** Id */
            id: string;
            /** Account Id */
            account_id: string;
            /** Tenant Id */
            tenant_id: string;
            role: components["schemas"]["TenantUserRole"];
        };
        /** UserRoleUpdateRequest */
        UserRoleUpdateRequest: {
            role: components["schemas"]["TenantUserRole"];
        };
        /** ValidationError */
        ValidationError: {
            /** Location */
            loc: (string | number)[];
            /** Message */
            msg: string;
            /** Error Type */
            type: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    signup_auth_signup_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SignupRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseModel_SignupResponse_"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    login_auth_login_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseModel_LoginResponse_"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    signup_verify_auth_signup_verify_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SignupVerifyRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseModel_SignupVerifyResponse_"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    activate_account_auth_activate_account_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ActivateAccountRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseModel_ActivateAccountResponse_"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    forgot_password_auth_forgot_password_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ForgotPasswordRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseModel_ForgotPasswordResponse_"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    reset_password_auth_reset_password_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResetPasswordRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseModel_ResetPasswordResponse_"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    resend_verification_code_auth_resend_verification_code_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResendVerificationCodeRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseModel_ResendVerificationCodeResponse_"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    activate_account_verify_auth_activate_account_verify_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ActivateAccountVerifyRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseModel_ActivateAccountVerifyResponse_"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_account_info_account_me_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseModel_AccountResponse_"];
                };
            };
        };
    };
    get_account_tenants_account_tenants_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseModel_list_TenantResponse__"];
                };
            };
        };
    };
    create_tenant_account_tenants_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TenantCreateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseModel_TenantResponse_"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_tenant_account_tenants__tenant_id__put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                tenant_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TenantUpdateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseModel_TenantResponse_"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_tenant_account_tenants__tenant_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                tenant_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseModel"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    add_tenant_user_account_tenants__tenant_id__users_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                tenant_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UserAddRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseModel_UserResponse_"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_user_role_account_tenants__tenant_id__users__user_id__put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                tenant_id: string;
                user_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UserRoleUpdateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseModel_UserResponse_"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    remove_tenant_user_account_tenants__tenant_id__users__user_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                tenant_id: string;
                user_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseModel"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    health_check_api_health_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
}

/* prettier-ignore-end */