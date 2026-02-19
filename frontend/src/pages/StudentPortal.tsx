import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/ui/status-badge';
import { useWallet } from '@/hooks/useWallet';
import { generateFileHash, shortenAddress, submitAssignmentToBlockchain } from '@/lib/blockchain';
import { logSubmission } from '@/lib/api';
import { toast } from 'sonner';
import {
  GraduationCap,
  Upload,
  FileText,
  Hash,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Wallet
} from 'lucide-react';

const StudentPortal = () => {
  const { isConnected, address, connect, isConnecting } = useWallet();
  const [assignmentId, setAssignmentId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsHashing(true);
    setFileHash('');

    try {
      const hash = await generateFileHash(selectedFile);
      setFileHash(hash);
      toast.success('File hash generated successfully');
    } catch (error) {
      toast.error('Failed to generate file hash');
      console.error(error);
    } finally {
      setIsHashing(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assignmentId.trim()) {
      toast.error('Please enter the Assignment ID');
      return;
    }
    if (!fileHash) {
      toast.error('Please upload a file');
      return;
    }
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to blockchain
      const result = await submitAssignmentToBlockchain(assignmentId, fileHash);
      setTxHash(result.txHash);
      
      // Log to backend (optional - doesn't affect success)
      await logSubmission({
        student: address!,
        assignmentId,
        txHash: result.txHash
      });
      
      setSubmitted(true);
      toast.success('Assignment submitted successfully to the blockchain!');
    } catch (error: any) {
      if (error.message?.includes('Already submitted')) {
        toast.error('You have already submitted this assignment');
      } else if (error.code === 'ACTION_REJECTED') {
        toast.error('Transaction was rejected');
      } else {
        toast.error('Failed to submit assignment: ' + (error.reason || error.message));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setAssignmentId('');
    setFile(null);
    setFileHash('');
    setSubmitted(false);
    setTxHash('');
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12 animate-fade-in">
        <div className="max-w-2xl mx-auto">
          <Card className="border-success/50 bg-card shadow-card-hover">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Submission Successful!</h2>
              <p className="text-muted-foreground mb-6">
                Your assignment has been recorded on the blockchain.
              </p>
              
              <div className="bg-muted/50 rounded-lg p-4 text-left space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Wallet Address</span>
                  <span className="font-medium font-mono">{shortenAddress(address!)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Assignment ID</span>
                  <span className="font-medium font-mono">{assignmentId}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">File Hash</span>
                  <span className="font-mono text-xs text-right break-all max-w-[60%]">{fileHash}</span>
                </div>
                {txHash && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Transaction Hash</span>
                    <span className="font-mono text-xs text-right break-all max-w-[60%]">{txHash}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Timestamp</span>
                  <span className="font-medium">{new Date().toLocaleString()}</span>
                </div>
              </div>

              <Button onClick={resetForm} className="gradient-primary text-primary-foreground">
                Submit Another Assignment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Student Portal</h1>
          <p className="text-muted-foreground">
            Submit your assignment to the blockchain for permanent verification
          </p>
        </div>

        {/* Wallet Connection Card */}
        {!isConnected && (
          <Card className="mb-6 border-warning/50 bg-warning/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-warning" />
                <span className="text-sm font-medium">Connect your wallet to submit assignments</span>
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

        {/* Submission Form */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Assignment Submission</CardTitle>
            <CardDescription>
              Fill in your details and upload your assignment file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file">Upload Assignment File</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file" className="cursor-pointer">
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
                        <p className="text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Any file type accepted
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* File Hash Display */}
              {(isHashing || fileHash) && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Generated File Hash (SHA-256)
                  </Label>
                  <div className="bg-muted rounded-lg p-3 font-mono text-xs break-all flex items-center gap-2">
                    {isHashing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating hash...</span>
                      </>
                    ) : (
                      <>
                        <StatusBadge variant="success" pulse>Hash Ready</StatusBadge>
                        <span className="flex-1">{fileHash}</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Connected Wallet */}
              {isConnected && (
                <div className="bg-muted/50 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Connected Wallet</span>
                  <span className="font-mono text-sm">{shortenAddress(address!)}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isConnected || isSubmitting || !fileHash}
                className="w-full gradient-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting to Blockchain...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Assignment
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentPortal;
