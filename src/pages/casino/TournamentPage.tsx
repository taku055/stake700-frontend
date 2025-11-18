import { DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";
import { useState, useEffect } from "preact/hooks";

export default function PageComponent() {
  const [activeFilter, setActiveFilter] = useState("upcoming");
  const [showOnlyFree, setShowOnlyFree] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Mock launch date - 30 days from now
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 30);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const tournaments = [
    {
      id: 1,
      title: "TOP GAMES TOURNAMENT",
      prizePool: "244,269.55",
      currency: DEFAULT_CURRENCY_SYMBOL,
      status: "live",
      days: 4,
      hours: 10,
      minutes: 21,
      seconds: 57,
      players: 60536,
      buyIn: 0,
      fee: 0,
      minSpins: 4.89,
      maxSpins: 0,
      minRounds: 1,
      maxRounds: 0,
      startDate: "21.09.2025, 00:01",
      endDate: "27.09.2025, 23:59",
      regStartDate: "20.09.2025, 00:01",
      regEndDate: "27.09.2025, 23:59",
      description:
        "Sum of Hourly Highest Single Win / Tournament Minimum Bet. Double points for Roulette Poly and Blackjack Poly. Real-time leaderboard updates. Wager-free cash prizes.",
      games: [
        {
          name: "AVIATOR",
          provider: "PRIZE STORM",
          image: "/images/games/aviator.png",
        },
        {
          name: "ROYAL BELL",
          provider: "Ortak PLUS",
          image: "/images/games/royal-bell.png",
        },
        {
          name: "ROYAL BELL 20",
          provider: "Ortak PLUS",
          image: "/images/games/royal-bell-20.png",
        },
        {
          name: "20 MEGA SEVEN",
          provider: "Ortak PLUS",
          image: "/images/games/mega-seven.png",
        },
        {
          name: "ROYAL BELL +8",
          provider: "Ortak PLUS",
          image: "/images/games/royal-bell-plus.png",
        },
      ],
    },
    {
      id: 2,
      title: "TOP GAMES TOURNAMENT",
      prizePool: "180,450.25",
      currency: DEFAULT_CURRENCY_SYMBOL,
      status: "live",
      days: 3,
      hours: 15,
      minutes: 42,
      seconds: 18,
      players: 40081,
      buyIn: 0,
      fee: 0,
      minSpins: 5.0,
      maxSpins: 0,
      minRounds: 1,
      maxRounds: 0,
      startDate: "22.09.2025, 00:01",
      endDate: "28.09.2025, 23:59",
      regStartDate: "21.09.2025, 00:01",
      regEndDate: "28.09.2025, 23:59",
      description:
        "Sum of Hourly Highest Single Win / Tournament Minimum Bet. Double points for Roulette Poly and Blackjack Poly. Real-time leaderboard updates. Wager-free cash prizes.",
      games: [
        {
          name: "AVIATOR",
          provider: "PRIZE STORM",
          image: "/images/games/aviator.png",
        },
        {
          name: "ROYAL BELL",
          provider: "Ortak PLUS",
          image: "/images/games/royal-bell.png",
        },
        {
          name: "ROYAL BELL 20",
          provider: "Ortak PLUS",
          image: "/images/games/royal-bell-20.png",
        },
        {
          name: "20 MEGA SEVEN",
          provider: "Ortak PLUS",
          image: "/images/games/mega-seven.png",
        },
        {
          name: "ROYAL BELL +8",
          provider: "Ortak PLUS",
          image: "/images/games/royal-bell-plus.png",
        },
      ],
    },
  ];

  const filters = [
    "All",
    "Upcoming",
    "Live",
    "Finished",
    "Registration Started",
  ];

  const CountdownTimer = ({
    days,
    hours,
    minutes,
    seconds,
  }: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }) => (
    <div className="text-center">
      <div className="text-white text-sm mb-2">Ends in</div>
      <div className="text-white text-3xl font-bold mb-1">
        {days.toString().padStart(2, "0")} : {hours.toString().padStart(2, "0")}{" "}
        : {minutes.toString().padStart(2, "0")} :{" "}
        {seconds.toString().padStart(2, "0")}
      </div>
      <div className="text-white text-xs">DAYS HRS MINS SECS</div>
    </div>
  );

  const GameThumbnail = ({ game }: { game: any }) => (
    <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
      <div className="text-center">
        <div className="text-xs font-bold text-white">{game.name}</div>
        <div className="text-xs text-yellow-300">{game.provider}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-white relative">
      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 max-w-2xl mx-4 border border-white/20 shadow-2xl relative overflow-hidden">
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400/40 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
              COMING SOON
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              TOURNAMENTS
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
              Get ready for the ultimate gaming experience! Compete with players
              worldwide and win amazing prizes.
            </p>

            {/* Digital Clock Timer */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/20">
              <div className="text-white text-lg mb-4 font-medium">
                Launch Countdown
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-black/30 rounded-lg p-3 text-center border border-white/10">
                  <div className="text-2xl md:text-3xl font-bold text-white font-mono">
                    {timeLeft.days.toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-300 uppercase tracking-wide mt-1">
                    DAYS
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-3 text-center border border-white/10">
                  <div className="text-2xl md:text-3xl font-bold text-white font-mono">
                    {timeLeft.hours.toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-300 uppercase tracking-wide mt-1">
                    HOURS
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-3 text-center border border-white/10">
                  <div className="text-2xl md:text-3xl font-bold text-white font-mono">
                    {timeLeft.minutes.toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-300 uppercase tracking-wide mt-1">
                    MINUTES
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-3 text-center border border-white/10">
                  <div className="text-2xl md:text-3xl font-bold text-white font-mono animate-pulse">
                    {timeLeft.seconds.toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-300 uppercase tracking-wide mt-1">
                    SECONDS
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <div className="text-yellow-400 text-lg mb-2">🏆</div>
                <div className="text-white font-semibold mb-1">Epic Prizes</div>
                <div className="text-gray-300 text-sm">Massive prize pools</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <div className="text-yellow-400 text-lg mb-2">🌍</div>
                <div className="text-white font-semibold mb-1">
                  Global Competition
                </div>
                <div className="text-gray-300 text-sm">Compete worldwide</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <div className="text-yellow-400 text-lg mb-2">⚡</div>
                <div className="text-white font-semibold mb-1">Fair Play</div>
                <div className="text-gray-300 text-sm">
                  Transparent mechanics
                </div>
              </div>
            </div>

            {/* Notification */}
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-md rounded-lg p-4 border border-yellow-400/30">
              <div className="text-white font-semibold mb-2">
                Be the First to Know!
              </div>
              <div className="text-gray-300 text-sm">
                Get notified when tournaments go live
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between py-6 pb-10">
        <div className="flex space-x-4">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter.toLowerCase())}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter.toLowerCase()
                  ? "bg-gray-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-white text-sm">Show only free</span>
          <button
            onClick={() => setShowOnlyFree(!showOnlyFree)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              showOnlyFree ? "bg-[var(--pink-color)]" : "bg-gray-600"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                showOnlyFree ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Tournament Cards */}
      <div className="pb-8 space-y-8">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="bg-gray-900 rounded-sm">
            <div className="flex flex-col lg:flex-row">
              {/* Left Panel - Tournament Summary Card */}
              <div className="lg:w-80 flex flex-col bg-[#FFFFFF1A] p-6 border border-[#FFFFFF0D] relative">
                <div className="absolute top-0 left-[33px] z-3 flex">
                  <span className="bg-[#020B1F] w-[17px] h-[17px] rounded-full z-[1]"></span>
                  <span className="bg-[linear-gradient(90deg,_#414141_0.03%,_#DEDEDE_29.26%,_#777777_49.56%,_#BCBCBC_74.68%,_#3C3C3C_100%)] w-[11px] h-[33px] rounded-full absolute bottom-[3px] left-[3px] z-[2]"></span>
                </div>
                <div className="absolute top-0 right-[33px] z-3 flex">
                  <span className="bg-[#020B1F] w-[17px] h-[17px] rounded-full z-[1]"></span>
                  <span className="bg-[linear-gradient(90deg,_#414141_0.03%,_#DEDEDE_29.26%,_#777777_49.56%,_#BCBCBC_74.68%,_#3C3C3C_100%)] w-[11px] h-[33px] rounded-full absolute bottom-[3px] left-[3px] z-[2]"></span>
                </div>
                {/* Tournament Graphic */}
                <div className="relative mb-6">
                  <div className="w-full h-32 bg-gradient-to-r from-yellow-400 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                    {/* Character illustrations */}
                    <div className="absolute left-2 top-2 flex items-center">
                      <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-amber-600 rounded-full"></div>
                      </div>
                      <div className="w-16 h-8 bg-blue-300 rounded ml-2"></div>
                    </div>
                    <div className="absolute right-2 top-4">
                      <div className="w-10 h-16 bg-white rounded-full"></div>
                    </div>
                    {tournament.status === "live" && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        LIVE
                      </div>
                    )}
                  </div>
                </div>

                {/* Prize Funds */}
                <div className="text-center mb-6">
                  <div className="text-white text-sm mb-1">PRIZE FUNDS</div>
                  <div className="text-green-400 text-2xl font-bold">
                    {tournament.prizePool} {tournament.currency}
                  </div>
                </div>

                {/* Countdown Timer */}
                <CountdownTimer
                  days={tournament.days}
                  hours={tournament.hours}
                  minutes={tournament.minutes}
                  seconds={tournament.seconds}
                />

                {/* Join Button */}
                <button className="w-full mt-6 bg-[var(--pink-color)] text-white py-3 px-4 rounded-lg font-medium hover:bg-[var(--primary-hover-color)] transition-colors">
                  JOINED
                </button>
              </div>

              {/* Right Panel - Tournament Details */}
              <div className="flex-1 p-6">
                {/* Tournament Title */}
                <h2 className="text-white text-xl font-bold mb-4">
                  {tournament.title}
                </h2>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  {tournament.description}
                  <a href="#" className="text-blue-400 ml-2 hover:underline">
                    Read more &gt;
                  </a>
                </p>

                {/* Information Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-white text-xs font-medium mb-2">
                      TOURNAMENT DURATION
                    </div>
                    <div className="text-gray-300 text-xs">
                      <div>Start Date {tournament.startDate}</div>
                      <div>End Date {tournament.endDate}</div>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-white text-xs font-medium mb-2">
                      REGISTRATION DATES
                    </div>
                    <div className="text-gray-300 text-xs">
                      <div>Start Date {tournament.regStartDate}</div>
                      <div>End Date {tournament.regEndDate}</div>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-white text-xs font-medium mb-2">
                      PLAYERS
                    </div>
                    <div className="text-gray-300 text-xs">
                      <div>Players {tournament.players.toLocaleString()}</div>
                      <div>
                        Buy in + Fee {tournament.buyIn} {tournament.currency}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-white text-xs font-medium mb-2">
                      SPINS
                    </div>
                    <div className="text-gray-300 text-xs">
                      <div>
                        Minimum {tournament.minSpins} {tournament.currency}
                      </div>
                      <div>Maximum {tournament.maxSpins}</div>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-white text-xs font-medium mb-2">
                      ROUNDS
                    </div>
                    <div className="text-gray-300 text-xs">
                      <div>Min {tournament.minRounds}</div>
                      <div>Max {tournament.maxRounds}</div>
                    </div>
                  </div>
                </div>

                {/* Game Thumbnails */}
                <div className="flex space-x-4 overflow-x-auto">
                  {tournament.games.map((game, index) => (
                    <GameThumbnail key={index} game={game} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
