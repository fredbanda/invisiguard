"use client";

import { RegisterInput, RegisterSchema } from "@/validators/register-validater";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CardWrapper } from "./card-wrapper";
import { registerUserAction } from "@/actions/register-user-actions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const RegisterForm = () => {
  const [success, setSuccess] = useState(false);
  const router = useRouter()
  const form = useForm<RegisterInput>({
    resolver: valibotResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      image: "",
      password: "",
      confirm_password: "",
    },
  });
  const { handleSubmit, control, formState, setError } = form;

  const submit = async (values: RegisterInput) => {
    const res = await registerUserAction(values);

    if (res.success) {
      setSuccess(true);
      toast.success("User Created Successfully", {
        position: "top-right",
      });
    } else {
      switch (res.statusCode) {
        case 400:
          const nestedErrors = res.error.nested;

          for (const key in nestedErrors) {
            setError(key as keyof RegisterInput, {
              message: nestedErrors[key]?.[0],
            });
          }
          break;
        case 500:
        default:
          const error = res.error || "Internal server error";
          setError("confirm_password", { message: error });
          toast.error("Sorry the email is already registered.", {
            position: "top-right",
          });
      }
    }
  };

  useEffect(() => {
    if (success) {
      router.push("/auth/login");
    }
  }, [success, router]);

  return (
    <CardWrapper
      headerLabel="Create An Account"
      backButtonLabel="Already have an account? Sign in"
      backButtonHref="/auth/login"
      showSocialButton
    >
      <Form {...form}>
        <form
          onSubmit={handleSubmit(submit)}
          className="space-y-4 max-w-[600px] w-full"
        >
          <div className="flex space-x-4">
            <div className="flex-1 space-y-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Full Names</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g. Shaka" 
                      {...field}
                      disabled={formState.isSubmitting}
                       />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1 space-y-4">
              <FormField
                control={control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="e.g. The First Pitch"
                        {...field}
                        disabled={formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1 space-y-4">
              <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="e.g. 0123456789"
                        {...field}
                        disabled={formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="e.g. shaka@example.com"
                      {...field}
                      disabled={formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1 space-y-4">
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="e.g. ******"
                        {...field}
                        disabled={formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1 space-y-4">
              <FormField
                control={control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="e.g. *******"
                        {...field}
                        disabled={formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button
            variant="custom"
            size="default"
            type="submit"
            className="w-full"
            disabled={formState.isSubmitting}
          >
            Create Account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
