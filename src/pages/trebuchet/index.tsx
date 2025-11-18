import ComingSoon from "../coming-soon";

export default function PageComponent() {
  return (
    <ComingSoon
      productName="Trebuchet"
      launchDate={new Date("2025-11-01T09:00:00")}
      onNotify={() => {}}
      heroUrl="https://tekio.s3.eu-north-1.amazonaws.com/betinbet/logo.png"
    />
  );
}
