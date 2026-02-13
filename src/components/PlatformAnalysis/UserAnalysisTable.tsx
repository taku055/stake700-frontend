import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { numberRound } from "@/helpers/numberRound";
import { tUserAnalysis } from "@/types/tUserAnalysis";
import TextWithCopy from "@/components/TextWithCopy";

interface IUserAnalysisTableProps {
  userData: tUserAnalysis[];
  selectedCurrencySymbol?: string;
}

export default function UserAnalysisTable({
  userData,
  selectedCurrencySymbol = "",
}: IUserAnalysisTableProps) {
  return (
    <div className="flex flex-col gap-4 card p-4 bg-[#0002]">
      <h5>User Analysis</h5>
      <Table
        removeWrapper
        aria-label="user-analysis"
        className="w-full overflow-x-auto"
      >
        <TableHeader>
          <TableColumn>No</TableColumn>
          <TableColumn>User ID</TableColumn>
          <TableColumn>User Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Deposit Count</TableColumn>
          <TableColumn>Deposit Amount</TableColumn>
          <TableColumn>Cash Out</TableColumn>
          <TableColumn>Bet Count</TableColumn>
          <TableColumn>Bet Amount</TableColumn>
          <TableColumn>Win Amount</TableColumn>
          <TableColumn>Avg Bet Size</TableColumn>
          <TableColumn>Bonus Balance</TableColumn>
          <TableColumn>Cash Balance</TableColumn>
          <TableColumn>Sport Bet</TableColumn>
          <TableColumn>Sport Win</TableColumn>
          <TableColumn>Slot Bet</TableColumn>
          <TableColumn>Slot Win</TableColumn>
          <TableColumn>Live Casino Bet</TableColumn>
          <TableColumn>Live Casino Win</TableColumn>
        </TableHeader>
        <TableBody>
          {userData.map((user, index) => (
            <TableRow
              key={user.userId}
              className="text-[12px] text-primary-800"
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {user.userId && <TextWithCopy text={user.userId} />}
              </TableCell>
              <TableCell>{user.userName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.depositCount}</TableCell>
              <TableCell>
                {selectedCurrencySymbol}
                {numberRound(user.depositAmount, 100).toLocaleString()}
              </TableCell>
              <TableCell>
                {selectedCurrencySymbol}
                {numberRound(user.cashOut, 100).toLocaleString()}
              </TableCell>
              <TableCell>{user.betCount}</TableCell>
              <TableCell className="text-green-600">
                {selectedCurrencySymbol}
                {numberRound(user.betAmount, 100).toLocaleString()}
              </TableCell>
              <TableCell className="text-blue-600">
                {selectedCurrencySymbol}
                {numberRound(user.winAmount, 100).toLocaleString()}
              </TableCell>
              <TableCell>
                {selectedCurrencySymbol}
                {numberRound(user.avgBetSize, 100).toLocaleString()}
              </TableCell>
              <TableCell>
                {selectedCurrencySymbol}
                {numberRound(user.bonusBalance, 100).toLocaleString()}
              </TableCell>
              <TableCell>
                {selectedCurrencySymbol}
                {numberRound(user.cashBalance, 100).toLocaleString()}
              </TableCell>
              <TableCell className="text-green-600">
                {selectedCurrencySymbol}
                {numberRound(user.sportBetAmount, 100).toLocaleString()}
              </TableCell>
              <TableCell className="text-blue-600">
                {selectedCurrencySymbol}
                {numberRound(user.sportWinAmount, 100).toLocaleString()}
              </TableCell>
              <TableCell className="text-green-600">
                {selectedCurrencySymbol}
                {numberRound(user.slotBetAmount, 100).toLocaleString()}
              </TableCell>
              <TableCell className="text-blue-600">
                {selectedCurrencySymbol}
                {numberRound(user.slotWinAmount, 100).toLocaleString()}
              </TableCell>
              <TableCell className="text-green-600">
                {selectedCurrencySymbol}
                {numberRound(user.livecasinoBetAmount, 100).toLocaleString()}
              </TableCell>
              <TableCell className="text-blue-600">
                {selectedCurrencySymbol}
                {numberRound(user.livecasinoWinAmount, 100).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
