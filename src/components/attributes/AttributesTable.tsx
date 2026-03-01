import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export type BaseAttribute = {
    id: number;
    name: string;
    status: string;
};

interface AttributesTableProps {
    data: BaseAttribute[];
}

export function AttributesTable({ data }: AttributesTableProps) {
    if (data.length === 0) {
        return (
            <div className="text-center p-8 text-muted-foreground border rounded-lg bg-muted/20">
                No records found.
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[100px] font-semibold">ID</TableHead>
                        <TableHead className="font-semibold">Name</TableHead>
                        <TableHead className="text-right font-semibold">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id} className="transition-colors hover:bg-muted/50">
                            <TableCell className="font-medium text-muted-foreground">{item.id}</TableCell>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-right">
                                <Badge
                                    variant={item.status.toLowerCase() === "enable" ? "default" : "secondary"}
                                    className={
                                        item.status.toLowerCase() === "enable"
                                            ? "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:text-emerald-400"
                                            : ""
                                    }
                                >
                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
