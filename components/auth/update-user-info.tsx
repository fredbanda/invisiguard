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

type UpdateUserInfoFormProps = {
  user: User;
};

export const UpdateUserInfoForm = ({ user }: UpdateUserInfoFormProps) => {
  const { data: session, update } = useSession();
  const {
    id,
    name: defaultName,
    image: defaultImage,
    company: defaultCompany,
    phone: defaultPhone,
  } = user;

  const form = useForm<UpdateUserInfoInput>({
    resolver: valibotResolver(UpdateUserInfoSchema),
    defaultValues: {
      id,
      name: defaultName || "",
      image: defaultImage || "",
      company: defaultCompany || "",
      phone: defaultPhone || "",
    },
  });

  const { handleSubmit, control, formState, setError } = form;

  const submit = async (values: UpdateUserInfoInput) => {
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
      window.location.href = "/dashboard";
    } else {
      switch (res.statusCode) {
        case 400:
          const nestedErrors = res.error.nested;

          for (const key in nestedErrors) {
            setError(key as keyof UpdateUserInfoInput, {
              message: nestedErrors[key]?.[0],
            });
          }

          break;
        case 401:
        case 500:
        default:
          const error = res.error || "Internal server error";
          toast.error(error, {
            position: "top-right",
          });
      }
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
                control={control}
                name="name"
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
                control={control}
                name="company"
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
                control={control}
                name="phone"
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
                control={control}
                name="image"
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
                              style={{
                                maxWidth: "100px",
                                maxHeight: "100px",
                                objectFit: "cover",
                              }}
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
