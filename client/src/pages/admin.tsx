import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCard } from "@/components/message-card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Users, MessageCircle, Heart, Zap } from "lucide-react";
import type { MessageWithReplies } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: privateMessages = [], isLoading: loadingPrivate } = useQuery<MessageWithReplies[]>({
    queryKey: ["/api/messages/private"],
  });

  const { data: publicMessages = [], isLoading: loadingPublic } = useQuery<MessageWithReplies[]>({
    queryKey: ["/api/messages/public"],
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

  const totalReplies = publicMessages.reduce((sum, msg) => sum + msg.replies.length, 0);
  const activeUsers = new Set(publicMessages.map(msg => msg.replies.map(r => r.nickname)).flat()).size;

  const stats = [
    {
      title: "Private Messages",
      value: privateMessages.length,
      icon: MessageCircle,
      color: "bg-primary/10 text-primary"
    },
    {
      title: "Public Messages", 
      value: publicMessages.length,
      icon: Users,
      color: "bg-accent/10 text-accent"
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: Heart,
      color: "bg-yellow-500/10 text-yellow-600"
    },
    {
      title: "Total Replies",
      value: totalReplies,
      icon: Zap,
      color: "bg-purple-500/10 text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Admin Panel</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Private messages and community moderation
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Private Messages */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Private Messages</h2>
            {loadingPrivate ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading private messages...</p>
              </div>
            ) : privateMessages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No private messages yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {privateMessages.map((message) => (
                  <div key={message.id} className="border border-gray-200 rounded-lg p-6">
                    <MessageCard message={message} showReplies={false} />
                    <div className="flex items-center space-x-4 mt-4">
                      <Button 
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => {
                          // TODO: Implement private reply functionality
                          toast({
                            title: "Feature coming soon",
                            description: "Private reply functionality will be added soon.",
                          });
                        }}
                      >
                        Reply Privately
                      </Button>
                      <Button 
                        className="bg-accent hover:bg-accent/90"
                        onClick={() => makePublicMutation.mutate(message.id)}
                        disabled={makePublicMutation.isPending}
                      >
                        Make Public
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          // TODO: Implement archive functionality
                          toast({
                            title: "Feature coming soon",
                            description: "Archive functionality will be added soon.",
                          });
                        }}
                      >
                        Archive
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Moderation Tools */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Moderation Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Content Guidelines</h3>
                <p className="text-gray-600 text-sm mb-4">Review and update community guidelines</p>
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    toast({
                      title: "Feature coming soon",
                      description: "Content guidelines management will be added soon.",
                    });
                  }}
                >
                  Manage Guidelines
                </Button>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Message Reports</h3>
                <p className="text-gray-600 text-sm mb-4">View and handle reported messages</p>
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => {
                    toast({
                      title: "Feature coming soon",
                      description: "Message reporting system will be added soon.",
                    });
                  }}
                >
                  View Reports
                </Button>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">User Management</h3>
                <p className="text-gray-600 text-sm mb-4">Manage user permissions and blocks</p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Feature coming soon",
                      description: "User management system will be added soon.",
                    });
                  }}
                >
                  Manage Users
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
