export function generateRandomPassword(length = 12): string {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercase = 'abcdefghijkmnopqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%&*';
  const allChars = `${uppercase}${lowercase}${numbers}${symbols}`;

  const pick = (chars: string) => chars[Math.floor(Math.random() * chars.length)];

  const required = [pick(uppercase), pick(lowercase), pick(numbers), pick(symbols)];
  const remaining = Array.from({ length: length - required.length }, () =>
    pick(allChars),
  );

  return [...required, ...remaining]
    .sort(() => Math.random() - 0.5)
    .join('');
}
