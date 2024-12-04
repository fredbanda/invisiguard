"use client";

import { LoginInput, LoginSchema } from "@/validators/login-validater";
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
import { loginUserAction } from "@/actions/login-user-actions";
import { toast } from "sonner";


export const LoginForm = () => {
  const form = useForm<LoginInput>({
    resolver: valibotResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit, control, formState, setError} = form;

  const submit = async (values: LoginInput) => {
    const res = await loginUserAction(values);

    if (res.success) {
      window.location.href = "/dashboard";
    } else {
      
      switch (res.statusCode){
        case 500:
          default:
            const error = res.error || "Internal server error";
            toast.error(error, {
              position: "top-right",
            });
            setError("password", {message: error})
      }
     }
  };

  return (
    <CardWrapper
      headerLabel="Welcome back!"
      backButtonLabel="Don't have an account? Register Here"
      backButtonHref="/auth/register"
      showSocialButton
    >
      <Form {...form}>
        <form
          onSubmit={handleSubmit(submit)}
          className="w-full max-w-[600px] space-y-4"
        >
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
          <Button
            variant="custom"
            size="default"
            type="submit"
            className="w-full"
            disabled={formState.isSubmitting}
          >
            Login
          </Button>
        </form>
        
      </Form>
      
    </CardWrapper>
  );
};
