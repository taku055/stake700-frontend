export const getRootDomain = (domain?: string): string => {
  if (!domain) return "";

  const parts = domain.trim().toLowerCase().split(".");

  // If it's like www.example.com → remove first part
  if (parts.length > 2) {
    return parts.slice(1).join(".");
  }

  return domain;
};
