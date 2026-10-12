import dbConnect from "@/lib/db";
import { Doctor } from "@/models/Doctor";
import { Event } from "@/models/Event";
import { JoinRequest } from "@/models/JoinRequest";
import { ContactMessage } from "@/models/ContactMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Users, Calendar, Mail, FileText } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";

export const instant = false;

export default async function AdminDashboard() {
  await connection(); // marks page as dynamic — fixes new Date() prerender error from Mongoose
  await dbConnect();
  
  const doctorsCount = await Doctor.countDocuments();
  const eventsCount = await Event.countDocuments();
  const pendingRequests = await JoinRequest.countDocuments({ status: 'pending' });
  const unreadMessages = await ContactMessage.countDocuments({ isRead: false });

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-serif text-primary mb-6 md:mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <Link href="/admin/doctors" className="group block">
          <Card className="border-none shadow-sm transition-all hover:shadow-md group-hover:border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">Total Doctors</CardTitle>
              <Users className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{doctorsCount}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/events" className="group block">
          <Card className="border-none shadow-sm transition-all hover:shadow-md group-hover:border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">Events</CardTitle>
              <Calendar className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{eventsCount}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/requests" className="group block">
          <Card className="border-none shadow-sm transition-all hover:shadow-md group-hover:border-accent/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-accent transition-colors">Pending Join Requests</CardTitle>
              <FileText className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{pendingRequests}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/enquiries" className="group block">
          <Card className="border-none shadow-sm transition-all hover:shadow-md group-hover:border-accent/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-accent transition-colors">Unread Messages</CardTitle>
              <Mail className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{unreadMessages}</div>
            </CardContent>
          </Card>
        </Link>

      </div>
    </div>
  );
}
