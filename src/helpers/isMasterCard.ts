export const isMasterCard = (cardNumber: string): boolean => {
  const masterCardRegex =
    /^(?:5[1-5][0-9]{14}|2(?:22[1-9]|2[3-9][0-9]|[3-6][0-9]{2}|7[01][0-9]|720)[0-9]{12})$/;
  return masterCardRegex.test(cardNumber);
};
