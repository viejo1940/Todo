'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';

const SignUpSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name is too short')
    .max(50, 'First name is too long')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name is too short')
    .max(50, 'Last name is too long')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: SignUpSchema,
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const { confirmPassword, ...registrationData } = values;
        await authService.register(registrationData);
        toast.success('Account created successfully!');
        router.push('/dashboard');
      } catch (error: any) {
        toast.error(error.message || 'Failed to create account');
      }
    },
  });

  const isFormValid = formik.isValid && Object.keys(formik.touched).length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Card className="w-full max-w-[400px] shadow-none border-0">
        <CardHeader className="space-y-1.5 pb-4">
          <CardTitle className="text-center text-2xl font-semibold">Sign up</CardTitle>
          <CardDescription className="text-center text-gray-500 text-sm">
            Create an account to start using todo list
          </CardDescription>
        </CardHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <CardContent className="space-y-4 pb-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm mb-1">First name</div>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                  className={`h-10 ${
                    formik.touched.firstName && formik.errors.firstName 
                      ? 'border-red-500 focus-visible:ring-red-200' 
                      : 'border-gray-200 focus-visible:ring-gray-100'
                  }`}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="flex items-center text-red-500 text-xs mt-1">
                    <span>⚠️ {formik.errors.firstName}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-sm mb-1">Last name</div>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                  className={`h-10 ${
                    formik.touched.lastName && formik.errors.lastName 
                      ? 'border-red-500 focus-visible:ring-red-200' 
                      : 'border-gray-200 focus-visible:ring-gray-100'
                  }`}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="flex items-center text-red-500 text-xs mt-1">
                    <span>⚠️ {formik.errors.lastName}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm mb-1">Email address</div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="john.doe@example.com"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`h-10 ${
                  formik.touched.email && formik.errors.email 
                    ? 'border-red-500 focus-visible:ring-red-200' 
                    : 'border-gray-200 focus-visible:ring-gray-100'
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="flex items-center text-red-500 text-xs mt-1">
                  <span>⚠️ {formik.errors.email}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm mb-1">Password</div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className={`h-10 ${
                    formik.touched.password && formik.errors.password 
                      ? 'border-red-500 focus-visible:ring-red-200' 
                      : 'border-gray-200 focus-visible:ring-gray-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-0.5"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="flex items-center text-red-500 text-xs mt-1">
                  <span>⚠️ {formik.errors.password}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm mb-1">Confirm password</div>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  className={`h-10 ${
                    formik.touched.confirmPassword && formik.errors.confirmPassword 
                      ? 'border-red-500 focus-visible:ring-red-200' 
                      : 'border-gray-200 focus-visible:ring-gray-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-0.5"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className="flex items-center text-red-500 text-xs mt-1">
                  <span>⚠️ {formik.errors.confirmPassword}</span>
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-10 bg-gray-900 hover:bg-gray-800 text-white transition-colors"
              disabled={!isFormValid || formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <div className="flex items-center justify-center">
                  <span className="mr-2">Creating account</span>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                </div>
              ) : (
                'Sign up'
              )}
            </Button>

            <div className="text-center">
              <Link 
                href="/signin" 
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
} 