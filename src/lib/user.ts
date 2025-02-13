const generateRandomLetter = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters.charAt(Math.floor(Math.random() * letters.length));
};

export const generateInitials = (
  firstName: string | null,
  lastName: string | null,
): string => {
  const firstInitial = firstName
    ? firstName.charAt(0).toUpperCase()
    : generateRandomLetter();
  const lastInitial = lastName
    ? lastName.charAt(0).toUpperCase()
    : generateRandomLetter();

  return `${firstInitial}${lastInitial}`;
};
