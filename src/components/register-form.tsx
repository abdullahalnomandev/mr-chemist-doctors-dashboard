// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useToast } from "@/hooks/use-toast";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Loader2 } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// // import { registerAdmin } from "@/app/actions/auth"

// const registerSchema = z
//   .object({
//     name: z.string().min(2, { message: "Name must be at least 2 characters" }),
//     email: z.string().email({ message: "Please enter a valid email address" }),
//     phone: z.string().min(10, { message: "Please enter a valid phone number" }),
//     password: z
//       .string()
//       .min(6, { message: "Password must be at least 6 characters" }),
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   });

// type RegisterFormValues = z.infer<typeof registerSchema>;

// export function RegisterForm() {
//   // const [isLoading, setIsLoading] = useState(false);
//   // const router = useRouter();
//   // const { toast } = useToast();

//   const form = useForm<RegisterFormValues>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       phone: "",
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   // async function onSubmit(data: RegisterFormValues) {
//   //   setIsLoading(true);

//   //   try {
//   //     const result = await registerAdmin({
//   //       name: data.name,
//   //       email: data.email,
//   //       phone: data.phone,
//   //       password: data.password,
//   //     });

//   //     if (result.success) {
//   //       toast({
//   //         title: "Registration successful",
//   //         description: "You can now log in with your credentials",
//   //       });
//   //       router.push("/auth/login");
//   //     } else {
//   //       toast({
//   //         title: "Registration failed",
//   //         description: result.error,
//   //         variant: "destructive",
//   //       });
//   //     }
//   //   } catch (error) {
//   //     toast({
//   //       title: "Something went wrong",
//   //       description: "Please try again later",
//   //       variant: "destructive",
//   //     });
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
//         <FormField
//           control={form.control}
//           name='name'
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Name</FormLabel>
//               <FormControl>
//                 <Input placeholder='John Doe' {...field} disabled={isLoading} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name='email'
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input
//                   placeholder='admin@example.com'
//                   {...field}
//                   disabled={isLoading}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name='phone'
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Phone Number</FormLabel>
//               <FormControl>
//                 <Input
//                   placeholder='+44 7700 900000'
//                   {...field}
//                   disabled={isLoading}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name='password'
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Password</FormLabel>
//               <FormControl>
//                 <Input
//                   type='password'
//                   placeholder='••••••••'
//                   {...field}
//                   disabled={isLoading}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name='confirmPassword'
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Confirm Password</FormLabel>
//               <FormControl>
//                 <Input
//                   type='password'
//                   placeholder='••••••••'
//                   {...field}
//                   disabled={isLoading}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type='submit' className='w-full mt-6' disabled={isLoading}>
//           {isLoading ? (
//             <>
//               <Loader2 className='mr-2 h-4 w-4 animate-spin' />
//               Creating account...
//             </>
//           ) : (
//             "Create account"
//           )}
//         </Button>
//       </form>
//     </Form>
//   );
// }
