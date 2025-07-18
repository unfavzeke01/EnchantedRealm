import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCard } from "@/components/message-card";
import { AdminManagement } from "@/components/admin-management";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Users, MessageCircle, Heart, Zap, LogOut, Lock, Settings } from "lucide-react";
import { useLocation } from "wouter";
import type { MessageWithReplies } from "@shared/schema";

export default function Admin() {
  const [selectedRecipient, setSelectedRecipient] = useState("Admin");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  // All hooks moved to the top
  const { data: recipients = [] } = useQuery<string[]>({
    queryKey: ["/api/recipients"],
    enabled: isAuthenticated,
  });

  const { data: privateMessages = [], isLoading: loadingPrivate } = useQuery<MessageWithReplies[]>({
    queryKey: ["/api/messages/recipient", selectedRecipient],
    enabled: isAuthenticated && !!selectedRecipient,
  });

  const { data: publicMessages = [], isLoading: loadingPublic } = useQuery<MessageWithReplies[]>({
    queryKey: ["/api/messages/public"],
    enabled: isAuthenticated,
  });

  const makePublicMutation = useMutation({
    mutationFn: async (messageId: number) => {
      return await apiRequest("PATCH", `/api/messages/${messageId}`, { isPublic: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Message made public",
        description: "The message is now visible to everyone.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to make message public.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const authenticated = localStorage.getItem("adminAuthenticated");
    if (authenticated === "true") {
      setIsAuthenticated(true);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-light mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">Please log in to access the admin panel.</p>
            <Button onClick={() => navigate("/login")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Rest of your component remains exactly the same...
  const totalReplies = publicMessages.reduce((sum, msg) => sum + msg.replies.length, 0);
  const activeUsers = new Set(publicMessages.map(msg => msg.replies.map(r => r.nickname)).flat()).size;

  // ... [rest of your original code remains unchanged]