export function generateRandomPassword(length = 12): string {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercase = 'abcdefghijkmnopqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%&*';
  const allChars = `${uppercase}${lowercase}${numbers}${symbols}`;
  const minimumLength = 4;
  const passwordLength = Math.max(length, minimumLength);

  const pick = (chars: string) => chars[secureRandomIndex(chars.length)];

  const required = [
    pick(uppercase),
    pick(lowercase),
    pick(numbers),
    pick(symbols),
  ];
  const remaining = Array.from(
    { length: passwordLength - required.length },
    () => pick(allChars),
  );

  return shuffle([...required, ...remaining]).join('');
}

function secureRandomIndex(max: number): number {
  if (max <= 0) {
    throw new Error('Cannot generate a random index with a non-positive range.');
  }

  const maxUnbiased = Math.floor(0x100000000 / max) * max;
  const values = new Uint32Array(1);

  do {
    window.crypto.getRandomValues(values);
  } while (values[0] >= maxUnbiased);

  return values[0] % max;
}

function shuffle(items: string[]): string[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = secureRandomIndex(index + 1);
    const current = result[index];
    result[index] = result[swapIndex];
    result[swapIndex] = current;
  }

  return result;
}
