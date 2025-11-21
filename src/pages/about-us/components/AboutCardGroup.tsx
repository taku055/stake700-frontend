import AboutCard from "./AboutCard";

interface CardData {
  image: string;
  title: string;
  explanation: string;
}

interface AboutCardGroupProps {
  cards: CardData[];
}

export default function AboutCardGroup({ cards }: AboutCardGroupProps) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <AboutCard
          key={index}
          image={card.image}
          title={card.title}
          explanation={card.explanation}
        />
      ))}
    </div>
  );
}

