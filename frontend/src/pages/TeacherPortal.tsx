import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/ui/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWallet } from '@/hooks/useWallet';
import { DEMO_SUBMISSIONS, shortenAddress } from '@/lib/blockchain';
import { toast } from 'sonner';
import {
  BookOpen,
  Calendar,
  Clock,
  Loader2,
  CheckCircle,
  AlertCircle,
  Wallet,
  FileText,
  History,
  Hash
} from 'lucide-react';

const TeacherPortal = () => {
  const { isConnected, connect, isConnecting } = useWallet();
  const [assignmentId, setAssignmentId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isSetting, setIsSetting] = useState(false);
  const [deadlines, setDeadlines] = useState<{ id: string; deadline: Date }[]>([]);
  const [filterAssignment, setFilterAssignment] = useState('');

  const handleSetDeadline = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assignmentId.trim()) {
      toast.error('Please enter an Assignment ID');
      return;
    }
    if (!deadline) {
      toast.error('Please select a deadline');
      return;
    }
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsSetting(true);

    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDeadlines(prev => [...prev.filter(d => d.id !== assignmentId), { id: assignmentId, deadline: new Date(deadline) }]);
      toast.success(`Deadline set for ${assignmentId}`);
      setAssignmentId('');
      setDeadline('');
    } catch (error: any) {
      toast.error('Failed to set deadline: ' + error.message);
    } finally {
      setIsSetting(false);
    }
  };

  const filteredSubmissions = filterAssignment
    ? DEMO_SUBMISSIONS.filter(s => s.assignmentId.toLowerCase().includes(filterAssignment.toLowerCase()))
    : DEMO_SUBMISSIONS;

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Teacher Portal</h1>
          <p className="text-muted-foreground">
            Manage assignment deadlines and view submission history
          </p>
        </div>

        {/* Wallet Connection Card */}
        {!isConnected && (
          <Card className="mb-6 border-warning/50 bg-warning/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-warning" />
                <span className="text-sm font-medium">Connect your wallet to manage assignments</span>
              </div>
              <Button
                onClick={connect}
                disabled={isConnecting}
                size="sm"
                className="gradient-primary text-primary-foreground"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {isConnecting ? 'Connecting...' : 'Connect'}
              </Button>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="deadline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="deadline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Set Deadline
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Submissions
            </TabsTrigger>
          </TabsList>

          {/* Set Deadline Tab */}
          <TabsContent value="deadline">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Set Assignment Deadline
                  </CardTitle>
                  <CardDescription>
                    Record the deadline on the blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSetDeadline} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="assignmentId">Assignment ID</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="assignmentId"
                          placeholder="e.g., ASN001"
                          value={assignmentId}
                          onChange={(e) => setAssignmentId(e.target.value)}
                          className="pl-10"
                          maxLength={20}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline Date & Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="deadline"
                          type="datetime-local"
                          value={deadline}
                          onChange={(e) => setDeadline(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={!isConnected || isSetting}
                      className="w-full gradient-primary text-primary-foreground"
                    >
                      {isSetting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Setting Deadline...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Set Deadline
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Active Deadlines */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Active Deadlines
                  </CardTitle>
                  <CardDescription>
                    Currently set assignment deadlines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {deadlines.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>No deadlines set yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {deadlines.map((d) => (
                        <div
                          key={d.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div>
                            <p className="font-mono font-medium">{d.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {d.deadline.toLocaleString()}
                            </p>
                          </div>
                          <StatusBadge
                            variant={d.deadline > new Date() ? 'success' : 'error'}
                          >
                            {d.deadline > new Date() ? 'Active' : 'Expired'}
                          </StatusBadge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Submission History Tab */}
          <TabsContent value="history">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <History className="w-5 h-5 text-primary" />
                      Submission History
                    </CardTitle>
                    <CardDescription>
                      All assignments submitted to the blockchain
                    </CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Filter by Assignment ID"
                      value={filterAssignment}
                      onChange={(e) => setFilterAssignment(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Student ID</TableHead>
                        <TableHead>Assignment ID</TableHead>
                        <TableHead className="hidden md:table-cell">File Hash</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead className="hidden sm:table-cell">Submitter</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No submissions found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredSubmissions.map((submission, index) => (
                          <TableRow key={index} className="hover:bg-muted/30">
                            <TableCell className="font-mono font-medium">
                              {submission.studentId}
                            </TableCell>
                            <TableCell>
                              <StatusBadge variant="info">{submission.assignmentId}</StatusBadge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center gap-2">
                                <Hash className="w-3 h-3 text-muted-foreground" />
                                <span className="font-mono text-xs">
                                  {submission.fileHash.slice(0, 10)}...{submission.fileHash.slice(-8)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {submission.timestamp.toLocaleDateString()}
                              <span className="text-muted-foreground ml-1">
                                {submission.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell font-mono text-xs">
                              {shortenAddress(submission.submitter)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 text-sm text-muted-foreground text-center">
                  Showing {filteredSubmissions.length} of {DEMO_SUBMISSIONS.length} submissions
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherPortal;
