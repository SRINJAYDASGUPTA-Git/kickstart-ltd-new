"use client";
import { UploadUserData, convertEmailToDomain } from "@/utils/UpdateData";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { experience } from "@/constants";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
const Onboarding = () => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const {user} = useUser();
  const title = "Tell us about Yourself";
  const subtitle =
    "Let's get to know you! Share a few details, and let's start your math journey together!";
  const onboardingFormSchema = z.object({
    fullName: z.string().min(1, { message: "Full Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phoneNumber: z.string().min(1, { message: "Phone Number is required" }),
    school: z.string().min(1, { message: "School is required" }),
    std: z.string().min(1, { message: "Class is required" }),
  });
  const form = useForm<z.infer<typeof onboardingFormSchema>>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      school: "",
    },
  });
  if(!user)
    return <div> Loading...</div>
  function onSubmit(values: z.infer<typeof onboardingFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    UploadUserData(convertEmailToDomain(values.email),values.fullName, user?.imageUrl);
    router.push("/");
  }
  return (
    <div className="w-full flex-center">
      <div className="w-[95%] md:w-[90%] flex-between bg-[#FEF5EA] rounded-xl">
        {/* Onboarding Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full md:w-1/4 flex flex-col gap-10 p-8"
          >
            <span className="text-[16px] md:text-5xl font-bold">{title}</span>
            <span className="text-[13px] md:text-3xl">{subtitle}</span>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      className="p-3 rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="johndoe@example.com"
                      {...field}
                      className="p-3 rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1234567890"
                      {...field}
                      className="p-3 rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Example High School"
                      {...field}
                      className="p-3 rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="std"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Class</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className={cn(
                            "w-full justify-start text-[#333] flex-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? experience.find(
                                (classD) => classD === field.value
                              )
                            : "Select Class"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[80vw] md:w-[19vw] p-3 text-[#333] ">
                      <Command>
                        <CommandInput
                          placeholder="Search Class..."
                          className="h-9 p-1 text-[#333] "
                        />
                        <CommandList>
                          <CommandEmpty>No framework found.</CommandEmpty>
                          <CommandGroup>
                            {experience.map((classD, index) => (
                              <CommandItem
                                value={classD}
                                key={index}
                                onSelect={() => {
                                  form.setValue("std", classD);
                                }}
                              >
                                {classD}
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    classD === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
        {/* Image */}
      </div>
    </div>
  );
};

export default Onboarding;