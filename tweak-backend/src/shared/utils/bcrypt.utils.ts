import { compare, hash } from 'bcrypt';
import { ReturnType } from './return-type.util';

export async function generateHashPassword(
  password: string,
): Promise<ReturnType<string>> {
  try {
    const hashedPassword: string = await hash(password, 10);
    return { data: hashedPassword, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function comparePasswords(
  hashedPassword: string,
  plaintextPassword: string,
): Promise<ReturnType<Boolean>> {
  try {
    const isMatched = await compare(plaintextPassword, hashedPassword);
    return { data: isMatched, error: null };
  } catch (error) {
    return { data: null, error: null };
  }
}
