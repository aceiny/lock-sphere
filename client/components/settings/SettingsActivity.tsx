import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useAuthLogs } from "@/lib/api/auth";

export default function SettingsActivity() {
  const { data } = useAuthLogs();
  const loginHistory = data?.data?.data ? data?.data?.data : [];
  console.log(loginHistory);
  return (
    <motion.div
      key="activity"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Login History</CardTitle>
          <CardDescription>
            Recent login attempts to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loginHistory.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>{log.loggedAt}</TableCell>
                  <TableCell>{log.user_agent}</TableCell>
                  <TableCell>{log.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        log.status === "SUCCESS" ? "success" : "destructive"
                      }
                    >
                      {log.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">{log.ip_address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
