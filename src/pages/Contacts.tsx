import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchContacts, ContactGroup, ContactMessage } from "@/api/contacts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Phone, Calendar as CalendarIcon, MessageSquare } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const ContactCard = ({ contact }: { contact: ContactMessage }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const WORD_LIMIT = 20;

    const words = contact.message.split(" ");
    const isLongMessage = words.length > WORD_LIMIT;
    const displayMessage = isExpanded ? contact.message : words.slice(0, WORD_LIMIT).join(" ") + (isLongMessage ? "..." : "");

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg font-bold text-foreground/90">{contact.fullName}</CardTitle>
                        <CardDescription className="text-sm font-medium mt-1 text-primary/80">{contact.subject}</CardDescription>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-full whitespace-nowrap">
                        <CalendarIcon className="w-3 h-3 mr-1.5" />
                        {new Date(contact.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
                        <div className="flex items-center text-muted-foreground">
                            <Mail className="w-4 h-4 mr-2 text-primary/70" />
                            <a href={`mailto:${contact.email}`} className="hover:underline transition-colors">{contact.email}</a>
                        </div>
                        {contact.phoneNumber && (
                            <div className="flex items-center text-muted-foreground">
                                <Phone className="w-4 h-4 mr-2 text-primary/70" />
                                <a href={`tel:${contact.phoneNumber}`} className="hover:underline transition-colors">{contact.phoneNumber}</a>
                            </div>
                        )}
                    </div>
                    <div className="mt-1 text-sm bg-muted/40 p-4 rounded-lg border border-border/50 shadow-inner">
                        <div className="flex items-start">
                            <MessageSquare className="w-4 h-4 mr-2 mt-0.5 text-muted-foreground/60 shrink-0" />
                            <div className="w-full">
                                <p className="whitespace-pre-wrap leading-relaxed text-foreground/80">{displayMessage}</p>
                                {isLongMessage && (
                                    <button
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="text-primary hover:text-primary/80 transition-colors hover:underline text-xs font-semibold mt-3 focus:outline-none flex items-center"
                                    >
                                        {isExpanded ? "Read Less" : "Read More"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default function Contacts() {
    const { data: contactGroups, isLoading, isError } = useQuery({
        queryKey: ["contacts"],
        queryFn: fetchContacts,
    });

    if (isLoading) {
        return (
            <div className="p-6 space-y-6 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
                    <p className="text-muted-foreground mt-1">Manage messages and inquiries</p>
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px] animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center bg-destructive/10 p-8 rounded-2xl border border-destructive/20 shadow-sm max-w-md">
                    <MessageSquare className="w-12 h-12 text-destructive/50 mx-auto mb-4" />
                    <p className="text-destructive font-semibold text-lg">Failed to load contacts</p>
                    <p className="text-muted-foreground mt-2 text-sm">There was an error communicating with the server. Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">User Inquiries</h1>
                <p className="text-muted-foreground mt-1.5 text-base">View and manage support messages, feedback, and general contact submissions.</p>
            </div>

            {!contactGroups || contactGroups.length === 0 ? (
                <div className="bg-card text-card-foreground rounded-xl border border-border border-dashed p-16 text-center shadow-sm">
                    <div className="bg-secondary/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-10 h-10 text-muted-foreground/60" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No inquiries found</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">There are currently no messages or inquiries in the system to display.</p>
                </div>
            ) : (
                <Accordion type="multiple" defaultValue={contactGroups.map((g) => g.date)} className="space-y-6">
                    {contactGroups.map((group) => (
                        <AccordionItem value={group.date} key={group.date} className="border-none bg-transparent shadow-none">
                            <AccordionTrigger className="hover:no-underline bg-card px-5 py-3.5 rounded-xl border border-border shadow-sm mb-4 transition-all hover:shadow-md group">
                                <div className="flex items-center w-full">
                                    <span className="font-semibold text-lg group-hover:text-primary transition-colors">{group.date}</span>
                                    <div className="ml-auto mr-4 flex items-center bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide">
                                        {group.count} {group.count === 1 ? 'Message' : 'Messages'}
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-1 pb-4">
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 px-1">
                                    {group.data.map((contact) => (
                                        <ContactCard key={contact.ID} contact={contact} />
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </div>
    );
}
