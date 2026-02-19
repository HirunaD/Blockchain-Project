import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/ui/status-badge';
import { generateFileHash, DEMO_SUBMISSIONS } from '@/lib/blockchain';
import { toast } from 'sonner';
import {
  CheckCircle,
  XCircle,
  Search,
  FileText,
  Hash,
  Upload,
  Loader2,
  Shield,
  GraduationCap,
  Clock
} from 'lucide-react';

interface VerificationResult {
  verified: boolean;
  submission?: {
    studentId: string;
    assignmentId: string;
    fileHash: string;
    timestamp: Date;
    submitter: string;
  };
}

const VerificationPage = () => {
  const [studentId, setStudentId] = useState('');
  const [assignmentId, setAssignmentId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [manualHash, setManualHash] = useState('');
  const [fileHash, setFileHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [verifyMethod, setVerifyMethod] = useState<'file' | 'hash'>('file');

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsHashing(true);
    setFileHash('');
    setResult(null);

    try {
      const hash = await generateFileHash(selectedFile);
      setFileHash(hash);
      toast.success('File hash generated');
    } catch (error) {
      toast.error('Failed to generate file hash');
    } finally {
      setIsHashing(false);
    }
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId.trim()) {
      toast.error('Please enter the Student ID');
      return;
    }
    if (!assignmentId.trim()) {
      toast.error('Please enter the Assignment ID');
      return;
    }

    const hashToVerify = verifyMethod === 'file' ? fileHash : manualHash;
    if (!hashToVerify) {
      toast.error(verifyMethod === 'file' ? 'Please upload a file' : 'Please enter the file hash');
      return;
    }

    setIsVerifying(true);
    setResult(null);

    try {
      // Simulate blockchain verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check against demo submissions
      const submission = DEMO_SUBMISSIONS.find(
        s => s.studentId.toLowerCase() === studentId.toLowerCase() &&
             s.assignmentId.toLowerCase() === assignmentId.toLowerCase()
      );

      if (submission) {
        const hashMatch = submission.fileHash.toLowerCase() === hashToVerify.toLowerCase();
        setResult({
          verified: hashMatch,
          submission: hashMatch ? submission : undefined
        });
        
        if (hashMatch) {
          toast.success('Submission verified successfully!');
        } else {
          toast.error('File hash does not match the blockchain record');
        }
      } else {
        setResult({ verified: false });
        toast.error('No submission found for this Student ID and Assignment ID');
      }
    } catch (error) {
      toast.error('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const resetForm = () => {
    setStudentId('');
    setAssignmentId('');
    setFile(null);
    setFileHash('');
    setManualHash('');
    setResult(null);
  };

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Verify Submission</h1>
          <p className="text-muted-foreground">
            Verify the authenticity and integrity of a submitted assignment
          </p>
        </div>

        {/* Verification Form */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle>Verification Details</CardTitle>
            <CardDescription>
              Enter the submission details and file to verify against the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-6">
              {/* Student ID */}
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="studentId"
                    placeholder="e.g., STU001"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="pl-10"
                    maxLength={20}
                  />
                </div>
              </div>

              {/* Assignment ID */}
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

              {/* Verification Method Toggle */}
              <div className="space-y-2">
                <Label>Verification Method</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={verifyMethod === 'file' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setVerifyMethod('file')}
                    className={verifyMethod === 'file' ? 'gradient-primary text-primary-foreground' : ''}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                  <Button
                    type="button"
                    variant={verifyMethod === 'hash' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setVerifyMethod('hash')}
                    className={verifyMethod === 'hash' ? 'gradient-primary text-primary-foreground' : ''}
                  >
                    <Hash className="w-4 h-4 mr-2" />
                    Enter Hash
                  </Button>
                </div>
              </div>

              {/* File Upload or Hash Input */}
              {verifyMethod === 'file' ? (
                <div className="space-y-2">
                  <Label>Upload File to Verify</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="verifyFile"
                    />
                    <label htmlFor="verifyFile" className="cursor-pointer">
                      {file ? (
                        <div className="space-y-2">
                          <FileText className="w-10 h-10 text-primary mx-auto" />
                          <p className="font-medium text-foreground">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-10 h-10 text-muted-foreground mx-auto" />
                          <p className="text-muted-foreground">Click to upload the file</p>
                        </div>
                      )}
                    </label>
                  </div>

                  {(isHashing || fileHash) && (
                    <div className="bg-muted rounded-lg p-3 font-mono text-xs break-all flex items-center gap-2">
                      {isHashing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                          <span>Generating hash...</span>
                        </>
                      ) : (
                        <>
                          <Hash className="w-4 h-4 flex-shrink-0 text-primary" />
                          <span>{fileHash}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="manualHash">File Hash (SHA-256)</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="manualHash"
                      placeholder="0x..."
                      value={manualHash}
                      onChange={(e) => setManualHash(e.target.value)}
                      className="pl-10 font-mono text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Verify Button */}
              <Button
                type="submit"
                disabled={isVerifying || isHashing}
                className="w-full gradient-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
                size="lg"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Verifying on Blockchain...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Verify Submission
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Verification Result */}
        {result && (
          <Card className={`shadow-card-hover animate-fade-in ${result.verified ? 'border-success/50' : 'border-destructive/50'}`}>
            <CardContent className="p-8 text-center">
              {result.verified ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-success" />
                  </div>
                  <h2 className="text-2xl font-bold text-success mb-2">Verified!</h2>
                  <p className="text-muted-foreground mb-6">
                    The file hash matches the blockchain record.
                  </p>
                  
                  <div className="bg-muted/50 rounded-lg p-4 text-left space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Student ID
                      </span>
                      <span className="font-mono font-medium">{result.submission?.studentId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Assignment ID
                      </span>
                      <span className="font-mono font-medium">{result.submission?.assignmentId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Submitted At
                      </span>
                      <span className="font-medium">{result.submission?.timestamp.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <span className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                        <Hash className="w-4 h-4" />
                        File Hash
                      </span>
                      <span className="font-mono text-xs break-all">{result.submission?.fileHash}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-destructive" />
                  </div>
                  <h2 className="text-2xl font-bold text-destructive mb-2">Not Verified</h2>
                  <p className="text-muted-foreground mb-6">
                    The submission could not be verified. Either the submission doesn't exist 
                    or the file hash doesn't match the blockchain record.
                  </p>
                </>
              )}

              <Button onClick={resetForm} variant="outline" className="mt-4">
                Verify Another Submission
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Demo Hint */}
        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Demo:</strong> Try verifying Student ID: <code className="font-mono bg-muted px-1 rounded">STU001</code>, 
              Assignment ID: <code className="font-mono bg-muted px-1 rounded">ASN001</code>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationPage;
