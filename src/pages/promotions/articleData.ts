import { capitalize } from "@/helpers/capitalize";

export interface PromotionArticle {
  id: number;
  title: string;
  content: string;
  image: string;
  category?: string;
}

export const promotionArticles: Record<number, PromotionArticle> = {
  2: {
    id: 2,
    title: "50X Bonus !!",
    image: `https://tekio.s3.eu-north-1.amazonaws.com/${import.meta.env.VITE_SITE_NAME}/promotion_cards/50X Bonus !!.png`,
    category: "SPORTS",
    content: `
      <h2>If you lose 1 game</h2>
      <p><b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> will reward cashback directly to your account in case your bet is lost because of 1 game</p>
      
      <h3 style="font-weight: bold; line-height: 2.5;">Terms and Conditions</h3>
      
      Place multiple bet on Sportsbook. <br/>
      If the bet loses because of one selection you will receive an additional cash bonus of up to 50x of your ${capitalize(import.meta.env.VITE_SITE_NAME)} amount.
      <ul style="list-style-type: disc; padding-left: 20px;">
        <li>Each multiple bet must contain at least 5 event.</li>
        <li>Each event must have odds of 1.30 or higher.</li>
      </ul>
      <br />
      <h3 style="font-weight: bold;">Cashback Calculation Template</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: var(--bar-background-color);">
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Number of games</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">1 game lost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">5 To 10 selections</td>
            <td style="padding: 12px; border: 1px solid #333;">1X</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">11 To 15 selections</td>
            <td style="padding: 12px; border: 1px solid #333;">2X</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">16 To 20 selections</td>
            <td style="padding: 12px; border: 1px solid #333;">10X</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">21 To 29 selections</td>
            <td style="padding: 12px; border: 1px solid #333;">20X</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">30 and more</td>
            <td style="padding: 12px; border: 1px solid #333;">50X</td>
          </tr>
        </tbody>
      </table>
    `
  },
  5: {
    id: 5,
    title: "Bet Builder",
    image: `https://tekio.s3.eu-north-1.amazonaws.com/${import.meta.env.VITE_SITE_NAME}/promotion_cards/Bet Builder.png`,
    category: "SPORTS",
    content: `
      <h2>Millions of unreal combinations daily!</h2>
      <p><b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> Sportsbook has launched a new betting feature called BetBuilder.</p>
      
      <p>BetBuilder, allows you to build your own bets on the same match with multiple selections.</p>
      
      <p>With BetBuilder now you can tie the markets you have always wanted.</p>
      
      <p>BetBuilder is currently available on 10+ sports: Football, Basketball, Tennis, Ice Hockey, American Football, Baseball, Rugby League, Rugby Union, Cricket, Australian Rules Football, and UFC matches only with an aim to enlarge the sports scope.</p>
      
      <br />
      <p><b>Note:</b> Not every match has BetBuilder.</p>
      <p>If it is available, the player will see BB on the match level.</p>
      
      <p>So, head to build your dream bet with our advanced BetBuilder.</p>
    `
  },
  6: {
    id: 6,
    title: "Boosted odds",
    image: `https://tekio.s3.eu-north-1.amazonaws.com/${import.meta.env.VITE_SITE_NAME}/promotion_cards/Boosted odds.png`,
    category: "SPORTS",
    content: `
      <h2><b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> offers Boosted odds to its users.</h2>
      
      <p>Boosted odds are an excellent way for sports fans to explore betting possibilities for different sport types, bet types, and events at more attractive odds. Receive enhanced odds on a wide range of global sporting markets. You will be able to find Boosted Odds for events of most of the popular matches and place bets on these events at higher than usual odds and get a higher profit in case of winning. Boosted Odds are available to all users and there's no limit to how many you can bet. Click below to see our cosmic prices, or browse the Boosted Odds section of the Sportsbook page.</p>
      
      <p>Boost your chances with <b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> !</p>
    `
  },
  8: {
    id: 8,
    title: "Cashout",
    image: `https://tekio.s3.eu-north-1.amazonaws.com/${import.meta.env.VITE_SITE_NAME}/promotion_cards/Cashout.png`,
    category: "SPORTS",
    content: `
      <h2>Cash Out with 0% commission or Cancel Your Bet</h2>
      
      <h3 style="font-weight: bold; line-height: 2.5;">What benefits do you get with this feature?</h3>
      
      <p>You have already placed a bet in the Pre-match. But then changed your mind?</p>
      
      <p>Or have you noticed something more interesting and want to use your funds there?</p>
      
      <p>You will have a unique chance to cancel (cashout) your bet without any commission!</p>
      
      <p>The cashout amount will be higher than or equal to your original ${capitalize(import.meta.env.VITE_SITE_NAME)} amount if the odds have not changed or decreased since the bet was placed.</p>
      
      <br />
      
      <p>Cash Out is a betting offer that enables you to profit from your bet before an event has completed. You can cash out your winnings while playing. And even if you lose the selection, you get to keep the cash-out.</p>
      
      <p>You can choose a Full, Partial, or Auto Cash Out, and take all of your bet or a part of it while the event is still on.</p>
      
      <p>Partial Cash Out lets you choose exactly how much of your bet you want to cash out leaving a part of your bet in the game.</p>
      
      <p>Auto Cash Out allows you to create a rule (basically a set value) so that your bet will be cashed out (partially or in full) automatically when it reaches or exceeds your selected threshold.</p>
      
      <p>Take advantage of your bet, minimize a potential loss with Cash Out, Partial Cash Out, or Auto Cash Out.</p>
    `
  },
  9: {
    id: 9,
    title: `Early Payout Offer from ${capitalize(import.meta.env.VITE_SITE_NAME)}`,
    image: `https://tekio.s3.eu-north-1.amazonaws.com/${import.meta.env.VITE_SITE_NAME}/promotion_cards/Early Payout Offer from ${capitalize(import.meta.env.VITE_SITE_NAME)}.png`,
    content: `
      <h2>Early Payout Offer from <b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b></h2>
      
      <p>Once your team scores two goals, you can claim your profits without waiting for the match to end.</p>
      
      <p>Place a bet on the new "Match Result (Early Payout)" option available in specific football matches.</p>
      
      <p>You will receive the full profit if your team is leading by a two-goal margin at any point during the game, regardless of the final match result.</p>
      
      <br />
      
      <h3 style="font-weight: bold; line-height: 2.5;">How to participate :</h3>
      
      <p>Place a single or multiple bets before the start of the football matches in the available leagues.</p>
      
      <p>The offer includes only the "Match Result (Early Payout)" option.</p>
      
      <p>Get the full profit if your team is leading by a two-goal margin at any time during the game, regardless of the final match result, whether your team wins, loses, or draws.</p>
      
      <br />
      
      <p>The Cash Out feature is not available to apply on qualifying bets of the promotion.</p>
    `
  },
  10: {
    id: 10,
    title: "Edit Bet",
    image: `https://tekio.s3.eu-north-1.amazonaws.com/${import.meta.env.VITE_SITE_NAME}/promotion_cards/Edit Bet.png`,
    category: "SPORTS",
    content: `
      <h2>A special offer to edit your bets!</h2>
      
      <p>Edit Bet is a special feature that allows you to make changes, add, or remove events from your existing bet slip.</p>
      
      <h3 style="font-weight: bold; line-height: 2.5;">How it works on Single, Multiple, and Active Bets</h3>
      
      <h3 style="font-weight: bold;">How it works on Single and Multiple Bets</h3>
      
      <p>In the case of a single bet, by adding another event(s), the bet becomes multiple. In the case of a multiple bet, if you edit your bets and only one bet remains after editing, then your bet becomes a single.</p>
      
      <h3 style="font-weight: bold;">How It Works on Active Bet Slips</h3>
      
      <p>On active bet slips, you can edit either events that have already finished or those that haven't taken place yet. For example, you have the opportunity to change a multiple bet consisting of one finished and two unfinished events into a single bet by removing the unfinished events. Also, you can edit all events on the multiple bet or add a 4th and 5th event to your previous bets.</p>
      
      <h3 style="font-weight: bold; line-height: 2.5;">Who Can Use The Edit Bet Feature?</h3>
      
      <p>The Edit Bet feature is available only for players who have the Cash Out feature for their active bet slips at the moment they want to edit their bets. When applying this feature, the amount offered via Cash Out is automatically set as the bet amount in the edited bet slip.</p>
      
      <p><b>Important!</b></p>
      
      <p>If you choose the adding and editing tools, the feature automatically offers the odds and Cash Out amount for the given events available in the program at that moment before you confirm the odds and Cash Out amounts you have selected. The removing tool automatically allows players to edit the bet slip according to the Cash Out amount available at that moment.</p>
      
      <h3 style="font-weight: bold; line-height: 2.5;">Where To Find The Edit Bet Feature?</h3>
      
      <p>You can edit your bet in the My Bets section by clicking the Edit Bet button in the upper right corner of the bet slip. All unfinished events will appear in the edited bet slip, allowing players to replace the event(s) in the edited bet slip. After making the changes, the amount of the edited bet and the possible prize will be displayed in the lower-left corner. To confirm your changes, click on the Save Changes button.</p>
      
      <h3 style="font-weight: bold; line-height: 2.5;">How to Add & Remove an Event?</h3>
      
      <h3 style="font-weight: bold;">How to Add an Event?</h3>
      
      <p>To add an event to your bet slip, click on the Add Event button on the bet slip. You will be transferred to the main page, and a pop-up window will invite you to download the available events on the website and add event(s). By choosing any new event, it will show up on the lower part of the bet slip. The event will be included on the edited bet slip by selecting the Add to Bet button on the lower part of the edited bet slip. To confirm your changes, click on the Save Changes button.</p>
      
      <h3 style="font-weight: bold;">How to Remove an Event?</h3>
      
      <p>To remove an event from the bet slip, click on the X (Exit) button on the right of the chosen event. The removed event will be removed from the bet slip. To confirm your changes, click on the Save Changes button.</p>
      
      <h3 style="font-weight: bold; line-height: 2.5;">Other Terms and Conditions</h3>
      
      <p>Until the point of confirmation, the feature can be canceled by clicking on the Cancel button. The feature is not applicable for bets placed via the Free bet. The edited bet slip will be available in the My Bets section. <b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> has the right to amend the terms of the offer, cancel or renew the offer, or refuse to allow participation at any time without prior notice. This means that <b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> may limit or refuse to allow customers to take part in this or any other offer. The general conditions referring to accepting and implementing bets defined by the current regulation apply to the given feature conditions. The organizer bears no responsibility for the unavailability of the feature caused by technical issues. In that case, the conditions of the initial bet slip will maintain.</p>
    `
  },

  11: {
    id: 11,
    title: "Loyalty Program",
    image: `https://tekio.s3.eu-north-1.amazonaws.com/${import.meta.env.VITE_SITE_NAME}/promotion_cards/Loyalty Program.png`,
    category: "CASINO",
    content: `
      <h2>Loyalty Program</h2>
      
      <p>Get Loyalty Points by spinning Casino Slots at <b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> & upgrade your level every 30 days!</p>
      
      <p>Exchange your Loyalty Points with REAL MONEY or different prizes!</p>
      
      <br />
      
      <h3 style="font-weight: bold; line-height: 2.5;">HOW TO COLLECT LOYALTY POINTS?</h3>
      
      <p>You should spin Casino slots games to collect Loyalty Points based on your Loyalty Level. Each €1 total bet is eligible for Loyalty Points calculated with this formula: 1 x Level Multiplier.</p>
      
      <h3 style="font-weight: bold;">Point calculation for each currency:</h3>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: var(--bar-background-color);">
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Currency</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Bet Amount</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Points Calculation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">EUR</td>
            <td style="padding: 12px; border: 1px solid #333;">1</td>
            <td style="padding: 12px; border: 1px solid #333;">1 x Level Multiplier</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">FTN</td>
            <td style="padding: 12px; border: 1px solid #333;">1</td>
            <td style="padding: 12px; border: 1px solid #333;">1 x Level Multiplier</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">USD</td>
            <td style="padding: 12px; border: 1px solid #333;">1</td>
            <td style="padding: 12px; border: 1px solid #333;">1 x Level Multiplier</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">CAD</td>
            <td style="padding: 12px; border: 1px solid #333;">1</td>
            <td style="padding: 12px; border: 1px solid #333;">1 x Level Multiplier</td>
          </tr>
        </tbody>
      </table>
      
      <p>Generated Loyalty Points are transferred to your Loyalty Points balance and can be tracked via the Loyalty Points section.</p>
      
      <p>Loyalty Points can be exchanged for real money by clicking the Exchange button and entering the required amount.</p>
      
      <p>Loyalty Points can also be exchanged for free spins, wagering bonus and other prizes at the Exchange Shop and can be used on Slots games.</p>
      
      <p>Converted real money from Loyalty Points will be credited to your ${capitalize(import.meta.env.VITE_SITE_NAME)} account as withdrawable money.</p>
      
      <p>The min limit for cash conversion is €1 or equivalent in other currency, which is the equivalent to 1,000 Loyalty Points.</p>
      
      <br />
      
      <p><b>Note</b></p>
      
      <p>As for FTN, the min limit for cash conversion is 1 FTN which is the equivalent to 1000 Loyalty Points</p>
      
      <p>*See your Loyalty Points on "My Profile/Loyalty Points" page.</p>
      
      <br />
      
      <h3 style="font-weight: bold; line-height: 2.5;">LOYALTY LEVEL</h3>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: var(--bar-background-color);">
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Level</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Minimum Points</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Maximum Points</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Multiplier</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Program Period</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">Bronze</td>
            <td style="padding: 12px; border: 1px solid #333;">0</td>
            <td style="padding: 12px; border: 1px solid #333;">1,000</td>
            <td style="padding: 12px; border: 1px solid #333;">1</td>
            <td style="padding: 12px; border: 1px solid #333;">30 days</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">Silver</td>
            <td style="padding: 12px; border: 1px solid #333;">1,001</td>
            <td style="padding: 12px; border: 1px solid #333;">10,000</td>
            <td style="padding: 12px; border: 1px solid #333;">1,25</td>
            <td style="padding: 12px; border: 1px solid #333;">30 days</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">Gold</td>
            <td style="padding: 12px; border: 1px solid #333;">10,001</td>
            <td style="padding: 12px; border: 1px solid #333;">25,000</td>
            <td style="padding: 12px; border: 1px solid #333;">1,5</td>
            <td style="padding: 12px; border: 1px solid #333;">30 days</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">Platinum</td>
            <td style="padding: 12px; border: 1px solid #333;">25,001</td>
            <td style="padding: 12px; border: 1px solid #333;">50,000</td>
            <td style="padding: 12px; border: 1px solid #333;">1,75</td>
            <td style="padding: 12px; border: 1px solid #333;">30 days</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">Diamond</td>
            <td style="padding: 12px; border: 1px solid #333;">50,001</td>
            <td style="padding: 12px; border: 1px solid #333;">1,000,000</td>
            <td style="padding: 12px; border: 1px solid #333;">2</td>
            <td style="padding: 12px; border: 1px solid #333;">30 days</td>
          </tr>
        </tbody>
      </table>
      
      <p>You can upgrade your Loyalty level gradually from Bronze to Silver, from Silver to Gold, from Gold to Platinum, from Platinum to Diamond as you accumulate points over a 30-day period.</p>
      
      <p>You can climb and go down the Levels only consecutively, regardless of the number of points you collected.</p>
      
      <p>For example, If you're at the Gold Level but collect more than 50,001 Points (a number of Points that corresponds to the Diamond Level) within 30 days you still upgrade to the Platinum Level, not the Diamond Level. And if you're at the Platinum Level but collect the points corresponding to Silver Level within 30 days, you will downgrade to the Gold Level, not the Silver Level.</p>
      
      <p>Each Level has a special multiplier that determines the points you receive.</p>
      
      <p>For example, by placing bets of €10,000 on the Bronze Level, you will receive 10,000 Points (€10,000*1=10,000), according to the Bronze Level multiplier (1). But by placing bets of €10,000 on the Gold Level, you will receive 15,000 Points (€10,000*1.5=15,000), according to the Gold Level multiplier (1.5).</p>
      
      <p>Clients will get opportunities to exchange their Loyalty Points with Bonus Money. Bonus Money prizes can be used both in Slots. Here is the list of the Bonus Prizes corresponding with exchangeable point count.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: var(--bar-background-color);">
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Exchangeable Points</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Bonus Money (€ or equivalent)</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Wagering requirement</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Max Payout (€ or equivalent)</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Free Spins Count</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">1 FS Value (€ or same in your currency for each level)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">300</td>
            <td style="padding: 12px; border: 1px solid #333;">€1</td>
            <td style="padding: 12px; border: 1px solid #333;">x25</td>
            <td style="padding: 12px; border: 1px solid #333;">€10</td>
            <td style="padding: 12px; border: 1px solid #333;">10</td>
            <td style="padding: 12px; border: 1px solid #333;">€0.2</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">500</td>
            <td style="padding: 12px; border: 1px solid #333;">€2</td>
            <td style="padding: 12px; border: 1px solid #333;">x25</td>
            <td style="padding: 12px; border: 1px solid #333;">€20</td>
            <td style="padding: 12px; border: 1px solid #333;">25</td>
            <td style="padding: 12px; border: 1px solid #333;">€0.2</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">750</td>
            <td style="padding: 12px; border: 1px solid #333;">€3</td>
            <td style="padding: 12px; border: 1px solid #333;">x25</td>
            <td style="padding: 12px; border: 1px solid #333;">€30</td>
            <td style="padding: 12px; border: 1px solid #333;">35</td>
            <td style="padding: 12px; border: 1px solid #333;">€0.2</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">1000</td>
            <td style="padding: 12px; border: 1px solid #333;">€4</td>
            <td style="padding: 12px; border: 1px solid #333;">x25</td>
            <td style="padding: 12px; border: 1px solid #333;">€40</td>
            <td style="padding: 12px; border: 1px solid #333;">50</td>
            <td style="padding: 12px; border: 1px solid #333;">€0.2</td>
          </tr>
        </tbody>
      </table>
      
      <br />
      
      <h3 style="font-weight: bold; line-height: 2.5;">Terms and Conditions</h3>
      
      <p>Promotion runs from November 1.</p>
      
      <p><b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> reserves the right to not provide any Loyalty Points if it is discovered that the Player has used a special program designed to defraud <b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b>.</p>
      
      <p><b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> reserves the right to change, temporarily suspend or cancel this promotion at any time.</p>
      
      <p><b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> reserves the right to cancel the bets, winnings, bonuses, jackpots, or any other prizes, which are displayed or provided to the Player due to any technical, mechanical, or software bug or error. In any dispute, the data on the <b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> server will be used as the basis for any action.</p>
      
      <p><b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> has the right to amend the terms of the offer, cancel or renew the offer, or refuse to allow participation at any time without prior notice. This means that <b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> may limit or refuse to allow customers to take part in this or any other offer.</p>
      
      <p>Each Player participating in the current promotion authorises and accepts the publication of their Player ID for any purpose related to the promotion.</p>
      
      <p>Each Player participating in this promotion approves that they have read and agreed to the Terms and Conditions.</p>
      
      <p><b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> General Terms and Conditions apply to this promotion.</p>
    `
  },
  12: {
    id: 12,
    title: "Multiple of the day",
    image: `https://tekio.s3.eu-north-1.amazonaws.com/${import.meta.env.VITE_SITE_NAME}/promotion_cards/Multiple of the day.png`,
    category: "SPORTS",
    content: `
      <h2>Ready-made bonuses and wins!</h2>
      
      <p>You want to place a ready-made Multiple bet but don't know what events to pick? Our new MULTIPLE OF THE DAY feature is made just for you!</p>
      
      <p><b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> SportsBook specialists have created ready-made Multiple bets that will bring you an Express bonus!</p>
      
      <p>Use the Multiple of the Day feature and get</p>
    `
  },
  13: {
    id: 13,
    title: "Predictor",
    image: `https://tekio.s3.eu-north-1.amazonaws.com/${import.meta.env.VITE_SITE_NAME}/promotion_cards/Predictor.png`,
    content: `
      <h2>Free Prediction Challenge - Be the Leader and Win Big!</h2>
      
      <p>Welcome to PREDICTOR match prediction game where you can compete with other players to predict match outcomes, earn points, and win fantastic prizes every week.</p>
      
      <p>Your performance relies on your ability to accurately predict results, and the more accurate your predictions, the more points you'll earn. Participation is free, and the winnings are substantial.</p>
      
      <h3 style="font-weight: bold; line-height: 2.5;">How to Play:</h3>
      
      <ul style="list-style-type: disc; padding-left: 20px;">
        <li>Log in to <b>${import.meta.env.VITE_SITE_DOMAIN}</b>, place a bet on the site worth $1 or more, and then go to the game section through the side menu.</li>
        <li>Predict match results in the designated fields, including predicting the first team to score.</li>
      </ul>
      
      <h3 style="font-weight: bold; line-height: 2.5;">Earning Points:</h3>
      
      <ul style="list-style-type: disc; padding-left: 20px;">
        <li>Earn points for correctly predicting match outcomes.</li>
        <li>Additional points for accurately predicting goal differences, total goals, or the team scoring first.</li>
      </ul>
      
      <h3 style="font-weight: bold; line-height: 2.5;">Adding Excitement:</h3>
      
      <p>Multiply your confidence in your predictions by pressing the "×2" sign to double the points for that match. If you correctly predict the outcome of this match, you'll receive multiplied points.</p>
      
      <p>You can change your predictions (even for matches marked "×2") up to 5 minutes before the start of the first match in the round.</p>
      
      <h3 style="font-weight: bold; line-height: 2.5;">Calculating Points:</h3>
      
      <ul style="list-style-type: disc; padding-left: 20px;">
        <li>No points for incorrect predictions.</li>
        <li>Points are calculated based on the percentage of participants who made correct predictions for the same match. If fewer participants made correct predictions for the same match, you earn more points.</li>
        <li>The formula for calculating points is: Maximum Points - (Maximum Points × Number of Participants with the Same Prediction) / (Total Number of Participants × 0.9) = Points</li>
      </ul>
      
      <h3 style="font-weight: bold; line-height: 2.5;">Maximum Points for Each Prediction:</h3>
      
      <ul style="list-style-type: disc; padding-left: 20px;">
        <li>Correct Score Prediction: 100 points</li>
        <li>Predicting the Winning Team: 100 points</li>
        <li>Predicting Goal Differences: 100 points</li>
        <li>Predicting the Number of Goals: 50 points</li>
        <li>Predicting the First Scoring Team: 100 points</li>
      </ul>
      
      <h3 style="font-weight: bold; line-height: 2.5;">Leadership Board:</h3>
      
      <ul style="list-style-type: disc; padding-left: 20px;">
        <li>Leaderboard points are summarized after each round based on participants' performance in the listed matches.</li>
        <li>In case of tied points among participants in consecutive positions, prizes will be distributed among them.</li>
        <li>Only completed matches are considered for points; delayed matches are not counted.</li>
      </ul>
      
      <h3 style="font-weight: bold; line-height: 2.5;">Prizes:</h3>
      
      <p>There will be 50 winners, and the prize pool is $500, distributed among them with varying percentages.</p>
      
      <h3 style="font-weight: bold;">Example Prize Distribution:</h3>
      
      <ul style="list-style-type: disc; padding-left: 20px;">
        <li>1st place: 20% of the prize pool ($100).</li>
        <li>2nd place: 10% of the prize pool ($50).</li>
        <li>3rd place: 7% of the prize pool ($35).</li>
        <li>4th and 5th places: 8% shared ($20 each).</li>
        <li>6th to 10th places: 15% shared ($15 each).</li>
        <li>11th to 20th places: 20% shared ($10 each).</li>
        <li>21st to 30th places: 10% shared ($5 each).</li>
        <li>31st to 50th places: 10% shared ($2.5 each).</li>
      </ul>
      
      <p>The prize will be in the form of a free bet credited to your account, with the same value as your winnings, subject to conditions:</p>
      
      <ul style="list-style-type: disc; padding-left: 20px;">
        <li>Must be on 3 events of your choice.</li>
        <li>Minimum odds for each event must be 1.5.</li>
      </ul>
    `
  },
  14: {
    id: 14,
    title: "Refer a friend",
    image: `https://tekio.s3.eu-north-1.amazonaws.com/${import.meta.env.VITE_SITE_NAME}/promotion_cards/Refer a friend.png`,
    content: `
      <h2>Refer a friend to join <b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> and benefit together.</h2>
      
      <h3 style="font-weight: bold; line-height: 2.5;">1- Become a loyal Player by the system</h3>
      <p>Join the offer</p>
      
      <h3 style="font-weight: bold; line-height: 2.5;">2- Receive a referral link</h3>
      <p>Refer a maximum of 5 friends</p>
      
      <h3 style="font-weight: bold; line-height: 2.5;">3- Send the link to the friend you want to invite to ${capitalize(import.meta.env.VITE_SITE_NAME)}</h3>
      <p>Register - Deposit - Meet bonus requirements</p>
      
      <br />
      
      <p><b>Attention!</b></p>
      
      <p>A referrer can "Generate" one referral link, which can be sent to 5 friends who can qualify for this offer.</p>
      
      <p>The referral link must be generated in the "Bonuses" section's "Refer a friend" subsection.</p>
      
      <p>You can successfully generate the referral link if the system approves you as a qualified referrer.</p>
      
      <p>You can track the progress of your referrals in the "Bonuses" section's "Refer a friend" subsection.</p>
      
      <br />
      
      <h3 style="font-weight: bold; line-height: 2.5;">Referred friends must follow these steps</h3>
      
      <ul style="list-style-type: disc; padding-left: 20px;">
        <li>Register on <b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> with the referred link on ${import.meta.env.VITE_SITE_DOMAIN}.</li>
        <li>Pass verification process successfully.</li>
        <li>Make a min. €20 (or equivalent) deposit.</li>
        <li>Wager on slot games min. €100 (or equivalent) or more.</li>
        <li>The referred friend must complete the above mentioned requirements within 15 days.</li>
      </ul>
      
      <p>After completing qualifying requirements both the referrer and the referred Players get bonuses.</p>
      
      <br />
      
      <p>*See min deposit and slots wagering amounts in all available currencies in the table below:</p>
      
      <h3 style="font-weight: bold;">AMOUNTS PER CURRENCY</h3>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: var(--bar-background-color);">
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Currency</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">MIN DEPOSIT AMOUNT</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">MIN SLOTS WAGER AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">EUR</td>
            <td style="padding: 12px; border: 1px solid #333;">20</td>
            <td style="padding: 12px; border: 1px solid #333;">100</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">FTN</td>
            <td style="padding: 12px; border: 1px solid #333;">25</td>
            <td style="padding: 12px; border: 1px solid #333;">100</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">AMD</td>
            <td style="padding: 12px; border: 1px solid #333;">10,000</td>
            <td style="padding: 12px; border: 1px solid #333;">50,000</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">GHS</td>
            <td style="padding: 12px; border: 1px solid #333;">100</td>
            <td style="padding: 12px; border: 1px solid #333;">5000</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">IDR</td>
            <td style="padding: 12px; border: 1px solid #333;">30,000</td>
            <td style="padding: 12px; border: 1px solid #333;">150,000</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">KZT</td>
            <td style="padding: 12px; border: 1px solid #333;">10,000</td>
            <td style="padding: 12px; border: 1px solid #333;">50,000</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">KES</td>
            <td style="padding: 12px; border: 1px solid #333;">2,000</td>
            <td style="padding: 12px; border: 1px solid #333;">10,000</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">MYR</td>
            <td style="padding: 12px; border: 1px solid #333;">100</td>
            <td style="padding: 12px; border: 1px solid #333;">500</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">RUB</td>
            <td style="padding: 12px; border: 1px solid #333;">1,000</td>
            <td style="padding: 12px; border: 1px solid #333;">5,000</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">THB</td>
            <td style="padding: 12px; border: 1px solid #333;">700</td>
            <td style="padding: 12px; border: 1px solid #333;">3,500</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">USD</td>
            <td style="padding: 12px; border: 1px solid #333;">20</td>
            <td style="padding: 12px; border: 1px solid #333;">100</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">VND</td>
            <td style="padding: 12px; border: 1px solid #333;">450,000</td>
            <td style="padding: 12px; border: 1px solid #333;">2,000,000</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">CAD</td>
            <td style="padding: 12px; border: 1px solid #333;">20</td>
            <td style="padding: 12px; border: 1px solid #333;">100</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">KRW</td>
            <td style="padding: 12px; border: 1px solid #333;">28,000</td>
            <td style="padding: 12px; border: 1px solid #333;">140,000</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">UZS</td>
            <td style="padding: 12px; border: 1px solid #333;">250000</td>
            <td style="padding: 12px; border: 1px solid #333;">125000</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">BDT</td>
            <td style="padding: 12px; border: 1px solid #333;">2000</td>
            <td style="padding: 12px; border: 1px solid #333;">10000</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">UAH</td>
            <td style="padding: 12px; border: 1px solid #333;">800</td>
            <td style="padding: 12px; border: 1px solid #333;">4000</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">GEL</td>
            <td style="padding: 12px; border: 1px solid #333;">55</td>
            <td style="padding: 12px; border: 1px solid #333;">275</td>
          </tr>
        </tbody>
      </table>
      
      <br />
      
      <h3 style="font-weight: bold; line-height: 2.5;">Bonus Wagering</h3>
      
      <ul style="list-style-type: disc; padding-left: 20px;">
        <li>Bonuses must be wagered x30 on "PopOk Gaming slots"</li>
        <li>Bonus is valid for 7 days</li>
        <li>Bonus money amount:</li>
        <li>Referrer: €25 (or equivalent) bonus money</li>
        <li>Referred: €15 (or equivalent) bonus money</li>
      </ul>
      
      <p>See the bonus amounts for referrer and referred users in all available currencies in the table below:</p>
      
      <h3 style="font-weight: bold;">AMOUNTS PER CURRENCY</h3>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: var(--bar-background-color);">
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Currency</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">BONUS AMOUNT - REFERRER</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">BONUS AMOUNT - REFERRED</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">EUR</td>
            <td style="padding: 12px; border: 1px solid #333;">25</td>
            <td style="padding: 12px; border: 1px solid #333;">15</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">FTN</td>
            <td style="padding: 12px; border: 1px solid #333;">40</td>
            <td style="padding: 12px; border: 1px solid #333;">25</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">AMD</td>
            <td style="padding: 12px; border: 1px solid #333;">10,000</td>
            <td style="padding: 12px; border: 1px solid #333;">7,000</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">GHS</td>
            <td style="padding: 12px; border: 1px solid #333;">250</td>
            <td style="padding: 12px; border: 1px solid #333;">150</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">IDR</td>
            <td style="padding: 12px; border: 1px solid #333;">370,000</td>
            <td style="padding: 12px; border: 1px solid #333;">225,000</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">KZT</td>
            <td style="padding: 12px; border: 1px solid #333;">12,000</td>
            <td style="padding: 12px; border: 1px solid #333;">7,200</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">KES</td>
            <td style="padding: 12px; border: 1px solid #333;">3,000</td>
            <td style="padding: 12px; border: 1px solid #333;">1,800</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">MYR</td>
            <td style="padding: 12px; border: 1px solid #333;">115</td>
            <td style="padding: 12px; border: 1px solid #333;">70</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">RUB</td>
            <td style="padding: 12px; border: 1px solid #333;">1,500</td>
            <td style="padding: 12px; border: 1px solid #333;">900</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">THB</td>
            <td style="padding: 12px; border: 1px solid #333;">900</td>
            <td style="padding: 12px; border: 1px solid #333;">550</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">USD</td>
            <td style="padding: 12px; border: 1px solid #333;">25</td>
            <td style="padding: 12px; border: 1px solid #333;">15</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">VND</td>
            <td style="padding: 12px; border: 1px solid #333;">590,000</td>
            <td style="padding: 12px; border: 1px solid #333;">355,000</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">CAD</td>
            <td style="padding: 12px; border: 1px solid #333;">25</td>
            <td style="padding: 12px; border: 1px solid #333;">15</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">KRW</td>
            <td style="padding: 12px; border: 1px solid #333;">35,000</td>
            <td style="padding: 12px; border: 1px solid #333;">21,000</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">UZS</td>
            <td style="padding: 12px; border: 1px solid #333;">300,000</td>
            <td style="padding: 12px; border: 1px solid #333;">80,000</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">BDT</td>
            <td style="padding: 12px; border: 1px solid #333;">2800</td>
            <td style="padding: 12px; border: 1px solid #333;">1680</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">UAH</td>
            <td style="padding: 12px; border: 1px solid #333;">1000</td>
            <td style="padding: 12px; border: 1px solid #333;">800</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #333;">GEL</td>
            <td style="padding: 12px; border: 1px solid #333;">70</td>
            <td style="padding: 12px; border: 1px solid #333;">40</td>
          </tr>
        </tbody>
      </table>
      
      <br />
      
      <h3 style="font-weight: bold; line-height: 2.5;">Terms and Conditions</h3>
      
      <p>The Promotion runs from September 16, 00:00, (CET) 2022.</p>
      
      <p>Each Player confirms to have read and accepted all the terms and conditions. This bonus offer is limited to one customer, family, address, shared computer, shared IP address. <b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> reserves the right to cancel the bonus and block the account if they discover that the Player is misusing this bonus offer or is opening multiple accounts.</p>
      
      <p><b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> reserves the right to change, temporarily suspend, or cancel this offer at any time.</p>
      
      <p><b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> has the right to amend the terms of the offer, cancel or renew the offer, or refuse to allow participation at any time without prior notice. This means, that <b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> may limit or refuse to allow customers to take part in this or any other offer.</p>
      
      <p>Each player participating in this promotion approves to have read and agreed to these Terms and Conditions.</p>
      
      <p>The <b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> General Terms and Conditions apply.</p>
    `
  },
  15: {
    id: 15,
    title: `Upgraded & Modernised ${capitalize(import.meta.env.VITE_SITE_NAME)} app`,
    image: `https://tekio.s3.eu-north-1.amazonaws.com/${import.meta.env.VITE_SITE_NAME}/promotion_cards/Upgraded & Modernised betalarab app.png`,
    category: "SPORTS",
    content: `
      <h2>We are excited to announce the release of an upgraded <b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> app version.</h2>
      
      <p>By incorporating the latest trends and cutting-edge technologies in the industry we aim to provide our Players with a more enjoyable and seamless betting experience.</p>
      
      <br />
      
      <h3 style="font-weight: bold; line-height: 2.5;">What to expect in the upgraded <b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> App?</h3>
      
      <ul style="list-style-type: disc; padding-left: 20px;">
        <li>Faster loading</li>
        <li>Smoother navigation</li>
        <li>More intuitive user interface</li>
        <li>Increased functionality</li>
      </ul>
      
      <br />
      
      <p>*Enjoy Casino, Sports, Live Casino, Poker, Belote, TV Games, Virtual Games, Skill games, eSports via <b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> App.</p>
      
      <p>*Stay tuned to receive information about our newest, exclusive and unique offers via the <b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> app.</p>
      
      <br />
      
      <p><b>DOWNLOAD APP (Google Play)</b> "soon"</p>
      
      <p><b>DOWNLOAD APP (App Store)</b> "soon"</p>
    `
  },
  16: {
    id: 16,
    title: "Welcome bonus",
    image: `https://tekio.s3.eu-north-1.amazonaws.com/${import.meta.env.VITE_SITE_NAME}/promotion_cards/Welcome bonus.png`,
    category: "WELCOME BONUS",
    content: `
      <h2>100% welcome bonus</h2>
      
      <p>Start the endless fun with the craziest sports events on <b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b></p>
      
      <p>Kick off with up to 500 usd welcome bonus in a few steps.</p>
      
      <br />
      
      <h3 style="font-weight: bold; line-height: 2.5;">HOW TO QUALIFY :</h3>
      
      <ul style="list-style-type: disc; padding-left: 20px;">
        <li>Register or login on ${import.meta.env.VITE_SITE_DOMAIN}.</li>
        <li>Successfully verify your account: go to Verify Account → Upload your identity documents from the Documents page and wait for your documents to be approved.</li>
        <li>Wager 5 times the bonus amount in accumulator bets. Each accumulator bet must contain 3 or more events. At least 3 of the events included in an accumulator must have odds of 1.40 or higher. The start dates of all of these events should not be later than the validity period of this offer.</li>
      </ul>
      
      <p>Minimum bonus to get is 10 usd and maximum is 500usd</p>
    `
  },
  17: {
    id: 17,
    title: "Wheel Of Chance !",
    image: `https://tekio.s3.eu-north-1.amazonaws.com/${import.meta.env.VITE_SITE_NAME}/promotion_cards/Wheel Of Chance !.png`,
    category: "CASINO",
    content: `
      <h2>Welcome to <b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> wonder Wheel</h2>
      
      <h3 style="font-weight: bold; line-height: 2.5;">Get Spins:</h3>
      
      <p>Complete the achievements below to receive free spins</p>
      
      <br />
      
      <h3 style="font-weight: bold;">Casino Slots Achievements:</h3>
      
      <ul style="list-style-type: disc; padding-left: 20px;">
        <li>Bet an amount of 1 USD Daily and Receive 1 Spin</li>
        <li>Bet an amount of 15USD Weekly and Receive 1 Spin</li>
        <li>Bet an amount of 60USD Monthly and Receive 1 Spin</li>
      </ul>
      
      <p><b>*Condition:</b> Spade, 1x2, Zeus and One touch have been exclude from chancy wheel, when user play on the mentioned providers he won't receive free spin on wheel</p>
      
      <h3 style="font-weight: bold;">Sportsbook Achievements:</h3>
      
      <ul style="list-style-type: disc; padding-left: 20px;">
        <li>Place 1 USD Sport bet daily and receive 1 Wonder Wheel Spin.</li>
        <li>Place 10 USD Sport bet weekly and receive 1 Wonder Wheel Spin.</li>
        <li>Place 100 Multiple Bet with minimum bet amount of 1USD Monthly and receive 1 Wonder Wheel Spin.</li>
      </ul>
      
      <p><b>*Condition:</b> minimum odd must be 1.5</p>
      
      <br />
      
      <h3 style="font-weight: bold; line-height: 2.5;">Win Prizes:</h3>
      
      <p>Spin the wheel and receive prizes:</p>
      
      <ul style="list-style-type: disc; padding-left: 20px;">
        <li><b>1-FreeSpin:</b> Win 10 Slot Free Spin on all Popok Gaming</li>
        <li><b>2-Sport Bet:</b> Win a sports free Bet , minimum bet on 3 matches 1.5 minimum odd.</li>
        <li><b>3-Cash$:</b> Win Cash$ symbol, collect 25 symbols to win 200USD.</li>
        <li><b>4-Cash Bonus:</b> Win instant cash to your account</li>
        <li><b>5-Car:</b> Win a car by collecting all the parts</li>
        <li><b>6-Rolex Draw:</b> Win Rolex Symbol, collect 30 Symbols to win a ticket for a Genuine Rolex Pepsi Draw every 6 months.</li>
        <li><b>7-Respin:</b> Win Wonder Wheel free spins</li>
        <li><b>8-Hard luck:</b> No Win.</li>
      </ul>
      
      <br />
      
      <h3 style="font-weight: bold; line-height: 2.5;">Car Parts:</h3>
      
      <p><b>${capitalize(import.meta.env.VITE_SITE_NAME)}</b> gives you the Chance to win a Brand-New BMW 2 Series 2024.</p>
      
      <p>Collect All needed parts to complete your car and WIN!</p>
      
      <ul style="list-style-type: disc; padding-left: 20px;">
        <li>License plate = 100 Parts</li>
        <li>Chair = 50 Parts</li>
        <li>Key = 10 Parts</li>
        <li>Steering wheel = 30 Parts</li>
        <li>Door = 20 Parts</li>
      </ul>
    `
  },
};