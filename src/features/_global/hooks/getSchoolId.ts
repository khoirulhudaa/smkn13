const DOMAIN_MAP: Record<string, string> = {
  "sdn09jkt.kiraproject.id": "83",
  "new.sman78-jkt.sch.id": "2",
  "new.sman25-jkt.sch.id": "88",
  "smkn13jkt.kiraproject.id": "55",
  "sman101.kiraproject.id": "79",  
  "sman40jkt.kiraproject.id": "40",  
  "sman40jkt.com": "40",  
};

export const getSchoolId = (): string => {
  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "55";
  }

  return DOMAIN_MAP[hostname] || "55";
};