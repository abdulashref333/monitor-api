import { validateOrReject } from "class-validator";

export async function validateOrRejectInp(input: any) {
  try {
    await validateOrReject(input);
  } catch (errors) {
    console.log("Caught promise rejection (validation failed). Errors: ", errors);
  }
}
