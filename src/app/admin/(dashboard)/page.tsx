import dbConnect from "@/lib/db";
import { Doctor } from "@/models/Doctor";
import { Event } from "@/models/Event";
import { JoinRequest } from "@/models/JoinRequest";
import { ContactMessage } from "@/models/ContactMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Users, Calendar, Mail, FileText } from "lucide-react";

export const instant = false;

export default async function AdminDashboard() {
  await dbConnect();
  
  const doctorsCount = await Doctor.countDocuments();
  const eventsCount = await Event.countDocuments();
  const pendingRequests = await JoinRequest.countDocuments({ status: 'pending' });
  const unreadMessages = await ContactMessage.countDocuments({ isRead: false });

  return (
    <div>
      <h1 className="text-3xl font-serif text-primary mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Doctors</CardTitle>
            <Users className="w-4 h-4 text-primary/50" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{doctorsCount}</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Events</CardTitle>
            <Calendar className="w-4 h-4 text-primary/50" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{eventsCount}</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Join Requests</CardTitle>
            <FileText className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{pendingRequests}</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unread Messages</CardTitle>
            <Mail className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{unreadMessages}</div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
