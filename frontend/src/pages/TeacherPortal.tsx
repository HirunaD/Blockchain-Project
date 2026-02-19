import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/ui/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWallet } from '@/hooks/useWallet';
import { DEMO_SUBMISSIONS, shortenAddress, getAllSubmissions, Submission } from '@/lib/blockchain';
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
  Hash,
  RefreshCw
} from 'lucide-react';

const TeacherPortal = () => {
  const { isConnected, connect, isConnecting } = useWallet();
  const [assignmentId, setAssignmentId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isSetting, setIsSetting] = useState(false);
  const [deadlines, setDeadlines] = useState<{ id: string; deadline: Date }[]>([]);
  const [filterAssignment, setFilterAssignment] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  // Load submissions from blockchain
  const loadSubmissions = async () => {
    setIsLoadingSubmissions(true);
    try {
      const blockchainSubmissions = await getAllSubmissions();
      if (blockchainSubmissions.length > 0) {
        setSubmissions(blockchainSubmissions);
      } else {
        // Fall back to demo data if no blockchain submissions
        setSubmissions(DEMO_SUBMISSIONS);
      }
    } catch (error) {
      console.error('Failed to load submissions:', error);
      setSubmissions(DEMO_SUBMISSIONS);
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

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
    ? submissions.filter(s => s.assignmentId.toLowerCase().includes(filterAssignment.toLowerCase()))
    : submissions;

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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadSubmissions}
                      disabled={isLoadingSubmissions}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingSubmissions ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <div className="relative w-full sm:w-48">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Filter by Assignment"
                        value={filterAssignment}
                        onChange={(e) => setFilterAssignment(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Student Address</TableHead>
                        <TableHead>Assignment ID</TableHead>
                        <TableHead className="hidden md:table-cell">File Hash</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            {isLoadingSubmissions ? 'Loading...' : 'No submissions found'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredSubmissions.map((submission, index) => (
                          <TableRow key={index} className="hover:bg-muted/30">
                            <TableCell className="font-mono text-sm">
                              {shortenAddress(submission.studentAddress)}
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
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 text-sm text-muted-foreground text-center">
                  Showing {filteredSubmissions.length} of {submissions.length} submissions
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
