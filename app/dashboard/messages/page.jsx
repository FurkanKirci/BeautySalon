"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, User, Filter, Eye } from "lucide-react"
import { getContactMessages, updateContactMessageStatus } from "@/lib/actions/contact"

export default function MessagesPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedMessage, setSelectedMessage] = useState(null)

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      const data = await getContactMessages()
      setMessages(data)
    } catch (error) {
      console.error("Messages loading error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (messageId, newStatus) => {
    try {
      await updateContactMessageStatus(messageId, newStatus)
      await loadMessages()
    } catch (error) {
      console.error("Status update error:", error)
    }
  }

  const handleViewMessage = async (message) => {
    setSelectedMessage(message)
    if (message.status === "new") {
      await handleStatusChange(message._id, "read")
    }
  }

  const filteredMessages = messages.filter((message) => statusFilter === "all" || message.status === statusFilter)

  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Mesajlar</h1>
            <p className="text-muted-foreground">İletişim mesajlarını görüntüleyin ve yönetin</p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="new">Yeni</SelectItem>
                <SelectItem value="read">Okundu</SelectItem>
                <SelectItem value="replied">Yanıtlandı</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredMessages.map((message) => (
              <Card
                key={message._id}
                className={`cursor-pointer transition-colors ${
                  selectedMessage?._id === message._id ? "ring-2 ring-primary" : ""
                } ${message.status === "new" ? "bg-blue-50 dark:bg-blue-950/20" : ""}`}
                onClick={() => handleViewMessage(message)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {message.firstName} {message.lastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={message.status === "new" ? "default" : "secondary"}>
                        {message.status === "new" ? "Yeni" : message.status === "read" ? "Okundu" : "Yanıtlandı"}
                      </Badge>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="font-medium mb-2">{message.subject}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{message.message}</p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {message.email}
                    </div>
                    {message.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {message.phone}
                      </div>
                    )}
                    <span>{new Date(message.createdAt).toLocaleDateString("tr-TR")}</span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredMessages.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">
                    {statusFilter === "all" ? "Henüz mesaj bulunmuyor" : "Bu durumda mesaj bulunmuyor"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Message Detail */}
          <div>
            {selectedMessage ? (
              <Card className="sticky top-4">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {selectedMessage.firstName} {selectedMessage.lastName}
                      </CardTitle>
                      <CardDescription>{selectedMessage.subject}</CardDescription>
                    </div>
                    <Select
                      value={selectedMessage.status}
                      onValueChange={(value) => handleStatusChange(selectedMessage._id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Yeni</SelectItem>
                        <SelectItem value="read">Okundu</SelectItem>
                        <SelectItem value="replied">Yanıtlandı</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">
                          {selectedMessage.email}
                        </a>
                      </div>
                      {selectedMessage.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <a href={`tel:${selectedMessage.phone}`} className="text-primary hover:underline">
                            {selectedMessage.phone}
                          </a>
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        {new Date(selectedMessage.createdAt).toLocaleString("tr-TR")}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Mesaj:</h4>
                      <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>

                    <div className="border-t pt-4">
                      <Button className="w-full" asChild>
                        <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}>
                          <Mail className="w-4 h-4 mr-2" />
                          Yanıtla
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">Detayları görmek için bir mesaj seçin</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
