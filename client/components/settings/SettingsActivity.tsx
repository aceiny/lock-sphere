import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

const loginHistory = [
    {
      date: "2024-02-11 14:30",
      device: "Chrome on Windows",
      location: "New York, USA",
      status : "success",
      ip: "192.168.1.1",
    },
    {
      date: "2024-02-10 09:15",
      device: "Safari on iPhone",
      status : "success",
      location: "London, UK",
      ip: "192.168.1.2",
    },
    {
      date: "2024-02-09 18:45",
      device: "Firefox on MacOS",
      location: "Paris, France",
      status: "failed",
      ip: "192.168.1.3",
    },
  ]
  
export default function SettingsActivity(){
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
                          <TableCell>{log.date}</TableCell>
                          <TableCell>{log.device}</TableCell>
                          <TableCell>{log.location}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                log.status === "success"
                                  ? "success"
                                  : "destructive"
                              }
                            >
                              {log.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono">{log.ip}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              </motion.div>
    )
}