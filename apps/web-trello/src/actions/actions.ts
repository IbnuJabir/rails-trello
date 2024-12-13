// "use server";

// import prisma from "@/lib/db";
// import { revalidatePath } from "next/cache";
// import { z } from "zod";
// import bcryptjs from "bcryptjs";
// import { signInSchema, signUpSchema } from "@/lib/schema";
// import { signIn } from "@/auth";

// export async function createUser(formData: FormData) {
//   const name = formData.get("name")?.toString();
//   const email = formData.get("email")?.toString();
//   const password = formData.get("password")?.toString();
//   // Add validation for the form data
//   if (!name || !email || !password) {
//     return { errors: { general: ["Please fill in all fields"] } };
//   }
//   const validate = signUpSchema.safeParse({
//     name,
//     email,
//     password,
//   });

//   if (!validate.success) {
//     // Log the error or re-throw to handle it
//     console.error("Validation failed", validate.error.flatten().fieldErrors);
//     // throw new Error("Validation failed");
//     return { errors: validate.error.flatten().fieldErrors };
//   }
//   try {
//     // Hash password before saving to database
//     const hashedPassword = await bcryptjs.hash(validate.data.password, 10);

//     const userExisted = await prisma.user.findFirst({
//       where: {
//         email: validate.data.email,
//       },
//     });
//     if (userExisted) {
//       return {
//         success: false,
//         message: "User Already existed. Please try again.",
//       };
//     }
//     // Save the user to the database
//     const newUser = await prisma.user.create({
//       data: {
//         name: validate.data.name,
//         email: validate.data.email,
//         password: hashedPassword,
//       },
//     });
//   } catch (error: any) {
//     return {
//       success: false,
//       message: "something went wrong. Please try again.",
//     };
//   }

//   try {
//     const user = await signIn("credentials", {
//       email: validate.data.email,
//       password: validate.data.password,
//       redirect: false,
//     });
//     console.log("result of signin", user);
//     revalidatePath("/");
//     return {
//       success: true,
//       data: user,
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: "something went wrong try again",
//     };
//   }
// }

// export async function login(formData: FormData) {
//   const email = formData.get("email")?.toString();
//   const password = formData.get("password")?.toString();

//   const validate = signInSchema.safeParse({
//     email,
//     password,
//   });
//   if (!validate.success) {
//     return { errors: validate.error.flatten().fieldErrors };
//   }

//   try {
//     const user = await signIn("credentials", {
//       email: validate.data.email,
//       password: validate.data.password,
//       redirect: false,
//     });

//     console.log("result of signin", user);
//     return {
//       success: true,
//       data: user,
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: "Invalid Email or password!",
//     };
//   }
// }

// export async function getUserFromDb(email: string, password: string) {
//   try {
//     const existedUser = await prisma.user.findFirst({
//       where: {
//         email,
//       },
//     });

//     if (!existedUser) {
//       return {
//         success: false,
//         message: "User not found.",
//       };
//     }

//     if (!existedUser.password) {
//       return {
//         success: false,
//         message: "Password is required.",
//       };
//     }

//     const isPasswordMatches = await bcryptjs.compare(
//       password,
//       existedUser.password
//     );

//     if (!isPasswordMatches) {
//       return {
//         success: false,
//         message: "Password is incorrect.",
//       };
//     }

//     return {
//       success: true,
//       data: existedUser,
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message,
//     };
//   }
// }

// export async function saltAndHashPassword(password: string) {
//   const salt = await bcryptjs.genSalt(10);
//   const hash = await bcryptjs.hash(password, salt);
//   return hash;
// }

// export async function signInWithGoogle() {
//   await signIn("google", { redirectTo: "/" });
// }

// export async function signInWithGithub() {
//   await signIn("github", { redirectTo: "/" });
// }
