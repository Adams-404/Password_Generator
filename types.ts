
export interface PasswordOptions {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export type StrengthLevel = 'Too Weak' | 'Weak' | 'Medium' | 'Strong';

export interface Strength {
  level: StrengthLevel;
  color: string;
}
