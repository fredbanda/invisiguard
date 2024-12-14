"use client";

import {
  UpdateUserInfoInput,
  UpdateUserInfoSchema,
} from "@/validators/update-user-info-validator";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { type User } from "next-auth";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImPencil2 } from "react-icons/im";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateUserInfoAction } from "@/actions/updateUserInfoAction";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type UpdateUserInfoFormProps = {
  user: User;
};

export const UpdateUserInfoForm = ({ user }: UpdateUserInfoFormProps) => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<UpdateUserInfoInput>({
    resolver: valibotResolver(UpdateUserInfoSchema),
    defaultValues: {
      id: user.id,
      name: user.name || "",
      image: user.image || "",
      company: user.company || "",
      phone: user.phone || "",
    },
  });

  const { handleSubmit, setError, formState, control } = form;

  const submit = async (values: UpdateUserInfoInput) => {
    try {
      setLoading(true);
      const res = await updateUserInfoAction(values);

      if (res.success) {
        const updatedUser = res.data;

        if (session?.user) {
          await update({
            user: {
              ...session.user,
              name: updatedUser.name,
              image: updatedUser.image,
              company: updatedUser.company,
              phone: updatedUser.phone,
            },
          });
        }

        toast.success("User information updated successfully", {
          position: "top-right",
        });
        router.push("/dashboard");
      } else {
        if (res.statusCode === 400 && res.error?.nested) {
          Object.entries(res.error.nested).forEach(([key, value]) => {
            setError(key as keyof UpdateUserInfoInput, {
              message: value?.[0] || "Invalid input",
            });
          });
        } else {
          toast.error(
            typeof res.error === "string" ? res.error : "Internal server error",
            { position: "top-right" }
          );
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="bg-orange-600 transition-colors hover:bg-orange-600/80"
        >
          <ImPencil2 className="h-6 w-6" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Edit {user.name} &apos;s Information
          </DialogTitle>
          <DialogDescription className="text-center">
            Update your information {user.name}
          </DialogDescription>

          <div className="my-4 h-2 bg-muted" />
          <Form {...form}>
            <form
              onSubmit={handleSubmit(submit)}
              className="w-full max-w-[600px] space-y-4"
            >
              <FormField
                name="name"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Full Names</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="e.g. Shaka"
                        {...field}
                        disabled={formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="company"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="e.g. Shaka"
                        {...field}
                        disabled={formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="phone"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="e.g. Shaka"
                        {...field}
                        disabled={formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="image"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Change Image</FormLabel>
                    <FormControl>
                      <div className="image-update-container">
                        {/* Display the current image */}
                        {field.value && (
                          <div className="current-image-preview">
                            <Image
                              src={field.value}
                              alt="Current Image"
                              width={100}
                              height={100}
                            />
                          </div>
                        )}

                        {/* Input for updating image URL */}
                        <Input
                          type="text"
                          placeholder="Enter image URL"
                          {...field}
                          disabled={formState.isSubmitting}
                        />

                        {/* OR File Upload */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];

                              // Create a preview URL for the uploaded image
                              const reader = new FileReader();
                              reader.onload = () => {
                                field.onChange(reader.result); // Update the field value with the image preview
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          disabled={formState.isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField name="id" render={() => <FormMessage />} />

              <Button
                variant="custom"
                size="lg"
                type="submit"
                disabled={formState.isSubmitting}
                className="w-full"
              >
                Update Details
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
