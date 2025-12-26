import ComingSoon from "../coming-soon";

export default function PageComponent() {
  return (
    <ComingSoon
      productName="Tombala"
      launchDate={new Date("2025-11-01T09:00:00")}
      onNotify={() => {}}
      heroUrl="https://tekio.s3.eu-north-1.amazonaws.com/betalarab/logo.png"
    />
  );
}
